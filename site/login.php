<?php

session_start();
include "php/common.php";

check_login_status();

?>

<!DOCTYPE html>
<html>
  <head>
    <title>איקודה - כניסת מורים</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<?php
		writePageJs();
		writePageCss();
	?>

    <style>
        body{
          text-align: right !important;
          /* font-family: 'Chewy', cursive; */
          font-family: 'Secular One', sans-serif;
          /* background-image: url('https://cdn.pixabay.com/photo/2018/07/08/08/44/art-and-craft-3523450_960_720.jpg'); */

        }
        input{
            text-align: right !important;
        }
        #messege{
          display: none;
        }
        #version{
          margin-right: 16px;
        }
        #hello{
          margin-left: 16px;
        }
    </style>

</head>
<body>
    
<div class="container">

<div class="row mt-5">
    <div class="col-md-6 m-auto">
      <div class="card card-body">
        <h1 class="text-center mb-3"></i> ברוכים הבאים לאיקודה</h1>
          <form action="./do_login.php" id = "form">
          <div class="form-group">
            <label for="email">כתובת מייל</label>
            <input 
              type="email"
              id="email"
              name="email"
              class="form-control"
              placeholder="הכנס כתובת מייל"
              required
            />
          </div>
          <div class="form-group">
            <label for="password" >סיסמא</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-control"
              placeholder="הכנס סיסמא"
              required
            />
          </div>
           <input type="submit" value="לכניסה" class="btn btn-primary btn-block text-center" disabled="disabled" />
        </form>
      </div>
      <h4 id = "messege"  class="alert alert-danger mt-4">שם משתמש או סיסמא אינם נכונים</h4>
    </div>
  </div>
</div>

<div class='center margin-top-1'>
    <a href="./">לכניסת תלמידים לחצ/י כאן</a>
</div>


<script>

let form = document.querySelector('form')
let inputs = document.querySelectorAll('input')
let required_inputs = document.querySelectorAll('input[required]')
let login = document.querySelector('input[type="submit"]')
form.addEventListener('keyup', function(e) {
    let disabled = false
    inputs.forEach(function(input, index) {
        if (input.value === '' || !input.value.replace(/\s/g, '').length) {
            disabled = true
        }
    })
    if (disabled) {
        login.setAttribute('disabled', 'disabled')
    } else {
        login.removeAttribute('disabled')
    }
})


$(document).ready(function(){
  $('#form').on("submit",(function (e) {
    e.preventDefault();

    let email = $('#email').val();
    let password =  $('#password').val();
    let url = $(this).attr('action');

    let settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({"email": email,"password": password}),
    };

    ($.ajax(settings).done(function (response) {
        console.log(response);
        if(response.user_type =='student') {

        window.location.href = './icoda.php'
        }
        else if (response.user_type === 'teacher' && response.admin === true){

        window.location.href = './admin.php'
        }else if (response.user_type === 'teacher' &&  response.admin === false){

        window.location.href = './teacher.php'
        }
        else if (response.is_logged === 'false'){
        console.log(response);
        }
    }).fail(function(data){
        let messege = document.getElementById("messege");
        messege.style.display = "block";
    })
    );
  }))
})
</script>

</body>
</html>