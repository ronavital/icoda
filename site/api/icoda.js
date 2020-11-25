const express = require('express')
const mysql = require('mysql')
const  randomstring = require("randomstring");

const package = require('./package.json')
const bodyParser = require('body-parser')
const version = require('./version')
const text = require('./text')
const teacher = require('./teacher')
const student = require('./student')
const tags = require('./tags')
const tasks = require('./tasks')
const login = require('./login')
const sets = require('./sets')
const tasks_performed = require('./tasks_performed')
const util =require('./util')

const app = express()

let  port = 8080
const conn_options = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'icoda',
  timezone: 'utc' 
}

if(util.is_test()){
    port =8081;
    conn_options.database='icoda_test'
}

// Mysql connection pool
let pool  = mysql.createPool( conn_options );

// https://medium.com/@magnusjt/gotcha-timezones-in-nodejs-and-mysql-b39e418c9d3
pool.on('connection', conn => {
    conn.query("SET time_zone='+00:00';", error => {
        if(error){
            throw error
        }
    })
})

const set_content_type = function (req, res, next) 
{
	if ( /^\/api\//.test( req.url))
		res.setHeader("Content-Type","application/json; charset=utf-8");
	next()
}

app.use( set_content_type );

// Error-handling middleware
app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }
    res.status(500);
    res.send('500: Internal server error. ' + err);
});



// Support for POST 
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Routing



const router = express.Router();

router.get('/version', (req, res) => { version.get_version( req, res  ); } )
router.get('/text', (req, res) => { text.get_text( req, res ); } )

//Everyone can access
router.post('/teacher/login', (req, res) =>{ teacher.login (req, res, pool) });  
router.post('/student/login',(req, res) => { student.login(req, res, pool) })


router.get('/student/Search/:phone',(req, res) => { student.get_student_by_phone(req, res, pool) })
router.get('/student/:id', (req, res) =>{      student.get_student  (req, res, pool ) } )
router.get('/students/list',(req, res) => {          student.get_list(req, res, pool) })
router.delete('/student/:id', (req, res) =>{   student.delete_student(req, res, pool) })
router.post('/student/add', (req, res) =>{     student.add_student(req, res, pool) })
router.post('/student/update', (req, res) =>{  student.update_student(req, res, pool) })

router.get('/teacher/:id', (req, res) => {     teacher.get_teacher  (req, res, pool ) })
router.get('/teachers/list', (req, res) => {         teacher.get_list(req, res, pool)       })
router.delete('/teacher/:id', (req, res) => {  teacher.delete_teacher(req, res, pool) })
router.post('/teacher/add', (req, res) => {    teacher.add_teacher(req, res, pool)    })
router.post('/teacher/update', (req, res) => { teacher.update_teacher(req, res, pool) })

// router.post('/tags/add',   (req, res)=>{          tags.add_tag(req, res, pool) });
// router.post('/tag/add_set_tagging', (req, res) =>{     tags.add_set_tagging (req, res, pool) });
// router.post('/tag/add_task_tagging', (req, res) =>{     tags.add_task_tagging(req, res, pool) });

router.get('/tasks/search/:tags',(req, res) => { tasks.search_task(req, res, pool) });
router.get('/task/:id', (req, res) =>{      tasks.get_task  (req, res, pool ) } );
router.get('/tasks/list',(req, res) => {   tasks.get_task_list(req, res, pool) });
router.post('/task/add', (req, res)=>{        tasks.add_task(req, res, pool) });
router.post('/task/update', (req, res) =>{ tasks.update_task(req, res, pool) });
router.delete('/task/:id', (req, res) =>{ tasks.delete_task(req, res, pool) });

router.post('/set/add', (req, res)=>{        sets.add_set(req, res, pool) });
router.post('/set/update', (req, res)=>{        sets.update_set(req, res, pool) });
router.post('/set/assignments', (req, res)=>{        sets.add_assignings_task (req, res, pool) });
router.post('/set/clear/', (req, res) =>{ sets.clear_tasks(req, res, pool) });
router.post('/set/remove/', (req, res) =>{ sets.remove_tasks(req, res, pool) });

router.get('/sets/search/:tags',(req, res) => { sets.search_sets(req, res, pool) });
router.post('/set/duplicate', (req, res) =>{      sets.duplicate_set  (req, res, pool ) } );
router.get('/sets/list', (req, res) =>{      sets.get_set_list  (req, res, pool ) } );
router.get('/set/:id', (req, res) =>{      sets.get_set  (req, res, pool ) } );
router.delete('/set/:id', (req, res) =>{ sets.delete_set (req, res, pool) });

router.post('/tasks_performed/add', (req, res)=>{  tasks_performed.add_task_performed(req, res, pool) });
router.get('/tasks_performed/search', (req, res)=>{  tasks_performed.search_tasks_performed(req, res, pool) });
router.get('/tasks_performed/list', (req, res)=>{  tasks_performed.get_tasks_performed_list(req, res, pool) });
router.delete('/tasks_performed/clear', (req, res)=>{  tasks_performed.clear(req, res, pool) });

router.get('/tags/popular' , (req, res)=>{  tags.get_popular_tags (req, res, pool) })


app.use('/api',router)

let msg = `${package.description} listening at port ${port}`

app.listen(port, () => { console.log( msg ) ; })