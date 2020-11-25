<?php

session_start();
include "php/common.php";


unset( $_SESSION[ 'user_type' ] );
unset( $_SESSION[ 'user_name' ] );
unset( $_SESSION[ 'user_id' ] );


header(  "Location: " . get_base() );

?>


