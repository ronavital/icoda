<?php

session_start();
include "php/common.php";
assert_admin();

?>
<!DOCTYPE html>
<html>
    <head>
        <title>הוספת מורה למערכת איקודה</title>
        <meta charset="UTF-8" content="width=device-width, initial-scale=1">

        <?php
            writePageJs();
            writePageCss();
        ?>	
    </head>
    <body>

	<?php write_nav_bar() ?> 

    <div class="container">
        <div class="alert alert-danger" id="success-alert">
            <button type="button" class="close" data-dismiss="alert">x</button>
        </div>
        <p class="h2 text-center">הוספת מורה</p>

        <form id="add_teacher" class="d-flex justify-content-center">
        
            <div>  
                <p class="h6 text-danger">נא מלא את שדות החובה המסומנות בכוכבית *</p>
  
                <div class="border px-5">
                    <div class="form-group mt-3">
                        <label class="text-primary" for="first_name">שם פרטי <span class="required">*<span></label>
                        <input class="form-control" class="form-control" type="text" id="first_name" name="first_name" required>
                    </div>
                    <div class="form-group">
                        <label class="text-primary" for="last_name">שם משפחה<span class="required">*<span></label>
                        <input class="form-control" type="text" id="last_name" name="last_name" required>
                    </div>
               
                    
                    <div class="form-group">
                        <label class="text-primary" for="email">כתובת אימייל<span class="required">*<span></label>
                        <input class="form-control" type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label class="text-primary" for="phone_number">טלפון<span class="required">*<span></label>
                        <input class="form-control" type="text" id="phone_number" name="phone_number" required>
                    </div>
                    <div class="form-group">
                        <label class="text-primary" for="password">סיסמה<span class="required">*<span></label>
                        <input class="form-control" type="password" id="password" name="password" required>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="admin" name="admin">
                        <label class="form-check-label mr-3" for="admin">מנהל</label>
                    </div>
                    <div class="form-group mt-3">
                        <a class="btn btn-secondary col-md-3" href="teachers.php">בטל</a>
                        <button class="btn btn-primary col-md-8" type="submit">עדכן</button>
                    </div>
                </div>  
            </div>                     
        </form>
    </div>
</body>
			
<script>


// jQuery init function. Code to intialize page comes here 
$(function() 
{
    
    $("#add_teacher").submit(function(e){
        e.preventDefault();

        // get fields as json
        let json_data = serialize_form("#add_teacher")
        
        if ('admin' in json_data && json_data.admin == 'on')
            json_data.admin = true
        else
            json_data.admin = false

        console.log(json_data)

        // create a post request
        send_post_request("./api/teacher/add", json_data, function(res){ window.location.href = 'teachers.php?alert=0&id='+res.id }, function(res){show_alert(res.responseText)})

    });

});


</script>			

</html>