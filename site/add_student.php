<?php

session_start();
include "php/common.php";
assert_admin();

?>
<!DOCTYPE html>
<html>
    <head>
        <title>הוספת תלמיד למערכת איקודה</title>
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
        <p class="h2 text-center">הוספת תלמיד</p>
        <form id="add_student">
        <p class="h6 text-danger">נא מלא את שדות החובה המסומנות בכוכבית *</p>
  
            <div class="form-group row border-0">  
                
                <div class="border row col-md-9 boxlayout">
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="first_name">שם פרטי <span class="required">*<span></label>
                        <input class="form-control" class="form-control" type="text" id="first_name" name="first_name" required>
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="last_name">שם משפחה<span class="required">*<span></label>
                        <input class="form-control" type="text" id="last_name" name="last_name" required>
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="picture">תמונת התלמיד</label>
                        <input class="form-control" type="file" accept="image/*" id="picture" name="picture" >
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="date_birth">תאריך לידה<span class="required">*<span></label>
                        <input class="form-control" type="date" id="date_birth" name="date_birth" required>
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="class">כיתה<span class="required">*<span></label>
                        <select class="form-control" class="form-control" id="class" name="class" required>
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">א</option>
                        <option value="2">ב</option>
                        <option value="3">ג</option>
                        <option value="4">ד</option>
                        <option value="5">ה</option>
                        <option value="6">ו</option>
                    </select>
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="school">שם בית הספר</label>
                        <input class="form-control" type="text" id="school" name="school">
                    </div>
                    <p class="h6 text-danger">בחר אחד ממספרי הטלפון אשר ישמש עבור הזדהות בכניסה למערכת (ברירת מחדל הוא הטלפון של האם)<span class="required">*<span></p>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="mother_name">שם האם</label>
                        <input class="form-control" type="text" id="mother_name" name="mother_name">
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="mother_email">כתובת האימייל של האם<span class="required">*<span></label>
                        <input class="form-control" type="email" id="mother_email" name="mother_email" required>
                    </div>
                    <div class="form-group col-md-4">
                        <input class="form-check-input" type="radio" name="phone_number_id" id="phone_number_id" value="1" checked>
                        <label class="text-primary mr-3" for="mother_phone">טלפון של האם<span class="required">*<span></label>
                        <input class="form-control" type="text" id="mother_phone" name="mother_phone" required>
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="father_name">שם האב</label>
                        <input class="form-control" type="text" id="father_name" name="father_name">
                    </div>
                    <div class="form-group col-md-4">
                        <label class="text-primary" for="father_email">כתובת האימייל של האב</label>
                        <input class="form-control" type="email" id="father_email" name="father_email">
                    </div>
                    <div class="form-group col-md-4">
                        <input class="form-check-input" type="radio" name="phone_number_id" id="phone_number_id" value="2">
                        <label class="text-primary mr-3" for="father_phone">טלפון של האב<span class="required">*<span></label>
                        <input class="form-control" type="text" id="father_phone" name="father_phone" required>
                    </div>
                    
                </div>
                <div class="border row col-md-3 boxlayout">
                    <div class="form-group col-md-12">
                        <label class="text-primary" for="diagnosis">אובחן</label>
                        <select class="form-control" id="diagnosis" name="diagnosis">
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">כן</option>
                        <option value="2">לא</option>
                    </select>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="text-primary" for="dedicated_kindergarten">גן שפתי</label>
                        <select class="form-control" id="dedicated_kindergarten" name="dedicated_kindergarten">
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">כן</option>
                        <option value="2">בעבר</option>
                        <option value="3">לא</option>
                    </select>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="text-primary" for="communications_clinician">קלינאית תקשורת</label>
                        <select class="form-control" id="communications_clinician" name="communications_clinician">
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">כן</option>
                        <option value="2">בעבר</option>
                        <option value="3">לא</option>
                    </select>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="text-primary" for="remedial_teaching">הוראה מתקנת</label>
                        <select class="form-control" id="remedial_teaching" name="remedial_teaching">
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">כן</option>
                        <option value="2">בעבר</option>
                        <option value="3">לא</option>
                    </select>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="text-primary" for="dyslexia_parent_family">דיסלקציה אצל ההורים</label>
                        <select class="form-control" id="dyslexia_parent_family" name="dyslexia_parent_family">
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">כן</option>
                        <option value="2">לא</option>
                    </select>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="text-primary" for="dyslexia_brothers_family">דיסלקציה אצל אחים</label>
                        <select class="form-control" id="dyslexia_brothers_family" name="dyslexia_brothers_family">
                        <option value="0" selected disabled>בחר</option>
                        <option value="1">כן</option>
                        <option value="2">לא</option>
                    </select>
                    </div>
                </div>
                
            </div>
            <div class="form-group">
                <a class="btn btn-secondary col-md-3" href="students.php">בטל</a>
                <button class="btn btn-primary col-md-8" type="submit">עדכן</button>
            </div>
        </form>

    </div>
</body>
			
<script>


// jQuery init function. Code to intialize page comes here 
$(function() 
{
	
    
    $("#add_student").submit(function(e){
        e.preventDefault();

        // get fields as json
        let json_data = serialize_form("#add_student")
        
        // if needed edit data
        if (json_data.father_email == '')
            delete json_data['father_email']

        if (json_data.phone_number_id == 1)
		    json_data.phone_number_id = json_data.mother_phone;
        else if (json_data.phone_number_id == 2)
            json_data.phone_number_id = json_data.father_phone;
        json_data.ok = 1;

        // create a post request
        send_post_request("./api/student/add", json_data, function(res){ window.location.href = 'students.php?alert=0&id='+res.id }, function(res){show_alert(res.responseText)})

    });

});
   
</script>

</html>