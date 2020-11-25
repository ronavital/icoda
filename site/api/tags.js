const mysql = require('mysql')
const db = require('./db')
const util = require('./util')

async function add_tag (req, res, pool){
    let validation = validate_add_tag(req)
    if( ! validation.ok ){
        res.statusCode=  400
        res.json( validation.error )
        return;
    }
    let tag = req.body.tag 
    let description = req.body.description 
    
    try {

        if (await check_tag(tag,pool)){
            res.statusCode=  409
            res.json("tag exists")
            return;
        }  
        let sql = mysql.format( `INSERT INTO tags ( tag, description) VALUES ( ? ,?)`,[ tag , description ] );
        let result = await db.mysql_insert( sql ,  pool); 
        res.json({ 'id':result , 'msg':'The tag has been added' });
        return;

    } catch (error) {
        console.log(error)
        res.statusCode=500
        res.json("sql error")
        return
    }
    
}

async function add_task_tagging (req, res, pool){
    // let validation =validate_add_task_taging (req)
    // if( ! validation.ok ){
    //     res.statusCode=  400
    //     res.json(validation.error)
    //     return;
    // }
    // let tag_id = req.body.tag_id 
    // let task_id = req.body.task_id 

    let tags = req.body.tags 
    let task_id = req.body.task_id 
    
    try {

        await _add_task_tagging(task_id,tags,pool) 
        res.json({ 'msg':'Tagging added ' });
        return;

    } catch (error) {
        console.log(error)
        res.statusCode=500
        res.json(" error")
        return
    }
}

async function add_set_tagging (req, res, pool){
    // let validation = validate_add_set_taging (req)
    // if( ! validation.ok  ){
    //     res.statusCode=  400
    //     res.json(validation.error)
    //     return;
    // }
    let tags = req.body.tags 
    let task_id = req.body.task_id 
    
    try {
        // if (!( await check_tag_id(tag_id,pool)  && await check_set_id(set_id,pool)  )){
        //     res.statusCode=  404
        //     res.json("tag id or task id does not exists")
        //     return;
        // }  
        // let sql = mysql.format( `INSERT INTO set_tagging (tag_id , task_id) VALUES ( ? )`,[ tag_id , set_id] );
        // let result = await db.mysql_insert( sql ,  pool); 
        // res.json({ 'msg':'Tagging added ' });
        // return;

    } catch (error) {
        console.log(error)
        res.statusCode=500
        res.json(" error")
        return
    }
}

async function get_popular_tags(req,res,pool){
    try {
        let sql = `SELECT  tag FROM tags 
        ORDER BY ( (SELECT COUNT(*) FROM task_taggings WHERE tag_id = tags.id)+(SELECT COUNT(*) FROM set_taggings WHERE tag_id = tags.id)  )  DESC LIMIT 20         `
        let tag_objects=await db.mysql_query_get_rows(sql,pool)
        let tag_arr=tag_objects.map( (tag)=>{return tag.tag} )
        res.json({ popular_tags:tag_arr })


    } catch (error) {
        console.log(error)
       
        return
    }

}

module.exports.add_tag = add_tag;
module.exports.add_set_tagging = add_set_tagging;
module.exports.add_task_tagging = add_task_tagging ;
module.exports.check_tag=check_tag
module.exports.get_popular_tags=get_popular_tags
/////////////////////////     validations
function validate_add_tag(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return [false,"content-type Should be \"application/json\" "]  }
    if (! ("body" in req) ){   return [false,"body does not exist"]}
    let body=req.body;
    if ( ! ("tag" in req.body) ){
        return [false,"Property id  does not exist"]}
    if ( ! ("description" in req.body) ){ return [ false,"Property description  does not exist" ]   }
    const regex_tag=/#[A-Za-z0-9_]*/g
    if ( ! regex_tag.test( req.body.tag ) ){    return{'ok':false,'error':'invalid tag'}     }
    return{'ok':true}
}

function validate_add_set_taging(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ 
        return  {"ok":false,'error':"content-type Should be \"application/json\"" }     
    } 
    if (! ("body" in req) ){   return  {"ok":false,'error':"body does not exist" }  }
    let body=req.body;
    if ( ! ("tag_id" in req.body) ){
        return {"ok":false,'error':"Property tag_id  does not exist" }
    }
    if ( ! ("set_id" in req.body) ){ 
        return  {"ok":false,'error':"Property set_id  does not exist" }   
    }
    if ( !( Number.isInteger(Number(req.body.tag_id)) && Number.isInteger(Number(req.body.set_id)) ) ){ 
           return{'ok':false,'error':'invalid set_id or task_id'} 
    }
    return{'ok':true}
}
function validate_add_task_taging(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ 
        return  {"ok":false,'error':"content-type Should be \"application/json\"" }     
    } 
    if (! ("body" in req) ){   return  {"ok":false,'error':"body does not exist" }  }
    let body=req.body;
    if ( ! ("tag_id" in req.body) ){
        return {"ok":false,'error':"Property tag_id  does not exist" }
    }
    if ( ! ("task_id" in req.body) ){ 
        return  {"ok":false,'error':"Property task_id  does not exist" }   
    }
    if ( !( Number.isInteger(Number(req.body.tag_id)) && Number.isInteger(Number(req.body.task_id)) ) ){ 
           return{'ok':false,'error':'invalid tag_id or task_id'} 
    }
    return{'ok':true}
}

/////////////////////           checkers
 
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

async function check_tag_id(tag_id,pool){
    let sql = mysql.format( `SELECT COUNT(*) FROM tags WHERE id = ?`,[tag_id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}
async function check_task_id(task_id,pool){
    let sql = mysql.format( `SELECT COUNT(*) FROM tasks WHERE id = ?`,[task_id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}

async function check_set_id(set_id,pool){
    let sql = mysql.format( `SELECT COUNT(*) FROM sets WHERE id = ?`,[set_id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}

async function check_tagging(set_id,pool){
    let sql = mysql.format( `SELECT COUNT(*) FROM sets WHERE id = ?`,[set_id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result == 0 ){
        return false ;
    }else{ return true; }
}



//...........................................................Auxiliary functions



async function _add_task_tagging (task_id,tags,pool){
    
    
    try {
        //check if task exists
        if (! await check_task_id(task_id,pool)  ){   
            return{ok:false,error:"task id does not exists" }
        } 
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



