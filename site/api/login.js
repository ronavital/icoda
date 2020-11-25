/*

const util = require('./util')
const StatusCodes=require('http-status-codes').StatusCodes



function logout(req,res){
    req.session.destroy()
    // res.clearCookie("user_sid")
    res.json({'is_logged_in':false})
}

// Returns response  object with property is_logged_in and with user data
function is_logged_in (req,res){
    if (req.session.is_logged_in){
        let user_data = req.session.user_data
        let response_obj={
            is_logged_in:true,
            id:user_data.id,
            first_name:user_data.first_name,
            user_type:user_data.user_type
        }
        if ('admin' in user_data) { response_obj.admin=user_data.admin} ;

        
        res.json(response_obj)

       
    }else {
        res.json({'is_logged_in':false})
    }
}

function get_access (req,res,next){
    if (! req.session.is_logged_in){
        util.send_response(res,StatusCodes.UNAUTHORIZED,'UNAUTHORIZED')
        return; 
    }
    let url = req.url.split("/")
    if ( req.session.user_data.user_type==='student'){  
        if (  (url[1] ==='tasks'||url[1] ==='task'||url[1] ==='student'||url[1] ==='set'||url[1] ==='sets' ||url[1] ==='sets'||url[1] === 'tasks_performed') && req.method ==="GET" ){
        next();
        return;
        }
    }else if (req.session.user_data.user_type === 'teacher') {
        if ( req.method ==="GET" || url[1] ==='set' || url[1] === 'tasks_performed'    ){
        next();
        return;
        }
    }if ( req.session.user_data.user_type==='teacher' && req.session.user_data.admin ){
        next();
        return;
    }else {
        util.send_response(res,StatusCodes.UNAUTHORIZED,'no access')
        return; 
    }

    
}

 

// module.exports.login=login
module.exports.logout=logout
module.exports.is_logged_in = is_logged_in
module.exports.get_access = get_access

*/
