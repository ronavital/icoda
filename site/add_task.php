<?php

session_start();
include "php/common.php";
assert_admin();

?>
<!DOCTYPE html>
<html>
    <head>
		<!-- Put title here -->
        <title>הוספת משימה למערכת איקודה</title>
		<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1">
		<?php
			writePageJs();
			writePageCss();
		?>

    </head>
    <body>
		<?php write_nav_bar() ?> 
        <div class="container">
            <div class="card card_container task">
                <div class="alert alert-danger" id="success-alert">
                    <button type="button" class="close" data-dismiss="alert">x</button>
                </div>
                <center><h2>הוספת תרגיל למערכת איקודה</h2></center>
                <form id="add_task">
                    <div class="form-group row">
                        <label for="description" class="col-sm-3 col-form-label">תיאור המשימה</label>
                        <div class="col-sm-9">
                            <input type="text" id="description" name="description" placeholder="תאר את התרגיל " required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="tags" class="col-sm-3 col-form-label">תגיות</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" rows="3" id="tags" name="tags" placeholder="הזן מילות מפתח הקשורות לתרגיל והפרד ביניהם ברווחים, לדוג': קשה כתה_א-ד מוצלח_מאד" required></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="execution_instructions" class="col-sm-3 col-form-label">הנחיות ביצוע</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" rows="2" id="execution_instructions" name="execution_instructions" placeholder="הוראות" required></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="task" class="col-sm-3 col-form-label">תוכן התרגיל</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" rows="10" id="task" name="task" placeholder="כתוב או הדבק את תוכן התרגיל" required></textarea>
                        </div>
                    </div>
                    <input type="submit" class="btn btn-primary" name="submit" value="הוסף">
        
                </form>
            </div>
        </div>
    </body>
    			
<script>


    // jQuery init function. Code to intialize page comes here 
    $(function() 
    {
        $("#add_task").submit(function(e){
        e.preventDefault();
        // get fields as json
        let json_data = serialize_form("#add_task")
        json_data.tags = json_data.tags.split(/\s+/)
        json_data.teacher_id = 1
       
        // create a post request
        send_post_request("./api/task/add", json_data, function(res){ show_alert(res.msg) }, function(res){show_alert(res.responseText)})
    });

    });

    </script>
</html>