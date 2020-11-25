const mysql = require('mysql')
const db = require('./db')
const md5 = require('md5')
const random = require('random')
const StatusCodes=require('http-status-codes').StatusCodes

const util = require('./util')






// main functions 
async function get_teacher(req,res,pool){
    
    let unique_id = req.params.id ;
    let validation =is_validate_unique_id (req.params)
    if (! validation.ok  ){  
        util.send_response(res,  StatusCodes.BAD_REQUEST,validation.error)
        return    
    } 
    let type_unique_id =validation.type//לשנות מID לkey     
    {    
        //Check  if id exist
        let sql;
        let result;
        if(type_unique_id==='email'){ sql = `SELECT COUNT(*) FROM teachers WHERE '${unique_id}'= email AND deleted =0 `;}
        else if (type_unique_id==='id'){ sql = `SELECT COUNT(*) FROM teachers WHERE '${unique_id}'= id AND deleted =0`;}

        try {    
            result = await db.db_get_count( sql , pool );
        } catch (error) {
            console.log(error)
            util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
                return
        }
        if (result < 1){
            util.send_response(res,  StatusCodes.NOT_FOUND,'key does not exist')
            return
        }
    }
    {    //get data
        let sql;
        if(type_unique_id==='email'){sql = `SELECT id,email,phone_number,first_name ,last_name FROM teachers WHERE '${unique_id}' = email AND deleted =0;`;}
        else if (type_unique_id==='id'){sql = `SELECT id,email,phone_number,first_name ,last_name FROM teachers WHERE '${unique_id}' = id AND deleted =0 ;`;}

        
        try{
            result = await db.mysql_query( sql , pool );   
        } catch (error) {
            console.log(error)
            
            
            util.send_response(res,   StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
                return
        }
        res.json(result.rows[0])
    }
}


async function delete_teacher (req,res,pool){
    
    let unique_id= req.params.id ;
    let validation = is_validate_unique_id (req.params)
    if (! validation.ok  ){  //"Invalid email or ID number"
        
    util.send_response(res,  StatusCodes.BAD_REQUEST ,validation.error)

        return
    } 
    let sql;
    let type_unique_id =validation.type

     

    if(type_unique_id ==='email'){ sql = `UPDATE teachers SET deleted = 1 WHERE  '${unique_id}'=email `;}
    else if (type_unique_id==='id'){ sql = `UPDATE teachers SET deleted = 1 WHERE  '${unique_id}'=id `;}

    try{
        await db.mysql_query(sql,  pool );
    } catch (error) {
        console.log(error)
        util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR ,'sql error')
        return 
    }
    
    res.json({msg:"teacher will not exist"})
}


async function get_list(req,res,pool) {    //get data
    let sql = `SELECT id,email,phone_number,first_name ,last_name FROM teachers WHERE  deleted = 0 ;`;
    try{
        let result = await db.mysql_query( sql , pool );  
        res.json(( {"teachers":result.rows}));
    }catch (error) {
        console.log(error)
        util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
       return
    }    
 }


 
async function add_teacher(req,res,pool){
    if (!("body" in req) ){ 
        util.send_response(res,  StatusCodes.BAD_REQUEST,'body does not exists')
        return
    }
    // let req_validation = post_req_validation(req);
    // console.log(req_validation);
    let email = req.body.email;
    let admin = req.body.admin ? 1 : 0
    let password = req.body.password;
    let salt = random.int(1000, 9999)
    let password_hash = md5(`${password}${salt}`)
    let validation =is_validate_add_request(req)// body
   
    if (! validation.ok){
        util.send_response(res,  StatusCodes.BAD_REQUEST ,validation.error)

        return
    } 
    {          
    //Check  if email exist
       
        try{
            let sql = `SELECT COUNT(*) FROM teachers WHERE "${email}" = email `;
            let result = await db.db_get_count( sql , pool );
            if ( result > 0 ){
                let techer_data = (await db.mysql_query_get_rows (`SELECT deleted,id FROM teachers WHERE "${email}" = email `  , pool ))[0]
                if (techer_data.deleted==1 ){
                let values = [req.body.phone_number,req.body.first_name, req.body.last_name,password_hash,salt,email]
                let sql =mysql.format( `update teachers SET deleted =0, phone_number =?,first_name =?,last_name =?,password_hash=?,salt=?  WHERE ?=email ` ,values );
                await db.mysql_update(sql,pool)
                sql=mysql.format(`SELECT id FROM teachers WHERE ? = email `,[email])
                result =await db.mysql_query_get_rows(sql,pool)
                res.json({'id':result[0].id,"msg":"teacher added"})
                }else {
                    util.send_response(res,  StatusCodes.CONFLICT,'email exists')
                } 
                return
            }

          
            
         
        let values = [req.body.email,req.body.phone_number,req.body.first_name, req.body.last_name,admin,password_hash,salt]
         sql =mysql.format( `INSERT INTO teachers (email,phone_number,first_name,last_name,admin,password_hash,salt) VALUES (?)`,[values] );
        result = await db.mysql_insert(sql,  pool); 
        } catch (error) {
            console.log(error)
            util.send_response(res,   StatusCodes.INTERNAL_SERVER_ERROR,'sql error')

                return
        }
        if (result >= 0 ){
        res.json({'id':result,"msg":"teacher added"})
        }else{
            util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
            
        } 
        return
    }
}



async function update_teacher(req,res,pool){
    // validation

    let validation = is_validate_update_request(req);
    if ( ! validation.ok ){
        util.send_response(res,  StatusCodes.BAD_REQUEST,validation.error)

        return
    }

    {          
    //Check  if id  exist
        let sql = `SELECT COUNT(*) FROM teachers WHERE ${req.body.id} = id  AND deleted =0`;
        let result;
        try{
            result = await db.db_get_count( sql , pool );

        }catch (error) {
            console.log(error)
            util.send_response(res,  StatusCodes.BAD_REQUEST,'sql error')

            return;
        }
        if ( result == 0 ){
            util.send_response(res,  StatusCodes.NOT_FOUND ,'id does not exist')
            return;
        }
    }


    //update
    {
        let result; 
        let sql = build_update_sql_query(req.body);
       
        try {    
            result = await db.mysql_update(sql,  pool); 
        } catch (error) {
            console.log(error)
            util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR ,'sql error')

                return
        }
        if (result >= 0 ){
        res.json( {'msg':'teacher updated'} )
        }else{
            util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR ,'sql error')
        } 
        return
    }
}


///////..........................................................login


// Returns response  object with property is_logged_in and with user data

async function login(req,res,pool){
    let validation = is_validate_login_request(req)
    if( ! validation.ok ){
        util.send_response(res,  StatusCodes.BAD_REQUEST,validation.error)

        return;
    }  
    let email = req.body.email
    let tested_password = req.body.password 
    try {
        if (await check_email(email,pool) && await check_password(tested_password,email,pool)  ){
            let teacher  = await db.mysql_query_get_rows(mysql.format( `SELECT id, first_name,admin  FROM teachers WHERE email = ? AND deleted =0`,[email] ) , pool );
            teacher=teacher[0]
            teacher.admin = ( teacher.admin === 1 ) ? true : false
            let response_obj={
                is_logged_in:true,
                id:teacher.id,
                first_name:teacher.first_name,
                admin:teacher.admin,
                user_type:'teacher'
            }
            res.json(response_obj)
        }else{
            util.send_response(res,  StatusCodes.UNAUTHORIZED,'The user is not logged in')
            return
        }    
    } catch (error) {
        console.log(error)
        util.send_response(res,   StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
        return
    }
}



 


 /////////////////////////////////////////////////////////////////////////         validations  
// Returns an object which ean value and in the 1 the error message

function is_validate_unique_id (params){
    
    let email_regex = /\S+@\S+\.\S+/;
   
    let unique_id = params.id;

    if (  email_regex.test( unique_id ) ) {  return {ok:true,type:""}}
    else  if ( Number.isInteger(Number(unique_id) )){  return {ok:true,type:"id"} }
    else {return { ok:false ,"error":'Invalid email or ID number'}}
}
 


function is_validate_add_request (req){ 
  
    if (! req.headers["content-type"].includes( 'application/json') ){ return {ok:false,'error':"content-type Should be \"application/json\" "}   }
    if (! ("body" in req) ){   return {ok:false,'error':"body does not exist"}}
    let body=req.body;
    if ( ! ("phone_number" in body) ){
        return {ok:false,'error':"Property phone_number does not exist"}
    }else if ( ! ("email" in body) ){
        return {ok:false,'error':"Property email does not exist"}
    }else if ( ! ("first_name" in body) ){
        return {ok:false,'error':"Property first_name does not exist"}
    }else if ( ! ("last_name" in body )){        
        return {ok:false,'error':"Property last_name does not exist"}
    }else if ( ! ("password" in body )){
        return {ok:false,'error':"Property password does not exist"}
    }else if ( ! ("admin" in body )){
        return {ok:false,'error':"Property admin does not exist"}        
    }
    
    let phone_number = body.phone_number  ;
    let email = body.email;
 
    let email_regex = /\S+@\S+\.\S+/;
    let phone_number_regex =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let admin = body.admin;

    if ( !  (phone_number_regex.test( phone_number ))  ){ 
        return{ok:false,'error':"invalid phone number"}
    }else  if (! email_regex.test(email)){
        return {ok:false,'error':"invalid email"}
    }else  if ( typeof(admin)!== "boolean" ){
        return {ok:false,'error':"invalid admin"}
        
    }
    
    return {ok:true}

}



function is_validate_update_request (req){ 
   
    if (! req.headers["content-type"].includes( 'application/json') ) {
        return {ok:false,'error':"content-type Should be \"application/json\" "} 
    }
    
   
    if (! ("body" in req) ){ return { ok:false , 'error':"body does not exist" } }
    let body=req.body;
    if ( ! ("id" in req.body) ){
        return { ok:false , 'error':"id  does not exist" }
    }
    
    let email_regex = /\S+@\S+\.\S+/;
    let phone_number_regex =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    
    if ( "email"in body  &&  ! (email_regex.test(body.email))    ){ 
        return {ok:false,'error':"invalid email"}
    }else  if ( "phone" in body  &&  ! (phone_number_regex.test(body.phone))    ){ 
        return{ok:false,'error':"invalid phone number"}
    }
    return {ok:true}
    
}




function is_validate_login_request (req){ 
   
    if (! req.headers["content-type"].includes( 'application/json') ){ 
        return {ok:false,'error':"content-type Should be \"application/json\" "} 
     }
   
    if (! ("body" in req) ){ 
        return { ok:false , 'error':"body does not exist" }
     }
    let body=req.body;
    if ( ! ("email" in req.body) ){
        return {ok:false,'error':"Property email does not exist"}
    }else if ( !("password" in body) ){
        return {ok:false,'error':"Property password does not exist"}
    }
    let email_regex = /\S+@\S+\.\S+/;
    
    if ( ! (email_regex.test(body.email))    ){ 
        return {ok:false,'error':"invalid email"}
    }
    
        return {ok:true}
        

}
//////////////////////////////////////////////////////////////////////        chekers

async function check_password(password,email,pool){
        
    let sql = mysql.format( `SELECT password_hash,salt FROM teachers WHERE email = ?`,[email] )  ;
    let result;
    try{
        result = await db.mysql_query_get_rows ( sql , pool );
    }catch (error) {
        console.log(error)
        throw (error)
    }

    let right_hash =  result[0].password_hash;
    let salt = result[0].salt;
    let tested_hash=md5(`${password}${salt}`)
    
    if ( tested_hash === right_hash){
        return true;
    }else{ return false; }

}

//return true or false
async function check_email(email,pool){          
let sql = mysql.format( `SELECT COUNT(*) FROM teachers WHERE email = ? AND deleted =0`,[email] )  ;
let result;
try{
    result = await db.db_get_count( sql , pool );
}catch (error) {  throw (error)   }

if ( result == 0 ){
    return false ;
}else{return true;}

}
async function check_id(id,pool){          
    let sql = mysql.format( `SELECT COUNT(*) FROM teachers WHERE id = ? AND deleted =0`,[id] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }
    
    if ( result == 0 ){
        return false ;
    }else{return true;}
    
    }

//get id by email
async function get_id(email,pool){          
    let sql = mysql.format( `SELECT id FROM teachers WHERE email = ? AND deleted =0`,[email] )  ;
    let result;
    try{
        result = await db.mysql_query_get_rows(mysql.format( `SELECT id FROM teachers WHERE email = ?`,[email] ) , pool );
    }catch (error) {  throw (error)   }
    
    if ( result == 0 ){
        return false ;
    }else{return true;}
    
    }

//////////////////////////////////////////////////////////// Auxiliary functions


function build_update_sql_query(body){
    let obj_data =get_keys_and_values_update(body)
    let keys= obj_data.keys
    let values = obj_data.values
    let set = "";
    
    for (let i =0; i < keys.length;i++){
        set += `${keys[i]}='${values[i]}'`;
        ( i < ( keys.length-1 ) ) ? set += `,` : null; 
    }

    let sql = `UPDATE teachers SET ${set} WHERE '${body.id}' = id `;
  
    return sql;

}

//return object : in property keys array of keys and in property values array with values

function get_keys_and_values_update(body){
    let optional_details=[
        "first_name",
        "last_name",
        "phone_number"
    ]
    let keys=[ ];

    for (let detail of optional_details) {
        if (detail in body) { keys.push(detail)} 
    }
   
    let values= keys.map( (detail) => {  return body [detail]; });
    return { "keys":keys,"values":values}
}

///////.............................................................
module.exports.get_teacher = get_teacher;
module.exports.delete_teacher = delete_teacher; 
module.exports.get_list = get_list ;
module.exports.update_teacher = update_teacher;
module.exports.add_teacher = add_teacher;
module.exports.login = login;
module.exports.get_teacher_by_id=get_teacher_by_id;
module.exports.check_id=check_id


async function get_teacher_by_id(id,pool){   
    try {
        let sql = `SELECT COUNT(*) FROM teachers WHERE '${id}'= id `;
        let count = await db.db_get_count( sql , pool );
        if (count < 1){
            util.send_response(res,  StatusCodes.NOT_FOUND,'key does not exist')
            return
        }    
        sql = `SELECT id,email,phone_number,first_name ,last_name FROM teachers WHERE '${id}' = id `
        let result = await db.mysql_query( sql , pool );  
        return result.rows[0] 

    } catch (error) {
            console.log(error)
            util.send_response(res,  StatusCodes.INTERNAL_SERVER_ERROR,'sql error')
                return
        }
}