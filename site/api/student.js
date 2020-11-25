
const mysql = require('mysql')
const StatusCodes=require('http-status-codes').StatusCodes

const db = require('./db')
const util = require('./util')


const keys =[
    "id",
    "first_name",
    "last_name",
    "date_birth",
    "phone_number_id",
    'mother_name',
    'mother_email',
    'mother_phone',
    'father_name',
    'father_email',
    'father_phone',
    'class',
    'school',
    'diagnosis',
    'remedial_teaching',
    'communications_clinician',
    'dedicated_kindergarten'
]




//////////////////////////////main functions
async function get_student(req,res,pool){
    
    let id = req.params.id ;
    let validation = is_validate_id(req.params)
    if (! validation.ok  ){  
        //"Invalid email or ID number"
        util.send_response(res, StatusCodes.BAD_REQUEST ,validation.error)
        return
    } 
        
    {   //check if student exsists
        let result;
        try{
            result = await check_id(pool,id)
        }catch (error) {
            console.log(error)
            util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR ,'sql error')
            return;
        }
        if ( ! result  ){
            util.send_response(res, StatusCodes.NOT_FOUND,'studend does not exist')
            return;
        }
    }
    {    
        //get data
        let sql  = mysql.format( `SELECT ${keys} FROM students WHERE ? = id  ;`, [id]);

        try{
            result = await db.mysql_query( sql , pool );   
        } catch (error) {
            console.log(error)
            util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            return
        }
        result.rows[0].date_birth= util.format_date(result.rows[0].date_birth)
        res.json(result.rows[0])
    }
}


async function delete_student (req,res,pool){
    
    let id= req.params.id ;
    let validation =is_validate_id (req.params)
    if (! validation.ok  ){  //"Invalid email or ID number"
        util.send_response(res, StatusCodes.BAD_REQUEST,validation.error)
        return
    } 
    let  sql = `DELETE FROM students WHERE '${id}'= id `;
    try{
        await db.mysql_query(sql,  pool );
        res.json({msg:"student will not exist"})

    } catch (error) {
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return 
    }
}

 
async function get_list(req,res,pool) {    //get data
    
    let sql = `SELECT ${keys} FROM students ;`;
    try{
        let result = await db.mysql_query( sql , pool );   
        res.json((  {"students":result.rows}))

    }catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    } 
}

 
async function add_student(req,res,pool){
    // validation
    let validation = is_validate_add_request(req);
    if ( ! validation.ok ){
        util.send_response(res, StatusCodes.BAD_REQUEST,validation.error)
        return
    }
    try { 
        if(  await check_phone_number_id( pool,req.body.phone_number_id ) ){
            util.send_response(res, StatusCodes.CONFLICT,'phone_number_id exists')
            return;
        }
        //insert
        
        let sql = build_add_sql_query(req.body);
        let result = await db.mysql_insert(sql,  pool); 
        if (result >= 0 ){
            res.json({"id":result,'msg':'student added'  })
            }else{
                util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql studen does not added')

            } 
            return


    } catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
    
    
}

 
async function update_student(req,res,pool){
    
    let validation = is_validate_update_request(req);
    if ( ! validation.ok ){
        util.send_response(res, StatusCodes.BAD_REQUEST,validation.error)
        return
    }
  
    try {
        if ( !  await check_id(pool,req.body.id) ){
            util.send_response(res, StatusCodes.NOT_FOUND,'id does not exist')
            return;
        }
        let sql = build_update_sql_query(req.body);

        let result = await db.mysql_update(sql,  pool); 
        if (result > 0 ){
            res.json({'msg':' student  updated' }  )
            }else{
                util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            } 
            return

    } catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}



// Returns response  object with property is_logged_in and with user data

async function login(req,res,pool){
        
    let phone_number = req.body.phone ;
    let validation = is_validate_phone(req.body.phone)
    if (! validation.ok  ){  
        util.send_response(res, StatusCodes.BAD_REQUEST,validation.error)
        return
    } 

    try{
        if ( ! await check_phone_number_id(pool,phone_number) ){
            util.send_response(res, StatusCodes.NOT_FOUND,'phone_number_id does not exists')
            return;
        }
        let sql  = mysql.format( `SELECT id,first_name FROM students WHERE ? =  phone_number_id  ;`, [phone_number]);    
        let student = await db.mysql_query_get_rows( sql , pool ); 
       
        student = student[0]
    // return object with property is_logged_in and with user data
        let response_obj={
            is_logged_in:true,
            id:student.id,
            first_name:student.first_name,
            user_type:'student'
        }
        res.json(response_obj)


    } catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
  
    
}


async function get_student_by_phone(req,res,pool){
        
    let phone_number = req.params.phone ;
    let validation = is_validate_phone(req.params.phone)
    if (! validation.ok  ){  
        util.send_response(res, StatusCodes.BAD_REQUEST,validation.error)
        return
    } 
        
    try{
        if ( ! await check_phone_number_id(pool,phone_number) ){
            util.send_response(res, StatusCodes.NOT_FOUND,'phone_number not exist');
            return;
        }        
        //get data
        let sql  = mysql.format( `SELECT ${keys} FROM students WHERE ? =  phone_number_id  ;`, [phone_number]);
        result = await db.mysql_query( sql , pool );   
    } catch (error) {
        console.log(error)
        util.send_response(res, StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
    res.json(result.rows[0])
    
}

 /////////////////////////////////////////////////////////////////////////         validations  

function is_validate_id (params){
    
    if ( Number.isInteger(Number(params.id) )){  return {ok:true}  }
    else {return{ok:true,error:"Invalid  ID number"}}
}    


function is_validate_phone (phone_number){
    let phone_number_regex =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (  phone_number_regex.test(phone_number )){  return {ok:true}  
    } else return {ok:false,'error':"Invalid  phone number"}
}

function is_validate_add_request (req){ 
   
    if (! req.headers["content-type"].includes( 'application/json') ){  return{ok:false,error:"content-type Should be \"application/json\" "}  }
    
   
    if (! ("body" in req) ){   return  {ok:false,'error':"body does not exist"}}
    let body=req.body;
    if ( ! ("first_name" in body) ){
        return {ok:false,'error':"Property first_name does not exist"}
    }else if ( ! ("last_name" in body )){
        return {ok:false,'error':"Property last_name does not exist"}
    }else if ( ! ("date_birth" in body )){
        return {ok:false,'error':"Property password does not exists"}
    }else if ( ! ("phone_number_id" in body )){
        return {ok:false,'error':"Property phone_number_id does not exist"}
    }
    
    let email_regex = /\S+@\S+\.\S+/;
    let phone_number_regex =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let date_regEx = /^\d{4}-\d{2}-\d{2}$/;

    
    if (! (date_regEx.test(body.date_birth))    ){ 
        return {ok:false,'error':"invalid date_birth"}
    }else if ( "mother_email"in body  &&  ! (email_regex.test(body.mother_email))    ){ 
        return {ok:false,'error':"invalid mother_email"}
    }else if ( "father_email"in body  &&  ! (email_regex.test(body.father_email))    ){ 
        return {ok:false,'error':"invalid father_email"}
    }else if ( "mother_phone" in body  &&  ! (phone_number_regex.test(body.mother_phone))    ){ 
        return {ok:false,'error':"invalid mother_phone"}
    }else if ( "father_phone"in body  &&  ! (phone_number_regex.test(body.father_phone))    ){ 
        return {ok:false,'error':"invalid father_phone"}        
    }else if ( "phone_number_id" in body  &&  ! (phone_number_regex.test(body.phone_number_id))    ){ 
        return {ok:false,'error':"invalid phone_number_id"}        
    }

    
    return {ok:true}

}


function is_validate_update_request (req){ 
   
    if (! req.headers["content-type"].includes( 'application/json') ){  return{ok:false,error:"content-type Should be \"application/json\" "} }
    
   
    if (! ("body" in req) ){   return [false,"body does not exists"]}
    let body=req.body;
    if ( ! ("id" in body) ){
        return {ok:false,'error':"Property id does not exist"}

    }
    
    let email_regex = /\S+@\S+\.\S+/;
    let phone_number_regex =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let date_regex = /^\d{4}-\d{2}-\d{2}$/;
    
    if ( "mother_email"in body  &&  ! (email_regex.test(body.mother_email))    ){ 
        return {ok:false,'error':"invalid mother_email"}
    }else if ( "father_email"in body  &&  ! (email_regex.test(body.father_email))    ){ 
        return {ok:false,'error':"invalid father_email"}
    }else if ( "mother_phone" in body  &&  ! (phone_number_regex.test(body.mother_phone))    ){ 
        return {ok:false,'error':"invalid mother_phone"}
    }else if ( "father_phone"in body  &&  ! (phone_number_regex.test(body.father_phone))    ){ 
        return {ok:false,'error':"invalid father_phone"}
    }else if ( "phone_number_id"in body  &&  ! (phone_number_regex.test(body.phone_number_id))    ){ 
        return {ok:false,'error':'invalid phone_number_id'}
    }    
    return {ok:true}
}
//////////////////////        chekers
async function check_id( pool , id){   
    let sql = mysql.format(`SELECT COUNT(*) FROM students WHERE ? = id `,[id]);
    try{

        let result = await db.db_get_count( sql , pool );
        if ( result == 1 ){ return true;
        }else {return false;}
    
    }catch (error) {
        console.log(error)
        throw(error)
    }
    
}
async function check_phone_number_id( pool , phone_number_id){   
    let sql =mysql.format( `SELECT COUNT(*) FROM students WHERE ? = phone_number_id `,[phone_number_id] );
    try{

        let result = await db.db_get_count( sql , pool );
        if ( result == 1 ){ return true;
        }else {return false;}
    
    }catch (error) {
        console.log(error)
        throw(error)
    }
    
}
//////////////////////////////////////////////////////////// Auxiliary functions
function build_add_sql_query(body){
    let obj_data =get_keys_and_values_add(body)
    let keys= obj_data.keys
    let values = obj_data.values
    let sql = mysql.format(`INSERT INTO  students ( ${keys} ) VALUES (?) `, [values]);
    return sql;

}


function build_update_sql_query(body){
    let obj_data =get_keys_and_values_update_(body)
    let keys= obj_data.keys
    let values = obj_data.values
    let set = "";
    
    for (let i =0; i < keys.length;i++){
        set += `${keys[i]}='${values[i]}'`;
        ( i < ( keys.length-1 ) ) ? set += `,` : null; 
    }

    let sql = `UPDATE students SET ${set} WHERE '${body.id}' = id `;
  
    return sql;

}



function get_keys_and_values_add(body){
    let optional_details=[
        'mother_name',
        'mother_email',
        'mother_phone',
        'father_name',
        'father_email',
        'father_phone',
        
        'class',
        'school',
        'diagnosis',
        'remedial_teaching',
        'communications_clinician',
        'dedicated_kindergarten'
    ]
    let keys=[ "first_name", "last_name","date_birth","phone_number_id"];
    // let names = ["first_name", "last_name", 'mother_name', 'father_name' ]
    
    for (let detail  of optional_details) {
        if (detail in body) { keys.push(detail)} 
    }
   
    let values= keys.map( (detail) => {  return body [detail]; });
    return { "keys":keys,"values":values}
}


function get_keys_and_values_update_(body){
    let optional_details=[
        "first_name",
        "last_name",
        "phone_number_id",
        'mother_name',
        'mother_email',
        'mother_phone',
        'father_name',
        'father_email',
        'father_phone',
        'class',
        'school',
        'diagnosis',
        'remedial_teaching',
        'communications_clinician',
        'dedicated_kindergarten'
    ]
    let keys=[ ];

    for (let detail of optional_details) {
        if (detail in body) { keys.push(detail)} 
    }
   
    let values= keys.map( (detail) => {  return body [detail]; });
    return { "keys":keys,"values":values}
}


module.exports.get_student    = get_student;
module.exports.delete_student = delete_student;
module.exports.get_list       = get_list;
module.exports.add_student    = add_student;
module.exports.update_student = update_student; 
module.exports.get_student_by_phone = get_student_by_phone
module.exports.login = login
