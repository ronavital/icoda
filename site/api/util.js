const mysql = require('mysql')
const db = require('./db')
var dateFormat = require('dateformat');



function is_test(){
    const is_test_regex =/test/
    return is_test_regex.test(__dirname)
  
}

function send_response(res,statusCode,body){
    res.statusCode= statusCode
    res.send(body)
}

function format_date_time(date_str){
    let date  = new Date(date_str);
    date_format = dateFormat(date, "HH:MM dd.mm.yyyy ");    
    return date_format
}
function format_date(date_str){
    let date  = new Date(date_str);
    date_format = dateFormat(date, "dd.mm.yyyy ");    
    return date_format
}



async function check_id(pool,id,table){
    try{
        let sql = mysql.format( `SELECT COUNT(*) FROM ${table} WHERE id = ?`,[id] )  ;
        let result = await db.db_get_count( sql , pool );
        result = ( result == 0 ) ?  false :  true
        return result
    }catch (error) {  throw (error)   }


}

/**
 * 
 * @param {*} pool 
 * @param {array} ids 
 * @param {string} table 
 * 
 */
async function check_ids(pool,ids,table){
    let sql = mysql.format( `SELECT COUNT(*) FROM  ${table}  WHERE id IN (?)`,[ids] )  ;
    let result;
    try{
        result = await db.db_get_count( sql , pool );
    }catch (error) {  throw (error)   }

    if ( result === ids.length ){
        return true ;
    }else{ return false; }
}


/**
 * 
 * @param {array} ids 
 */
function validate_id_array(ids){
    if( ! Array.isArray(ids)) {return {"ok":false,error:'ids is not an array'}}
    ids.map((id)=>{
        if ( ! Number.isInteger(Number(id) )){     return{"ok":false}    }
    })
    return{"ok":true}
}

/**
 * 
 * @param {array} tags 
 */
function validate_string_array (array){
    
    if( ! Array.isArray(array)) {return {"ok":false}}
    array.map((value)=>{
        if ( ! typeof(value) !== 'string' ){ return{"ok":false}  }
    })
    return{"ok":true}

}

/**
 * 
 * @param {number} id 
 */
function validate_id (id){
    const id_regex = /^[1-9]\d*$/
    return  id_regex.test(String(id))
    
}
function validate_integer_positive_number (num){
   
    if ( Number.isInteger(Number(num) )){  return true  }
        else {return false}
    
}
function validate_string(str){
    return {"ok":true }
}
/**
 * 
 * @param {[]} array 
 */
function remove_duplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
  };






module.exports.send_response  = send_response;
module.exports.validate_id=validate_id
module.exports.check_ids=check_ids
module.exports.validate_id_array=validate_id_array
module.exports.validate_string_array=validate_string_array
module.exports.format_date=format_date
module.exports.format_date_time=format_date_time
module.exports.validate_string=validate_string
module.exports.validate_integer_positive_number=validate_integer_positive_number
module.exports.check_id=check_id
module.exports.remove_duplicates=remove_duplicates
module.exports.is_test=is_test