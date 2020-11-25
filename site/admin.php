<?php

session_start();
include "php/common.php";

assert_admin();

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    
    <title>איזור ניהול</title>
    <meta charset="UTF-8" content="width=device-width, initial-scale=1">

    <?php
      writePageJs();
      writePageCss();
    ?>	
  </head>
  <body dir="rtl">

 	<?php write_nav_bar() ?> 
  
<div class="container">

<center><h1>איזור ניהול</h1></center>
<div class="text-center mt-5">
  <a class="btn btn-primary" role="button" href="students.php">ניהול תלמידים</a>
  <a class="btn btn-primary" role="button" href="teachers.php">ניהול מורים</a>
  <a class="btn btn-primary" role="button" href="add_task.php">הוספת תרגיל</a>
</div>
</div>

</body>
</html>