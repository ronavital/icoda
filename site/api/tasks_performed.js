const mysql = require('mysql')
const db = require('./db')
const { clear_tasks } = require('./sets')
const util = require('./util')
const StatusCodes=require('http-status-codes').StatusCodes



async function add_task_performed (req, res, pool){
    let validation = validate_add_task_performed(req)
    if( ! validation.ok ){
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return;
    }
    let body = req.body; 
    try {
        if (! await util.check_id(pool,body.task_id,'tasks') ){ util.send_response(res, StatusCodes.NOT_FOUND,'task_id does not exists');return}
        if (! await util.check_id(pool,body.teacher_id,'teachers') ){ util.send_response(res, StatusCodes.NOT_FOUND,'teacher_id does not exists');return}
        if (! await util.check_id(pool,body.set_id,'sets') ){ util.send_response(res, StatusCodes.NOT_FOUND,'set_id does not exists');return}
        if (! await util.check_id(pool,body.student_id,'students') ){ util.send_response(res, StatusCodes.NOT_FOUND,'student_id does not exists');return}

        let date =new Date()
        var now_utc =  `${date.getUTCFullYear()}-${ date.getUTCMonth()}-${ date.getUTCDate()}- ${date.getUTCHours()}-${date.getUTCMinutes()}-${ date.getUTCSeconds()}`;
        let values = [body.student_id,body.set_id,body.task_id,body.teacher_id,now_utc,body.execution_time,body.score ,body.note];
        let sql = mysql.format( `INSERT INTO tasks_performed ( student_id,set_id, task_id,teacher_id,date_time,execution_time,score ,note) VALUES ( ? )`,[values] );
        let result = await db.mysql_insert(sql,pool); 
        res.json({  'msg':'The task performed has been added' });
        return;
    }catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}


async function get_tasks_performed_list(req,res,pool){
   
    try{
        let sql_details =  `SELECT  * FROM tasks_performed `
        let sets = await db.mysql_query_get_rows( sql_details, pool ); 
        res.json( {sets:sets});
    } catch (error) {
        console.log(error)
        util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return;
    }
}

async function search_tasks_performed(req,res,pool){
    
    let validation =validate_search_task_performed(req)
    if (! validation.ok  ){  
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    }     
    {   

        try{             
            let sql =  build_sql_query_search(req.query)
            let result = await db.mysql_query_get_rows( sql, pool ); 

            res.json( {tasks_performed:result});
        } catch (error) {
            console.log(error)
            util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            return
        }
    }
}

async function clear(req,res,pool){
    
    let validation =validate_search_task_performed(req)
    if (! validation.ok  ){  
        util.send_response(res,StatusCodes.BAD_REQUEST,validation.error)
        return
    }     
    {   

        try{             
            let sql =  build_sql_query_clear(req.query)
            await db.mysql_query( sql, pool ); 

            res.json( {msg:"cleared"}  );
        } catch (error) {
            console.log(error)
            util.send_response(res,StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            return
        }
    }
}


module.exports.add_task_performed=add_task_performed
module.exports.search_tasks_performed=search_tasks_performed
module.exports.get_tasks_performed_list=get_tasks_performed_list
module.exports.clear=clear
// student_id INT(11) DEFAULT NULL,
// set_id INT(11) DEFAULT NULL,
// task_id INT(11) DEFAULT NULL,
// teacher_id VARCHAR(255) DEFAULT NULL,
// date_time DATETIME DEFAULT NULL,
// execution_time INT(11) DEFAULT NULL,
// score INT(11) DEFAULT NULL

/////////////////////////     validations
function validate_add_task_performed(req){
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,error:"content-type Should be \"application/json\" "} }
    if (! ("body" in req) ){   return {ok:false,error:"body does not exist"}}
    let body=req.body;
    if ( ! ("student_id" in body) ){ return {ok:false,error:"Property student_id does not exist"}}
    if ( ! ("set_id" in body) ){ return {ok:false,error:"Property set_id does not exist"}}
    if ( ! ("task_id" in body) ){ return {ok:false,error:"Property task_id does not exist"}}
    if ( ! ("teacher_id" in body) ){ return {ok:false,error:"Property teacher_id does not exist"}}
    if ( ! ("execution_time" in body) ){ return {ok:false,error:"Property execution_time does not exist"}}
    if ( ! ("score" in body) ){ return {ok:false,error:"Property score does not exist"}}

    if ( ! util.validate_id(body.student_id) ){ return {ok:false,error:"invalid _dtudent_id"}}
    if ( ! util.validate_id(body.set_id) ){ return {ok:false,error:"invalid set_id"}}
    if ( ! util.validate_id(body.task_id) ){ return {ok:false,error:"task_id"}}
    if ( ! util.validate_id(body.teacher_id) ){ return {ok:false,error:"invalid teacher_id"}}
    if ( ! util.validate_id(body.execution_time) ){ return {ok:false,error:"invalid execution_time"}}
    if ( ! util.validate_id(body.student_id) ){ return {ok:false,error:"invalid _dtudent_id"}}
    let a = util.validate_string.ok
    if ( ( "note" in body ) && ! util.validate_string(body.note).ok ){ return {ok:false,error:"invalid note "}}
    
    
    return{"ok":true}
    
}

function validate_search_task_performed(req){
    let obj=req.query;

    if ( ( "student_id" in obj  ) && ! util.validate_id(obj.student_id) ){ return {ok:false,error:"invalid student_id "}}
    if ( ( "set_id" in obj ) && ! util.validate_id(obj.set_id) ){ return {ok:false,error:"invalid set_id "}}
    if ( ( "task_id" in obj ) && ! util.validate_id(obj.task_id) ){ return {ok:false,error:"invalid task_id "}}
    if ( ( "teacher_id" in obj ) && ! util.validate_id(obj.teacher_id) ){ return {ok:false,error:"invalid teacher_id "}}
    
    
    return{"ok":true}
    
}



/////////////////////           checkers
 

//...........................................................Auxiliary functions


function get_keys_and_values(obj){
    let optional_details=[
        'set_id' ,
        'task_id' ,
        'teacher_id',
        'student_id'
    ]
    let keys=[ ];

    for (let detail of optional_details) {
        if (detail in obj) { keys.push(detail)} 
    }
    let values= keys.map( (detail) => {  return obj [detail]; });
    return { "keys":keys,"values":values}
}



function build_sql_query_search(obj){
    let obj_data =get_keys_and_values(obj)
    let keys= obj_data.keys
    let values = obj_data.values
    let conditions = "";
    
    for (let i =0; i < keys.length;i++){
        ( i === 0 ) ? conditions += ` WHERE ` : null; 

        conditions += `${keys[i]}=(?)`;
        ( i < ( keys.length-1 ) ) ? conditions += `AND ` : null; 
    }

    let sql =  `SELECT student_id ,set_id ,task_id ,teacher_id ,date_time ,execution_time ,score 
    FROM tasks_performed  ${conditions} `
    sql =mysql.format(sql,values)
    return sql;

}
function build_sql_query_clear(obj){
    let obj_data =get_keys_and_values(obj)
    let keys= obj_data.keys
    let values = obj_data.values
    let conditions = "";
    
    for (let i =0; i < keys.length;i++){
        ( i === 0 ) ? conditions += ` WHERE ` : null; 

        conditions += `${keys[i]}=(?)`;
        ( i < ( keys.length-1 ) ) ? conditions += `AND ` : null; 
    }

    let sql =  `DELETE  FROM tasks_performed  ${conditions} `
    sql =mysql.format(sql,values)
    return sql;

}

