const mysql = require('mysql')
const db = require('./db')
const util = require('./util')
const StatusCodes=require('http-status-codes').StatusCodes
const tags = require('./tags')
const teacher=require('./teacher')



async function add_set (req, res, pool){
    let validation = validate_add_set(req)
    if( ! validation.ok ){
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return;
    }
    let body = req.body; 
    try {
        
        if ( ! await teacher.check_id(body.teacher_id,pool)){
            util.send_response(res,StatusCodes.NOT_FOUND,'teacher tosnot exists');
            return
        } 

        let date =new Date()
        var now_utc =  `${date.getUTCFullYear()}-${date.getUTCMonth()}-${ date.getUTCDate()}- ${date.getUTCHours()}-${date.getUTCMinutes()}-${ date.getUTCSeconds()}`;
        let values = [body.name,body.description,body.execution_instructions,now_utc,body.teacher_id ];
        let sql = mysql.format( `INSERT INTO sets( name,description, execution_instructions, date_of_last_edit,last_editor_id ) VALUES ( ? )`,[values] );
        let result = await db.mysql_insert( sql ,  pool); 
        if ("tags" in body && util.validate_string_array(body.tags).ok  && body.tags.length > 0 ){await add_set_taggings(result,body.tags,pool)}
        if ("tasks" in body && util.validate_id_array(body.tasks).ok && util.check_ids(pool,body.tasks,'tasks') && body.tasks.length > 0){// && 
         add_assignings(pool,result,body.tasks)
        }
        res.json({ 'id':result , 'msg':'The set has been added' });
        return;
    }catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}


async function update_set (req, res, pool){
    let validation = validate_update_set(req)
    if( ! validation.ok ){
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return;
    }    
    let body = req.body; 
    try {
        if (! await check_set_id(pool,body.id)){       
            util.send_response(res,StatusCodes.NOT_FOUND,'set does not exists')
            return;
        }
        if ( ! await teacher.check_id(body.teacher_id,pool)){
            util.send_response(res,StatusCodes.NOT_FOUND,'teacher tosnot exists');
            return
        } 
        let sql = build_update_sql_query(req)
        await db.mysql_insert( sql ,  pool); 
        
        if ("tags" in body && util.validate_string_array (body.tags).ok ){
            delete_set_taggings(body.id,pool)
            
         if(   body.tags.length >0 ) { add_set_taggings(body.id,body.tags,pool)}
        }
        res.json({'msg':'The tag has been updated'});

        return
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}

async function add_assignings_task (req, res, pool){
    let validation = validate_add_assignings(req)
    if( ! validation.ok ){
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return;
    }
    try {
        let body = req.body
        if (! (await  util.check_id(pool,body.set_id,'sets')  ||  await util.check_ids(pool,body.task_ids,'tasks') )){
            util.send_response(res,StatusCodes.NOT_FOUND,'tag or set does not exists')
            return;
        }  
        let new_assignings = await get_new_assignings(pool,body.set_id,body.task_ids)
        if (new_assignings.length>0){
        await  add_assignings(pool,body.set_id,new_assignings)
        // add_assignings()
        }
        res.json({  'msg':'The task is assigned with the set' });
        return;

    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'INTERNAL_SERVER_ERROR')
        return
    }
    
}


async function get_set(req,res,pool){
    let id = req.params.id ;
    let validation =util.validate_id (id)
    if (! validation  ){  
        //"Invalid email or ID number"
        util.send_response(res,StatusCodes.BAD_REQUEST,'invallid id')
        return
    }     
    try{
        if (! await check_set_id(pool,id)){
            util.send_response(res,StatusCodes.NOT_FOUND,'id does not exists');
            return;
        }
        
        let set =await get_set_(pool,id)
        set.date_of_last_edit =   util.format_date_time(set.date_of_last_edit)
        res.json(set);

    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}


async function duplicate_set(req,res,pool){
    // let set_id = req.params.id ;
    let body=req.body
    let validation =validate_dup_set (req)
    if ( ! validation.ok ){  
        
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    } 
    try {
        if ( ! await teacher.check_id(body.teacher_id,pool)){
            util.send_response(res,StatusCodes.NOT_FOUND,'teacher does not exists');
            return
        } 

        let set =await get_set_(pool,body.set_id)
        let date =new Date()
        var now_utc =  `${date.getUTCFullYear()}-${date.getUTCMonth()}-${ date.getUTCDate()}- ${date.getUTCHours()}-${date.getUTCMinutes()}-${ date.getUTCSeconds()}`;
        let values = [set.name,set.description,set.execution_instructions,now_utc,body.teacher_id ];
        let sql = mysql.format( `INSERT INTO sets( name,description, execution_instructions, date_of_last_edit,last_editor_id ) VALUES ( ? )`,[values] );
        let result_id = await db.mysql_insert( sql ,  pool); 
        if ("tags" in set && set.tags.length > 0 ){await add_set_taggings(result_id,set.tags,pool)}
      
        if ("tasks" in set && set.tasks.length > 0 ){// && 
        let task_ids = set.tasks.map( (task)=>{return task.id} );
        await add_assignings(pool,result_id,task_ids)
        
        }
        res.json({ 'id':result_id , 'msg':'The set has been duplicated' });
        
       
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'INTERNAL_SERVER_ERROR')
        return
    }


}

async function get_set_list(req,res,pool){
   
    try{
        let sql_details =  `SELECT  sets.id,sets.description FROM sets `
        let sets = await db.mysql_query_get_rows( sql_details, pool ); 
        res.json( {sets:sets});
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return;
    }
}


async function search_sets(req,res,pool){
    
    let search_tags = req.params.tags.split(",")
    let validation =util.validate_id_array(search_tags)
    if (! validation.ok  ){  
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    }     
    {   
        try{             
            let sql =  `SELECT  sets.id,sets.description
                FROM sets 
                INNER  JOIN set_taggings  ON set_taggings.set_id = sets.id 
                INNER JOIN tags  ON set_taggings.tag_id = tags.id
                WHERE tags.tag IN (?)`
            sql = mysql.format(  sql ,[search_tags] )
            let sets = await db.mysql_query_get_rows( sql, pool ); 

            let result_obj ={}; 
            result=[]
            sets.map((set) => { 
                result_obj[set.id] = set;
            });
           
            for (let key in result_obj) {
                result.push(result_obj[key])
            }
            
            res.json( {sets:result});
        } catch (error) {
            console.log(error)
            util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            return
        }
    }
}



async function delete_set (req,res,pool){
    let id= req.params.id ;
    let validation =util.validate_id  (req.params.id)
    if (! validation ){  
        util.send_response(res,StatusCodes.BAD_REQUEST,'invallid id')
        return
    } 
    let result;
    let  sql_set = `DELETE FROM sets WHERE '${id}'= id `;
    let sql_set_taggings= `DELETE FROM set_taggings WHERE '${id}'= set_id `;
    let sql_set_assignment= `DELETE FROM set_assign WHERE '${id}'= set_id `;


    try{
        await db.mysql_query(sql_set,  pool );
        await db.mysql_query(sql_set_taggings,  pool );
        await db.mysql_query(sql_set_assignment,  pool );
    
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')

        return 
    }
    res.json({msg:" set  will not exist"})
}

async function clear_tasks(req,res,pool){
    let set_id= req.body.set_id ;
    let validation =util.validate_id (set_id)
    if (! validation  ){  
        util.send_response(res,StatusCodes.BAD_REQUEST,'invalid set_id')
        return
    } 
    
    try{
        let sql= mysql.format(`DELETE FROM set_assign WHERE ? = set_id `,[set_id])
        await db.mysql_query(sql ,  pool );
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')

        return 
    }
    res.json({msg:" The list of tasks has been cleared"})

}


async function remove_tasks(req,res,pool){
    let set_id= req.body.set_id
    let task_ids = req.body.task_ids
    let validation =validate_remove_tasks(req.body)
    if (! validation.ok  ){  
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    } 
    try{
        if (! await check_set_id (pool, set_id) ){
            util.send_response(res,StatusCodes.NOT_FOUND,'set id does not exsists')
            return
        }
        let sql= mysql.format(`DELETE FROM set_assign WHERE set_id = ? AND task_id IN (?) `,[set_id, task_ids])
        await db.mysql_query(sql ,  pool );
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return 
    }
    res.json({msg:" The list of tasks has been cleared"})

}

module.exports.add_set = add_set
module.exports.update_set=update_set
module.exports.add_assignings_task = add_assignings_task
module.exports.get_set=get_set
module.exports.get_set_list= get_set_list
module.exports.search_sets=search_sets
module.exports.delete_set=delete_set
module.exports.duplicate_set=duplicate_set
module.exports.clear_tasks=clear_tasks
module.exports.remove_tasks=remove_tasks


/////////////////////           checkers

async function check_set_id(pool,id){
    let sql = mysql.format( `SELECT COUNT(*) FROM sets WHERE id = ?`,[id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}

//...........................................................validations
function validate_add_set(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "}  }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    
    let body=req.body;
    if ( ! ("name" in body) ){ return {ok:false,error:"Property name does not exist"}}
    if ( ! ("description" in body) ){ return { ok:false,error:"Property description  does not exist" }   }
    if ( ! ("execution_instructions" in body) ){ return {ok: false,error:"Property execution_instructions  does not exist" }   }
    if ( typeof(body.name) !== 'string' || typeof(body.description) !== 'string' ||  typeof(body.execution_instructions) !== 'string' ){
        return {ok:false,error:"  Properties name ,description and execution instructions  should be a string"}
    }
    if ( body.name )
    
    return{"ok":true}
    
}
function validate_update_set(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "}  }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    let body=req.body;
    // if ( ! ("name" in body) ){ return {ok:false,error:"Property name does not exist"}}
    // if ( ! ("description" in body) ){ return { ok:false,error:"Property description  does not exist" }   }
    // if ( ! ("execution_instructions" in body) ){ return {ok: false,error:"Property execution_instructions  does not exist" }   }
    if ( ("name" in body) && typeof(body.name) !== 'string'  ){   return {ok:false,error:"  Properties name   should be a string"}}
    if ( ("description" in body) && typeof(body.description) !== 'string'  ){   return {ok:false,error:"  Properties description should be a string"}}
    if ( ("execution_instructions" in body) && typeof(body.execution_instructions) !== 'string'  ){   return {ok:false,error:"Properties execution_instructions should be a string"}}


    return{"ok":true}
}
function validate_add_assignings(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "}  }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    let body=req.body;
   
    if ( ! ("set_id" in body) ){ return {ok: false,error:"Property set_id  does not exist" }   }
    if ( ! ("task_ids" in body) ){ return {ok: false,error:"Property task_ids  does not exist" }   }
    if( ! util.validate_id_array(body.task_ids).ok ) {return {"ok":false,'error':'invalid task_ids ' } }
//    let e= util.validate_id(body.set_id).ok 
    if( ! util.validate_id(body.set_id) ) {return {"ok":false,'error':'invalid set_id' } }
    
    return{"ok":true}
}

function validate_dup_set(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "}  }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    let body=req.body;
   
    if ( ! ("set_id" in body) ){ return {ok: false,error:"Property set_id  does not exist" }   }
    if ( ! ("teacher_id" in body) ){ return {ok: false,error:"Property teacher_id  does not exist" }   }
    if( ! util.validate_id(body.teacher_id)) {return {"ok":false,'error':'invalid teacher_id ' } }
    if( ! util.validate_id(body.set_id) ) {return {"ok":false,'error':'invalid set_id' } }
    
    return{"ok":true}
}


function validate_remove_tasks(body){

    if (!( "set_id" in body && "task_ids" in body )){
        return {ok:false,error:"The properties set_id or task_ids does not exist"} 
    }

    let validation = util.validate_id(body.set_id)
    if (! validation){
        return {ok:false,error:'invallid id'} 
    }
    validation = util.validate_id_array(body.task_ids)
    if (! validation){
        return {ok:false,error:'invallid id'} 
    }
    return{ok:true}
}

//...........................................................Auxiliary functions


async function add_set_taggings (set_id,search_tags,pool){
    try {
       
       if (! await check_set_id(pool,set_id)  ){   
            return{ok:false,error:"task id does not exists" }
        } 
        //Tags that do not yet exist  
        let new_tags=[];
        for (let i = 0; i <search_tags.length ; i++) {
            if ( ! await  tags.check_tag(search_tags[i],pool)){
                new_tags.push( [search_tags[i]] )
            }
        }
        //insert new tags
        if (new_tags.length > 0 ){
        let sql_insert_tags = mysql.format( `INSERT INTO tags  (tag) VALUES ?`, [new_tags] );
        await db.mysql_insert( sql_insert_tags ,  pool); 
        }
        //get ids of tags
        let sql_get_tag_ids = mysql.format( `SELECT id FROM tags WHERE TAG IN   (?)`,[search_tags]  );
        let tag_ids_obj  = await db.mysql_query_get_rows(sql_get_tag_ids,pool); 
        let tag_vs_id = tag_ids_obj.map((tag_id) => {  return [set_id,tag_id.id] });
        
        //tagging tsk
        if (search_tags>0){
            let sql_insert_task_taggings = mysql.format( `INSERT INTO set_taggings  (set_id,tag_id) VALUES ?`,[tag_vs_id]  );// check 
            await db.mysql_insert( sql_insert_task_taggings ,  pool); 
        }
        return{ok:true};

    } catch (error) {
        // return{ok:false,'error':error};
        throw error;
    }
}


function build_update_sql_query(req){
    let body = req.body
    let date = new Date;
    let now_utc =  `${date.getUTCFullYear()}-${ date.getUTCMonth()}-${ date.getUTCDate()}- ${date.getUTCHours()}-${date.getUTCMinutes()}-${ date.getUTCSeconds()}`;
    let keys= [`date_of_last_edit`,`last_editor_id` ]
    let values=[now_utc,body.teacher_id ]
    if ('name' in body ){keys.push('name') ;values.push(body.name)}
    if ('description' in body ){keys.push('description');values.push(body.description) }
    if ('execution_instructions' in body ){keys.push('execution_instructions');values.push(body.execution_instructions) }
    
    let set = "";
    for (let i =0; i < keys.length;i++){
        set += `${keys[i]}=?`;
        ( i < ( keys.length-1 ) ) ? set += `,` : null; 
    }
    let sql = mysql.format(`UPDATE sets SET ${set} WHERE '${body.id}' = id `,values);
    return sql;

}


async function add_set_taggings (set_id,search_tags,pool){
    try {
        //check if task exists
        if (! await check_set_id(pool,set_id)  ){   
            return{ok:false,error:"task id does not exists" }
        } 
        //Tags that do not yet exist  
        let new_tags=[];
        for (let i = 0; i <search_tags.length ; i++) {//   for of
            if ( ! await tags.check_tag(search_tags[i],pool)){
                new_tags.push( [search_tags[i]] )
            }
        }
        //insert new tags
        if (new_tags.length > 0 ){
        let sql_insert_tags = mysql.format( `INSERT INTO tags  (tag) VALUES ?`, [new_tags] );
        let result = await db.mysql_insert( sql_insert_tags ,  pool); 
        }
        //get ids of tags
        let sql_get_tag_ids = mysql.format( `SELECT id FROM tags WHERE TAG IN   (?)`,[search_tags]  );
        let tag_ids_obj  = await db.mysql_query_get_rows(sql_get_tag_ids,pool); 
        let tag_vs_id = tag_ids_obj.map((tag_id) => {  return [set_id,tag_id.id] });
        
        //tagging tsk
        let sql_insert_set_taggings = mysql.format( `INSERT INTO set_taggings  (set_id,tag_id) VALUES ?`,[tag_vs_id]  );// check 
        await db.mysql_insert( sql_insert_set_taggings ,  pool); 
        
        return{ok:true};

    } catch (error) {
        // return{ok:false,'error':error};
        throw error;
    }
}

async function delete_set_taggings (set_id,pool){
    
    try {
        let  sql =mysql.format( `DELETE FROM set_taggings WHERE ? = set_id `,set_id);
        await db.mysql_query( sql,pool); 
        return{ok:true};

    } catch (error) {
        console.log(error)
        throw error;
    }
}


async function add_assignings(pool,set_id,assignings ){

    try{   
        let task_vs_assign= assignings.map((assign) => {  return[set_id,assign]  });
        let sql_insert_assignings = mysql.format( `INSERT INTO set_assign  (set_id,task_id) VALUES ?`,[task_vs_assign]  );// check 
        await db.mysql_insert( sql_insert_assignings ,  pool); 
    }catch (error) {
        throw(error)
    } 

}

// return task_ids from array that  does not exists
async function get_new_assignings(pool,set_id,task_ids){
    try{
        // let task_vs_set= task_ids.map((task_id) => {  return[set_id,task_id]   });
        let sql = mysql.format( `SELECT task_id FROM set_assign WHERE set_id=? AND task_id IN (?)  `,[ set_id,task_ids ] );
        let existing_ids = await  db.mysql_query_get_rows (sql,pool)
        let existing_ids_arr= existing_ids.map((id_obj) => {  return id_obj.task_id  });
        let result =[]
         task_ids.map((task_id) => {  
            if(! existing_ids_arr.includes(task_id) ){result.push(task_id)}
            });
        return result;
    }catch (error) {
        throw(error)
    }
}

async function get_set_(pool,id){ 
    try {
        let sql_tags = `SELECT tag FROM tags 
        INNER JOIN set_taggings  ON tags.id = set_taggings.tag_id 
        INNER JOIN sets  ON set_taggings.set_id = sets.id
        WHERE sets.id = ?`
        let sql_details = mysql.format( `SELECT teachers.first_name ,teachers.last_name, name,sets.id,description,
        execution_instructions , date_of_last_edit,last_editor_id  FROM sets,teachers 
        WHERE ? = sets.id AND last_editor_id=teachers.id  ` ,id )
       
        let sql_tasks = mysql.format( `SELECT tasks.id ,tasks.description FROM tasks
        INNER JOIN set_assign  ON set_assign.task_id = tasks.id 
        INNER JOIN sets  ON set_assign.set_id = sets.id
        WHERE sets.id = ?`,id)
                     
        sql_tags = mysql.format(  sql_tags ,  id )
        let search_tags = await db.mysql_query_get_rows( sql_tags , pool );
        let tasks = await db.mysql_query_get_rows( sql_tasks , pool );
        
        let result = await db.mysql_query_get_rows( sql_details, pool ); 
        result=result[0]
        result.tags=[]
        result.tasks=tasks
        result.last_editor=`${result.first_name}  ${result.last_name}`
        delete result.last_name
        delete result.first_name
        // delete result.last_editor_id
        search_tags.map((tag) => {  result.tags.push(tag.tag)  });
        return result

       
    } catch (error) {
        throw(error)
    }

}


