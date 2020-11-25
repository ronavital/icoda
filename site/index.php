<?php

session_start();
include "php/common.php";

check_login_status();

?>

<!DOCTYPE html>
<html lang="en">
  <head>

    <title>איקודה</title>
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
    <title>Login App</title>
 </head>
 <body>
   
 
<div class="container">
     
  <div class="row mt-5">
    <div class="col-md-6 m-auto">
      <div class="card card-body">
        <h1 class="text-center mb-3"></i>כניסה למערכת איקודה</h1>
          <form id = "form">
          <div class="form-group">
            <input 
                type="tel"
                id="phone"
                name="phone"
                class="form-control"
                placeholder="מספר טלפון כאן..."
                pattern="[-0-9]{9,10}"
                required
            />
        </div>
        <input type="submit" value="לכניסה" class="btn btn-primary btn-block text-center" disabled="disabled" />
        </form>
      </div>
      <h4 id = "messege"  class="alert alert-danger mt-4">מספר הטלפון לא נמצא, נסה שוב</h4>
    </div>
  </div>
</div>

<div class='center margin-top-1'>
    <a href="./login.php">לכניסת מורים לחצ/י כאן</a>
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
  
      let phone = $('#phone').val();
      // let url = $(this).attr('action');
      const settings = {
        "url": "./do_login.php",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json",
        },
        "data": JSON.stringify({"phone":`${phone}`}),
      };
      ($.ajax(settings).done(function (response) {
          console.log(response);
          window.location.href = './icoda.php';
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