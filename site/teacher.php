<?php

session_start();
include "php/common.php";
assert_teacher();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    
    <title>איזור מורים</title>
    <meta charset="UTF-8" content="width=device-width, initial-scale=1">

    <?php
      writePageJs();
      writePageCss();
    ?>	

  </head>
  <body dir="rtl">

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <span class="version" id ="version" >
                  version
                </span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
    
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto">

                <i class="fa fa-user fa-2x" aria-hidden="true" ></i>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    שלום אורח
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="./api/logout">ליציאה</a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>

  





  
  
<div class="container">


<center><h1>כאן יבוא איזור מורים...</h1></center>

</div>

</body>
</html>