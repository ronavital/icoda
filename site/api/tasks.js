const mysql = require('mysql')
const db = require('./db')
const util = require('./util')
const teacher = require('./teacher')

const StatusCodes=require('http-status-codes').StatusCodes




async function add_task (req, res, pool){
    let validation = validate_add_task(req)
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
        var now_utc =  `${date.getUTCFullYear()}-${ date.getUTCMonth()}-${ date.getUTCDate()}- ${date.getUTCHours()}-${date.getUTCMinutes()}-${ date.getUTCSeconds()}`;
        let values = [body.description,body.execution_instructions,now_utc,body.task,body.teacher_id];
        let sql = mysql.format( `INSERT INTO tasks ( description, execution_instructions, date_of_last_edit,task,last_editor_id ) VALUES ( ? )`,[values] );
        let result = await db.mysql_insert( sql ,  pool); 
        if ("tags" in body && validate_tags(body.tags).ok ){await add_task_taggings(result,body.tags,pool)}
        res.json({ 'id':result , 'msg':'The task has been added' });
        return;
    }catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}


async function update_task (req, res, pool){
    let validation = validate_update_task(req)
    if( ! validation.ok ){
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return;
    }    
    let body = req.body; 
    try {
        if (! await check_id(pool,body.id)){       
            util.send_response(res,StatusCodes.NOT_FOUND,'id does not exists')
            return;
        }
        if ( ! await teacher.check_id(body.teacher_id,pool)){
            util.send_response(res,StatusCodes.NOT_FOUND,'teacher tosnot exists');
            return
        } 
        let sql = build_update_sql_query(req)
        await db.mysql_insert( sql ,  pool); 
        res.json({'msg':'The tag has been updated'});
        
        if ("tags" in body && validate_tags(body.tags).ok ){
            await delete_task_taggings(body.id,pool)
            await add_task_taggings(body.id,body.tags,pool)
        }

        return
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}


async function get_task(req,res,pool){
    let id = req.params.id ;
    let validation =validate_id (id)
    if (! validation.ok  ){  
        //"Invalid email or ID number"
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    }     
    try{
        if (! await check_id(pool,id)){
            util.send_response(res,StatusCodes.NOT_FOUND,'task does not exists');
            return;
        }
        let sql_tags = `SELECT tag FROM tags 
        INNER JOIN task_taggings  ON tags.id = task_taggings.tag_id 
        INNER JOIN tasks  ON task_taggings.task_id = tasks.id
        WHERE tasks.id = ?`
        let sql_details = mysql.format( `SELECT teachers.first_name ,teachers.last_name, tasks.id,description,execution_instructions,task , date_of_last_edit,last_editor_id  
                                    FROM tasks,teachers 
                                    WHERE ? = tasks.id AND last_editor_id=teachers.id  ` ,id )
      
        sql_tags = mysql.format(  sql_tags ,  id )
        let tags = await db.mysql_query_get_rows( sql_tags , pool );
        let result = await db.mysql_query_get_rows( sql_details, pool ); 
        result=result[0]
        result.tags=[]
        result.last_editor=`${result.first_name}  ${result.last_name}`
        delete result.last_name
        delete result.first_name
        tags.map((tag) => {  result.tags.push(tag.tag)  });
        result.date_of_last_edit= util.format_date_time(result.date_of_last_edit)

        res.json(result);

    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }

}


async function search_task(req,res,pool){
    
    let tags = req.params.tags.split(",")
    let validation =validate_tags(tags)
    if (! validation.ok  ){  
        //"Invalid email or ID number"
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    }     
    {   
        
        try{
            
           
            let query = `SELECT DISTINCT tasks.id AS task_id,tasks.description   
                FROM   tasks
                INNER JOIN task_taggings  ON task_taggings.task_id = tasks.id
                INNER JOIN tags ON tags.id = task_taggings.tag_id
                WHERE tags.tag IN (?)`
            let sql = mysql.format(  query ,  [tags] )
            let result = await db.mysql_query_get_rows( sql, pool ); 
            res.json(result);
        } catch (error) {
            console.log(error)
            util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            return
        }
    }
}


async function get_task_list(req,res,pool){
   
    try{
        let sql = `SELECT tasks.id,tasks.description
            FROM   tasks`   

        let tasks = await db.mysql_query_get_rows( sql, pool ); 
        
        res.json( {tasks:tasks});
        
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return;
    }
}


async function delete_task (req,res,pool){
    let id= req.params.id ;
    let validation =validate_id  (req.params.id)
    if (! validation.ok  ){  
        // "Invalid email or ID number"
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)

        return
    } 
    let result;
    let  sql_task = `DELETE FROM tasks WHERE '${id}'= id `;
    let sql_task_taggings= `DELETE FROM task_taggings WHERE '${id}'= task_id `;

    try{
        result = await db.mysql_query(sql_task,  pool );
        result = await db.mysql_query(sql_task_taggings,  pool );
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')

        return 
    }
    res.json({msg:" tasks  will not exist"})
}



module.exports.add_task = add_task;
module.exports.update_task  = update_task;
module.exports.get_task = get_task ;
module.exports.search_task = search_task ;
module.exports.get_task_list=get_task_list;
module.exports.delete_task =delete_task;
module.exports.check_id=check_id


/////////////////////////     validations
function validate_add_task(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "} }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    let body=req.body;
    if ( ! ("task" in body) ){ return {ok:false,error:"Property task does not exist"}}
    if ( ! ("description" in body) ){ return {ok:false,error:"Property description  does not exist" }   }
    if ( ! ("execution_instructions" in body) ){ return {ok:false,error:"Property execution_instructions  does not exist" }   }
    return{"ok":true}
    
}


function validate_update_task(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "}  }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    let body=req.body;
    if ( ! ("id" in req.body) ){
        return {ok:false,error:"Property id  does not exist"}}
    if ( !("task" in req.body) && !("description" in req.body) && !("execution_instructions" in req.body)  ){
        return {ok:false,error:"Must contain at least one field to update"}}
    return{"ok":true}
    
}


function validate_id (id){
   
    if ( Number.isInteger(Number(id) )){  return {"ok":true } }
        else {return {"ok":false,"error":"Invalid  ID number"}}
    
}

function validate_tags (tags){
    // const regex_tag=/#[A-Za-z0-9_]*/g

    if(tags.length==0 || ! Array.isArray(tags)) {return {"ok":false}}
    // let checker=tags.map((tag) => {  return regex_tag.test(tags)  });
    // if (checker.includes(false)){return {"ok":false,"error":"One of the tags is invalid"}}
    return{"ok":true}

}

/////////////////////           checkers
 

async function check_id(pool,task_id){
    let sql = mysql.format( `SELECT COUNT(*) FROM tasks INNER JOIN teachers ON last_editor_id = teachers.id WHERE tasks.id = ? AND teachers.deleted = 0 `,[task_id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}

async function check_tag(tag,pool){
    let sql = mysql.format( `SELECT COUNT(*) FROM tags WHERE tag = ? `,[tag] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}

//...........................................................Auxiliary functions


function build_update_sql_query(req){
    let body = req.body
    let date = new Date;
    let now_utc =  `${date.getUTCFullYear()}-${ date.getUTCMonth()}-${ date.getUTCDate()}- ${date.getUTCHours()}-${date.getUTCMinutes()}-${ date.getUTCSeconds()}`;
    let keys= [`date_of_last_edit`,`last_editor_id` ]
    let values=[now_utc,body.teacher_id ]
    if ('description' in body ){keys.push('description');values.push(body.description) }
    if ('execution_instructions' in body ){keys.push('execution_instructions');values.push(body.execution_instructions) }
    if ('task' in body ){keys.push('task') ;values.push(body.task)}

    let set = "";
    
    for (let i =0; i < keys.length;i++){
        set += `${keys[i]}=?`;
        ( i < ( keys.length-1 ) ) ? set += `,` : null; 
    }
    let sql = mysql.format(`UPDATE tasks SET ${set} WHERE '${body.id}' = id `,values);
    return sql;

}

async function add_task_taggings (task_id,tags,pool){
    try {
        //check if task exists
        if (! await check_id(pool,task_id)  ){   
            return{ok:false,error:"task id does not exists" }
        } 

        tags = util.remove_duplicates(tags)
        //Tags that do not yet exist  
        let new_tags=[];
        for (let i = 0; i <tags.length ; i++) {//   for of
            if ( ! await check_tag(tags[i],pool)){
                new_tags.push( [tags[i]] )
            }
        }
       
        //insert new tags
        if (new_tags.length > 0 ){
        let sql_insert_tags = mysql.format( `INSERT INTO tags  (tag) VALUES ?`, [new_tags] );
        let result = await db.mysql_insert( sql_insert_tags ,  pool); 
        }
        //get ids of tags
        let sql_get_tag_ids = mysql.format( `SELECT id FROM tags WHERE TAG IN   (?)`,[tags]  );
        let tag_ids_obj  = await db.mysql_query_get_rows(sql_get_tag_ids,pool); 
        let tag_vs_id = tag_ids_obj.map((tag_id) => {  return [task_id,tag_id.id] });
        
        //tagging tsk
        let sql_insert_task_taggings = mysql.format( `INSERT INTO task_taggings  (task_id,tag_id) VALUES ?`,[tag_vs_id]  );// check 
        await db.mysql_insert( sql_insert_task_taggings ,  pool); 
        
        return{ok:true};

    } catch (error) {
        // return{ok:false,'error':error};
        throw error;
    }
}

async function delete_task_taggings (task_id,pool){
    
    try {
        let  sql =mysql.format( `DELETE FROM task_taggings WHERE ? = task_id `,task_id);
        await db.mysql_query( sql,pool); 
        return{ok:true};

    } catch (error) {
        console.log(error)
        throw error;
    }
}
