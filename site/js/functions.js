
function show_alert( msg )
{
	$("#success-alert").html( msg );
	$("#success-alert").fadeTo(7000, 500).slideUp(500, function() 
	{
		$("#success-alert").slideUp(500);
	});
}

function hide_alert( )
{
    $("#success-alert").hide();
}


function get_data_list( url , success_func , err_func ){

	const settings = {
		"url": url,
        "method": "GET"
    };
      
	$.ajax(settings).done(function (data) 
	{
		if(data.students)
			success_func(  data.students );
		else if(data.teachers)
			success_func(  data.teachers );
		else if(data.tasks)
			success_func(  data );
		else
			success_func( [ data] );

	}
	).fail( function( res ) 
	{
		err_func(  res.responseText );
	});
}

function get_popular_tags(){
	let url = './api/tags/popular'
	get_data_list( url, (res)=> build_tags(res[0].popular_tags), (res)=> show_alert(res.responseText) )
	
}
function build_tags(tags){
	for ( let tag of tags ){
		let button_tag = $('<button>').attr('class', 'btn btn-outline-primary').text(tag)
		$("#optional_tags").append(button_tag)
	}
}

function get_task_text( task_id ){
	let url = './api/task/'+task_id
	
	$.ajax({
        type: 'GET',
        url: url,
    }).done(function(data){
		console.log(data.task);
		return data.task;
    })
    // return 5
	// $.ajax({
    //     type: "GET",
    //     url: './api/task/'+task_id,
    //     success: function(data) {
    //         // Run the code here that needs
	// 		//    to access the data returned
	// 		console.log(data.task);
    //         return data.task;
    //     },
    //     error: function() {
    //         alert('Error occured');
    //     }
    // });
	// const settings = {
	// 	"url": url,
    //     "method": "GET"
	// };
	// let txt = '123';      
	// $.ajax(settings).done(function (res) {
	// 	// console.log(res.task);
	// 	txt = res.task;
	// 	return txt
	// 	console.log(txt);
	// }).fail( function( res ) {
	// 	txt =  res.responseText ;
	// });
	// console.log(txt);
	// return txt
}


function build_teachers_table( teachers ){	
	let col = $('<tr>');
	let columns = ['מספר מורה','שם פרטי','שם משפחה','אימייל', 'טלפון','',''];
	for (column of columns){
		col.append($('<th>').text(column).attr('scope', 'col'));
		
	}
	let thead = $('<thead>').append(col);
	
	let tbody = $('<tbody>').attr('id', 'teachers');
	
	for (teacher of teachers){
		let row = $('<tr>').attr('id', teacher['id']).attr('class', 'teacher').attr('data-name', teacher['first_name']+' '+teacher['last_name']).attr('data-id', teacher['id']);
		let keys = ['id','first_name','last_name','email', 'phone_number'];
		for (key of keys){
			row.append($('<td>').text(teacher[key]).attr('scope', 'row'));
		}
		row.append($('<td>').html('<i class="fas fa-edit"></i>').attr('scope', 'row'));
		row.append($('<td>').html('<i class="fas fa-trash"></i>').attr('scope', 'row'));
		tbody.append(row);
	}
	let table = $('<table>').attr('class', 'table table-hover mb-0');
	$("#teachers_table").html( table.append(thead).append(tbody) );
}  


function build_tasks_table( tasks ){	
	let col = $('<tr>');
	let columns = ['בחירה','מספר תרגיל','תיאור התרגיל'];
	for (column of columns){
		col.append($('<th>').text(column).attr('scope', 'col'));
		
	}
	let thead = $('<thead>').append(col);
	
	let tbody = $('<tbody>').attr('id', 'tasks');
	
	for (task of tasks){
		let keys = ['task_id','description'];
		if ( 'id' in task )
			keys = ['id','description'];
		let row = $('<tr>', {
			id : task['id'],
			'data-toggle' : "tooltip",
			'data-placement' : "top",
			'data-id': task['id'],
			title : task['description'],
			class: 'task'
		})//.attr('id', task['id']).attr('class', 'task').attr('data-id', task['id']);
		
		row.append($('<td>').attr('scope', 'row').append(
		$('<input />', {
			type : 'checkbox',
			// 'data-toggle' : "tooltip",
			// 'data-placement' : "top",
			value: task[keys[0]]
		})));
		
		for (key of keys){
			row.append($('<td>').text(task[key]).attr('scope', 'row'));
		}
		tbody.append(row);
	}
	let table = $('<table>').attr('class', 'table table-bordered table-striped mb-0');
	$("#tasks_table").html( table.append(thead).append(tbody) );
}  

function build_sets_table( sets ){	
	console.log(sets)
	let col = $('<tr>');
	let columns = ['בחירה','מספר סט','תיאור הסט','',''];
	for (column of columns){
		col.append($('<th>').text(column).attr('scope', 'col'));
		
	}
	let thead = $('<thead>').append(col);
	
	let tbody = $('<tbody>').attr('id', 'sets');
	
	for (set of sets){
		let row = $('<tr>').attr('id', set['id']).attr('class', 'set');//.attr('data-id', set['id']);
		let keys = ['id','description'];
		row.append($('<td>').attr('scope', 'row').append(
		
		$('<input />', {
			type : 'checkbox',
			value: set['id']
		})));
		
		for (key of keys){
			row.append($('<td>').text(set[key]).attr('scope', 'row'));
		}
		row.append($('<td>').html('<i class="fas fa-edit"></i>').attr('scope', 'row'));
		row.append($('<td>').html('<i class="fas fa-trash"></i>').attr('scope', 'row'));
		tbody.append(row);
	}
	let table = $('<table>').attr('class', 'table table-striped mb-0');
	$("#sets_table").html( table.append(thead).append(tbody) );
}  


function build_students_table(students) {
	
	let col = $('<tr>');
	let columns = ['מספר תלמיד','שם פרטי','שם משפחה','כיתה','בית ספר', 'אימייל', 'טלפון','',''];
	for (column of columns){
		col.append($('<th>').text(column).attr('scope', 'col'));
		
	}
	let thead = $('<thead>').append(col);
	
	let tbody = $('<tbody>').attr('id', 'students');
	const classes= ['גן חובה', 'א', 'ב', 'ג', 'ד', 'ה', 'ו'];
	
	for (student of students){
		let row = $('<tr>').attr('id', student['id']).attr('class', 'student').attr('data-name', student['first_name']+' '+student['last_name']).attr('data-id', student['id']);
		let keys = ['id','first_name','last_name','class','school', 'mother_email', 'phone_number_id'];
		for (key of keys){
			if(key == 'class'){
				row.append($('<td>').text(classes[student[key]]).attr('scope', 'row'));
			}else{
				row.append($('<td>').text(student[key]).attr('scope', 'row'));
			}			
		}	
		row.append($('<td>').html('<i class="fas fa-edit"></i>').attr('scope', 'row'));
		row.append($('<td>').html('<i class="fas fa-trash"></i>').attr('scope', 'row'));
		tbody.append(row);
	}	
	let table = $('<table>').attr('class', 'table table-hover mb-0');
	$("#students_table").html( table.append(thead).append(tbody) );
}    


// Takes the json-data and write on the screen
function fill_students_table( student_id )
{
	let url;
	if ( !student_id )
		url = './api/students/list';
	else
		url = './api/student/' + student_id;
	get_data_list( url, build_students_table, show_alert );
}

function fill_sets_table( tags )
{
	let url;
	if ( !tags ){
		url = './api/sets/list';
		get_data_list( url, (res)=> build_sets_table(res[0].sets), show_alert );

	}else{
		url = './api/sets/search/' + tags;
		get_data_list( url, (res)=> build_sets_table(res[0].sets), show_alert );
	}
}

function fill_teachers_table( teacher_id )
{
	let url;
	if ( !teacher_id )
		url = './api/teachers/list';
	else
		url = './api/teacher/' + teacher_id;
	get_data_list( url, build_teachers_table, show_alert );
}

function fill_tasks_table( tags ){
	let url;
	if ( !tags ){
		url = './api/tasks/list';
		get_data_list( url, (res)=> build_tasks_table(res.tasks), show_alert );
	}else{
		url = './api/tasks/search/' + tags;
		get_data_list( url, (res)=> build_tasks_table(res[0]), show_alert );
	}
}

// Edit user detailes
function edit_student(id){  
    
    location.href = 'update_student.php?id=' + id;    
}

// Delete a user
function delete_student( student_id, student_name )
{
	
    if(confirm("האם הנך בטוח שברצונך למחוק את תלמיד ': "+ student_name +" ?")){
        
        const settings = {
            "url": "./api/student/"+student_id,
            "method": "DELETE",
        };
        
        $.ajax(settings).done(function (res) {
            fill_students_table( null );
			show_alert( 'נמחקה רשומת תלמיד: '+student_name );
        }).fail( function (res){
            console.log(res);
			show_alert( res.responseText );
          });
    }
}

// Edit user detailes
function edit_teacher(id){  
    
    location.href = 'update_teacher.php?id=' + id;    
}

// Delete a user
function delete_teacher( teacher_id, teacher_name )
{
	
    if(confirm("האם הנך בטוח שברצונך למחוק את מורה ': "+ teacher_name +" ?")){
        
        const settings = {
            "url": "./api/teacher/"+teacher_id,
            "method": "DELETE",
        };
        
        $.ajax(settings).done(function (res) {
            fill_teachers_table( null );
			show_alert( 'נמחקה רשומת מורה: '+teacher_name );
        }).fail( function (res){
            console.log(res);
			show_alert( res.responseText );
          });
    }
}


// Fill input fields data - update teacher
function fill_teacher_fields()
{
    const url = new URL(window.location.href);
        if ( url.searchParams.get('id'))
		{
            const id = url.searchParams.get('id');
            $.get('./api/teacher/'+id, (data) => {
                $('#id').val(id);
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#email').val(data.email);
                $('#phone_number').val(data.phone_number);
                
            })  
        }
}

// Fill input fields data - update student
function fill_student_fields()
{
    const url = new URL(window.location.href);
        if ( url.searchParams.get('id'))
		{
            const id = url.searchParams.get('id');
            $.get('./api/student/'+id, (data) => {
                $('#id_to_edit').html(id);
                $('#id').val(id);
                $('#first_name').val(data.first_name);
				$('#last_name').val(data.last_name);
				let date_birth = data.date_birth.slice(6,10)+'-'+data.date_birth.slice(3,5)+'-'+data.date_birth.slice(0,2);
				$('#date_birth').val( date_birth);
				if ( data.phone_number_id == data.mother_phone){
					document.getElementById('phone_number_id_mother').checked=true;
					document.getElementById('phone_number_id_father').checked=false;
				}else if ( data.phone_number_id == data.father_phone){
					document.getElementById('phone_number_id_mother').checked=false;
					document.getElementById('phone_number_id_father').checked=true;
				}
				$('#mother_name').val(data.mother_name);
                $('#mother_email').val(data.mother_email);
                $('#mother_phone').val(data.mother_phone);
                $('#father_name').val(data.father_name);
                $('#father_email').val(data.father_email);
                $('#father_phone').val(data.father_phone);
                $('#class').val(data.class);
                $('#school').val(data.school);
                $('#diagnosis').val(data.diagnosis);
                $('#dedicated_kindergarten').val(data.dedicated_kindergarten);
                $('#communications_clinician').val(data.communications_clinician);
                $('#remedial_teaching').val(data.remedial_teaching);
                $('#dyslexia_parent_family').val(data.dyslexia_parent_family);
                $('#dyslexia_brothers_family').val(data.dyslexia_brothers_family);
                $('#Remarks').val(data.Remarks);
            })  
        }
}


// Check for alerts and show it 5 seconds
function show_window_alerts(){
	hide_alert();
	const url = new URL(window.location.href);
	if ( url.searchParams.get("alert") ){
		let msg ='';

		switch( url.searchParams.get("alert") ){
			case '0':
				msg = "הרשומה נוספה בהצלחה!  מספר מזהה: "+url.searchParams.get("id");
				break;
			case '1':
				msg = "הפרטים עודכנו בהצלחה!";
				break;
			case '2':
				msg = "תלמיד מס' "+url.searchParams.get("id") +"נמחק בהצלחה!";
				break;
			case '3':
				msg = "לא ניתן למחוק !" +url.searchParams.get("err");
				break;
			case '4':
				msg = url.searchParams.get("err");
				break;
			case '5':
				msg = "משתמש לא קיים!";
				break;
		}
		show_alert( msg );
	};
}



function serialize_form(form_id){
    // Get form fields data
    let array = $(form_id).serializeArray();
    
    let indexed_data = {};
    for (let field of array){ indexed_data[field['name']] = field['value'] };
    
    return indexed_data;

}

function send_post_request( url, data, success_func, fail_func ){
    const settings = {
        "url": url,
        "method": "POST",
        "headers": {
        "Content-Type": "application/json"
        },
        "data": JSON.stringify(data) ,
    };

    $.ajax(settings).done(function (res) {
        success_func(res)
    }).fail( function (res) {
        fail_func(res)
    });
}


// OnLoad
$(function()
{
    show_window_alerts();
});

