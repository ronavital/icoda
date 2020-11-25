<?php

session_start();
include "php/common.php";


$email = null;
$password = null;
$phone = null;

$data = json_decode(file_get_contents('php://input'), true);

error_log( print_r( $data, true ));

if ( isset( $data['email'] ))
	$email = $data['email'];
if ( isset( $data['password'] ))
	$password = $data['password'];
if ( isset( $data['phone'] ))
	$phone = $data['phone'];

$res = null;

if ( $phone )
{
	$res = post_api_call( 'student/login', $data );
}
else
{
	$res = post_api_call( 'teacher/login', $data );
}


unset( $_SESSION[ 'user_type' ] );
unset( $_SESSION[ 'user_name' ] );
unset( $_SESSION[ 'user_id' ] );

if ( $res['status'] == 200 )
{

	$details = json_decode( $res['body'], true );
	$_SESSION[ 'user_type' ]  = $details['user_type'];
	$_SESSION[ 'user_name' ]  = $details['first_name'];
	$_SESSION[ 'user_id' ]  = $details['id'];

	if ( isset( $details['admin'] ))
		$_SESSION[ 'user_admin'] = $details['admin'];
	else
		$_SESSION[ 'user_admin'] = false;

	header( "Content-Type: application/json" );
	echo $res['body'];
}
else
{
	error_log( $res['body'] );
	http_response_code( $res['status'] );
	echo $res['body'];
}




?>


