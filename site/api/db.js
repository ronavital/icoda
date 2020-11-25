const mysql = require('mysql')
//const util = require('./util')

const MV_DATE_FORMAT = '%Y-%m-%d %k:%i:%s'

let _pool = null;

function get_pool()
{
    return _pool;
}

// Should be called once 
function set_pool( pool )
{
    _pool = pool;
}

// Returns a promise. Resolve's parameter is an object with properties of rows and fields
function mysql_query( sql, pool )
{
    return new Promise( (resolve, reject) =>
    {
        pool.getConnection(function(err, connection) 
        {
            if (err) reject( err.message + ': ' + sql);
    
            connection.query(sql, function (err, rows, fields) 
            {
                connection.release();
                if (err)  
                {   
                    reject( err.message);
                    return;
                }
                resolve( {rows: rows, fields:fields})
            })
        })
    })
}

async function mysql_query_get_rows( sql, pool )
{
    let rows = null;
    await mysql_query( sql, pool).then
    (
        data => rows = data.rows
        ,
        err => { throw err }
    )

    return rows;
}

// Returns a promise. Resolve's parameter the last insert id
function mysql_insert( sql, pool )
{
    return new Promise( (resolve, reject) =>
    {
        pool.getConnection(function(err, connection) 
        {
            if (err) reject( err.message);
    
            connection.query(sql, function (err, result) 
            {
                connection.release();
                if (err)  
                {   
                    reject( err.message + ": " + sql);
                    return;
                }
                resolve( result.insertId)
            })
        })
    })

}

// Returns a promise. Resolve's parameter the count of modified rows
function mysql_update( sql, pool )
{
    return new Promise( (resolve, reject) =>
    {
        pool.getConnection(function(err, connection) 
        {
            if (err) reject( err.message);
    
            connection.query(sql, function (err, result) 
            {
                connection.release();
                if (err)  
                {   
                    reject( err.message);
                    return;
                }
                resolve( result.affectedRows)
            })
        })
    })

}

async function db_get_count( sql, pool )
{
    let ret = 0;
    let f = await mysql_query( sql, pool ).then
    (
        // OK
        (data) => 
        {
            if ( data.rows.length) 
                ret = data.rows[0][data.fields[0]["name"]];
        }
        , // Fail
        (err) => {throw err}
    );
    return ret;
}


module.exports.mysql_query = mysql_query;
module.exports.mysql_query_get_rows = mysql_query_get_rows;
module.exports.mysql_insert = mysql_insert;
module.exports.mysql_update = mysql_update;
module.exports.db_get_count = db_get_count;
module.exports.set_pool = set_pool;
module.exports.get_pool = get_pool;
module.exports.MV_DATE_FORMAT = MV_DATE_FORMAT;
