<?php

session_start();
include "php/common.php";
assert_admin();

?>
<!DOCTYPE html>
<html>
    <head>
        <title>עריכת פרטי מורה</title>
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
        <p class="h2 mb-4 text-center">עריכת פרטי מורה</p>
        <form id="update_teacher" class="d-flex justify-content-center">
        <input type="text" id="id" name="id" hidden>
            <div>  
                <p class="h6 text-danger">נא מלא את שדות החובה המסומנות בכוכבית *</p>
  
                <div class="border p-5">
                    <div class="form-group">
                        <label class="text-primary" for="first_name">שם פרטי <span class="required">*<span></label>
                        <input class="form-control" class="form-control" type="text" id="first_name" name="first_name" required>
                    </div>
                    <div class="form-group">
                        <label class="text-primary" for="last_name">שם משפחה<span class="required">*<span></label>
                        <input class="form-control" type="text" id="last_name" name="last_name" required>
                    </div>
               
<!--                     
                    <div class="form-group col-md-6">
                        <label class="text-primary" for="email">כתובת אימייל<span class="required">*<span></label>
                        <input class="form-control" type="email" id="email" name="email" required>
                    </div> -->
                    <div class="form-group">
                        <label class="text-primary" for="phone_number">טלפון<span class="required">*<span></label>
                        <input class="form-control" type="text" id="phone_number" name="phone_number" required>
                    </div>
                    <div class="form-group mt-5">
                        <a class="btn btn-light col-md-3" href="teachers.php">ביטול</a>
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

    fill_teacher_fields();
    
    $("#update_teacher").submit(function(e){
        e.preventDefault();

        // get fields as json
        let json_data = serialize_form("#update_teacher")
        
        if ('admin' in json_data && json_data.admin == 'on')
            json_data.admin = true
        else
            json_data.admin = false

        console.log(json_data)

        // create a post request
        send_post_request("./api/teacher/update", json_data, function(res){ 
            console.log(res);
            // window.location.href = 'teachers.php?alert=1&msg='+res.msg 
        }, function(res){show_alert(res.responseText)})

    });

});


</script>			

</html>