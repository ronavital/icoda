<?php

session_start();
include "php/common.php";

?>
<!DOCTYPE html>
<html>
    <head>
        <title>איקודה - סט חדש</title>
        <meta charset="UTF-8" content="width=device-width, initial-scale=1">

		<?php
			writePageJs();
			writePageCss();
		?>	
    </head>
    <body dir="rtl">
    
      <?php write_nav_bar() ?>
	<!-- Page specific content -->
	
        <div class="container">
                <div class="row">
                    <p class="h2 w-100 text-center text-primary">איקודה - סט חדש</p>
                </div>
                  <div class="row" id="optional_tags">
                    <p>תגיות פופולאריות: </p>
                  </div>
                  <div class="row my-3">
                    <input class="rounded border-primary w-75 p-2" type="search" id="tasks_search_box" name="id" placeholder="הזן תגיות לחיפוש">
                    <i id="tasks_search_button"class="text-primary mr-3 fa fa-search" style="font-size:24px"></i>
                  </div>
              
            
                <div class="alert alert-success" id="success-alert">
                    <button type="button" class="close" data-dismiss="alert">x</button>
                </div>
                <p class="h6 text-center text-primary">בחר תרגילים להוספה לסט</p>
                <form id="new_set" class="form-group row">
                  <div class="border col-md-6 boxlayout">
                    <div class="form-group">
                      <label class="text-primary" for="name">שם הסט <span class="required">*<span></label>
                      <input class="form-control" class="form-control" type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                      <label class="text-primary" for="description">תיאור <span class="required">*<span></label>
                      <input class="form-control" class="form-control" type="text" id="description" name="description" required>
                    </div>
                    <div class="form-group">
                      <label class="text-primary" for="execution_instructions">הוראות ביצוע<span class="required">*<span></label>
                      <input class="form-control" class="form-control" type="text" id="execution_instructions" name="execution_instructions" required>
                    </div>
                    <div class="form-group">
                      <label class="text-primary" for="tags">תגיות</label>
                      <div id="tags"></div>
                      <!-- <input class="form-control" class="form-control" type="text" id="tags" name="tags"> -->
                    </div>
                  </div>
                  
                  <div class="border col-md-6 boxlayout">

                    <div id="tasks_table" class="scrollbar"></div>
                  </div>
                  <div class="col">
                    <a class="btn btn-secondary col-md-3" href="sets.php">בטל</a>
                    <button class="btn btn-primary col-md-8" type="submit">צור סט</button>
                  </div>
                  
                </form>
                
            <!-- </div> -->
        </div>

	<!-- End of page specific content -->		
    </body>
	
<script>

//Search tasks
$("#tasks_search_button").click(function()
{
  const tasks = $('#tasks_search_box').val().split(/\s+/);
  $("#tags").text(tasks)
	fill_tasks_table(tasks);
});

// jQuery init function. Code to intialize page comes here 
$(function() 
{

	
	// Fetch data
    fill_tasks_table( null ); // All tasks
    get_popular_tags();
    // get_task_text('38')
    $('[data-toggle="tooltip"]').tooltip()

  

    $("#new_set").submit(function(e){
        e.preventDefault();

        // get fields as json
        let json_data = serialize_form("#new_set")
        
        // if needed edit data
        json_data.tags = $('#tags').text().split(',')
       ;
        let tasks = []
        $("#new_set input:checkbox:checked").each(function() {
          tasks.push($(this).val())
        });
        json_data.tasks = tasks
        json_data.teacher_id = '1'
        console.log(json_data);
        // create a post request
        send_post_request("./api/set/add", json_data, function(res){ show_alert(res.msg) }, function(res){show_alert(res.responseText)})

    });
    
});
$(document).on("click",".task", function() {
	$.ajax({
        type: 'GET',
        url: './api/task/'+$(this).data('id'),
    }).done(function(data){
      console.log(data.task);
      
    })
  });

</script>

</html>