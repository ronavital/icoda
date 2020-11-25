<?php
// Icoda php common functions

// Returns an array with status code and body
function get_data( $url)
{

	$service_url = $url  ;
	$curl = curl_init($service_url);
	
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$headers = array("Content-type: application/json");
	
	curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers );
	$curl_response = curl_exec($curl);
	$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	if ($curl_response === false  ) 
	{
		curl_close($curl);
		return 	array( 'status' => $httpcode , 'body' =>  curl_error( $curl )  );
	}

	if ($httpcode != 200  ) 
	{
		curl_close($curl);
		return 	array( 'status' => $httpcode , 'body' =>  $curl_response  );
	}	

	curl_close($curl);
	return array( 'status' => 200 , 'body' => $curl_response );
}

function post_data( $url, $data )
{
	error_log( "Post data to $url" );
	$content = json_encode($data);
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	
	$headers = array("Content-type: application/json");
	
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers );
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $content);


	$curl_response = curl_exec($curl);
	$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	if ($curl_response === false  ) 
	{
		$error =  curl_error( $curl );
		curl_close($curl);
		return 	array( 'status' => $httpcode , 'body' =>  $error  );
	}

	if ($httpcode != 200  ) 
	{
		curl_close($curl);
		return 	array( 'status' => $httpcode , 'body' =>  $curl_response  );
	}

	curl_close($curl);
	return array( 'status' => 200 , 'body' => $curl_response );	
}

function post_api_call( $url, $data )
{

	return post_data(  get_api_base() . $url , $data );
}

function get_api_call( $url, $data )
{
	return get_data(  get_api_base() . $url , $data );
}

$gVersion = null;

function get_version()
{
global $gVersion;

	if ( $gVersion )
		return $gVersion;

	$ret = get_data( get_api_base() . "version" );
	if ( $ret['status'] == 200 )
	{
		$gVersion = json_decode(  $ret['body'], true )['version'];
	}
	else
		$gVersion = 'Unknown';
	return $gVersion;
}

function is_secure()
{
	$is_secure = false;
	if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') 
		$is_secure = true;
	elseif (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https' || 
		!empty($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on') 
		$is_secure = true;
	return $is_secure;
}



function is_test()
{
	if ( stristr( $_SERVER['REQUEST_URI'], 'test' ))
		return true;
	return false;
}

function get_base()
{
	return "./";
}

function get_api_base()
{
	if ( is_test() )
		return "http://localhost:8081/api/";
	else
		return "http://localhost:8080/api/";
}

function is_logged_in()
{
	return isset( $_SESSION[ 'user_type' ] );
}

function get_user_type()
{
	if ( !is_logged_in() )
		return null;
	return $_SESSION[ 'user_type' ];
}

function is_admin()
{
	if ( !is_logged_in() )
		return false;
	return 	$_SESSION[ 'user_admin'];
}

function check_login_status()
{
	if ( is_logged_in() )
	{
		$location = null;
		
		$type = get_user_type();
		switch( $type )
		{
			case 'student': $location = './icoda.php'; break;
			case 'teacher': 
				if ( is_admin() )
				{
					$location = './admin.php'; break;
				}
				else
				{
					$location = './teacher.php'; break;
				}
		}
		
		if ( $location )
		{
			header( "Location: $location" );
			die();
		}
	}
}

function assert_student()
{
	if ( !is_logged_in() )
	{
		header( "Location: ./" );
		die();
	}		
}

function assert_teacher()
{
	if ( !is_logged_in() )
	{
		header( "Location: ./login.php" );
		die();
	}		
}

function assert_admin()
{
	if ( !is_logged_in() )
	{
		header( "Location: ./login.php" );
		die();
	}		
}


function write_nav_bar(  )
{
	$isLoggedIn = is_logged_in();
	
	$base = ".\\";
	
	
	if ( $isLoggedIn )
	{
		$userName = $_SESSION["user_name"];
	}
	
	
	echo ( "<nav class=\"navbar navbar-expand-md fixed-top navbar-dark bg-dark\">\n");
	
	echo ( "<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarNav\" aria-controls=\"navbarCollapse\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n");
	echo ( "<span class=\"navbar-toggler-icon\"></span>\n");
	echo ( "</button>\n");
	
	echo ( "<div class=\"collapse navbar-collapse\" id=\"navbarNav\">\n");
	echo ( "<ul class=\"navbar-nav mr-auto\">\n");
	
	if ( $isLoggedIn )
	{
		echo ( "<li class=\"nav-item dropdown\">\n");
		echo ( "<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n");
		echo ( "$userName\n");
		echo ( "</a>\n");
		echo ( "<div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdown\">\n");
		echo ( "<a class=\"dropdown-item\" href=\"" . $base . "do_logout.php\">Log out</a>\n");
		echo ( "</div>\n");
		echo ( "</li>\n");
		
		if ( is_admin() )
		{
			echo ( "<li class=\"nav-item dropdown\">\n");
			echo ( "<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n");
			echo ( "מנהל\n");
			echo ( "</a>\n");
			echo ( "<div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdown\">\n");
			echo ( "<a class=\"dropdown-item\" href=\"" . $base . "students.php\">ניהול תלמידים</a>\n");
			echo ( "<a class=\"dropdown-item\" href=\"" . $base . "teachers.php\">ניהול מורים</a>\n");
			echo ( "<a class=\"dropdown-item\" href=\"" . $base . "add_task.php\">הוספת תרגיל</a>\n");

/*
			echo ( "<div class=\"dropdown-divider\"></div>\n");
			echo ( "<a class=\"dropdown-item\" href=\"" . $base . "upload_transactions.php\">Upload Tranasctions File</a>\n");
			echo ( "</div>\n");
			echo ( "</li>\n");
*/
		}
		
	}
	else
	{
		echo ( "  <li class=\"nav-item\">\n");
		echo ( "    <a class=\"nav-link\" href=\"" . $base . "login.php\">Log In</a>\n");
		echo ( "  </li>\n");
	}
	

	
	/*
	if ( $isLoggedIn )
	{
		echo ( "<li class=\"nav-item dropdown\">\n");
		echo ( "<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">Tools</a>\n");
		echo ( "<div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdown\">\n");
		echo ( "<a class=\"dropdown-item\" href=\"" . $base . "gia\">GIA Report</a>\n");
		echo ( "<a class=\"dropdown-item\" href=\"" . $base . "rough_calculator\">Rough Calculator</a>\n");
		echo ( "<a class=\"dropdown-item\" href=\"" . $base . "rough_upload\">Rough Data Upload</a>\n");
		echo ( "<div class=\"dropdown-divider\"></div>\n");
		echo ( "<a class=\"dropdown-item\" href=\"" . $base . "changelog.php\">Change Log</a>\n");
		
		echo ( "</div>\n");
		echo ( "</li>\n");
	}
	*/
	
	echo ( "</ul>\n");
	echo ( "</div>\n");

    echo ("<span id=\"navbar_version\" >Version " . get_version() . "</span>\n" );

	echo ("</nav>\n");
}



function writePageCss()
{
	echo ( "<!-- Bootstrap CSS -->\n" );
    echo ( "<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">\n");
	echo ( "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css\">\n");
	echo ( "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/responsive/2.2.2/css/responsive.dataTables.min.css\"/>\n");
	echo ( "<link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.6.3/css/all.css\" crossorigin=\"anonymous\">\n");
    echo ( "<link rel=\"stylesheet\" type='text/css' href=\"css/icoda.css\">\n");
}

function write_single_js( $src, $inline )
{
	if ( !$inline )
		echo ( "<script src='$src'></script>\n" );
	else
	{
		echo ( "<!-- " .  $src  . "-->\n" );
		echo ( "<script>\n" );
		$code = file_get_contents( $src );
		echo $code;
		echo ( "</script>\n" );
		
	}
}

function writePageJs()
{
	echo ( "<script src=\"https://code.jquery.com/jquery-3.3.1.js\" crossorigin=\"anonymous\"></script>\n" );
	echo ( "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\" integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\" crossorigin=\"anonymous\"></script>\n" );
	echo ( "<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\" integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\" crossorigin=\"anonymous\"></script>\n" );
	echo ( "<script src=\"https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js\"></script>\n" );
	echo ( "<script src=\"https://cdn.datatables.net/responsive/2.2.2/js/dataTables.responsive.min.js\"></script>\n");
	

	echo ( "<!-- Optional JavaScript -->\n" );
	write_single_js( "js/functions.js", false );

}





?>