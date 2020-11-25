<?php

session_start();
include "php/common.php";
assert_admin();

?>
<!DOCTYPE html>
<html>
    <head>
        <title>איקודה - ניהול סטים</title>
        <meta charset="UTF-8" content="width=device-width, initial-scale=1">

		<?php
			writePageJs();
			writePageCss();
		?>	
    </head>
    <body>
		<?php write_nav_bar() ?> 
	<!-- Page specific content -->
	
        <div class="container">
            <div class="row mt-3 p-3">
                <div class="col-md-4">
                    <a class="btn btn-primary w-75" href="new_set.php">צור סט חדש</a>
                </div>
                <div class="col-md-4">
                    <p class="h2 text-center text-primary">ניהול סטים</p>
                </div>
            </div>
                <div class="row" id="optional_tags">
                    <p>תגיות פופולאריות: </p>
                  </div>
                  <div class="row my-3">
                    <input class="rounded border-primary w-75 p-2" type="search" id="sets_search_box" name="id" placeholder="הזן תגיות לחיפוש">
                    <i id="sets_search_button"class="text-primary mr-3 fa fa-search" style="font-size:24px"></i>
                  </div>
                
            
            <!-- <div class="card card_container students"> -->
                <div class="alert alert-success" id="success-alert">
                    <button type="button" class="close" data-dismiss="alert">x</button>
                </div>
                <!-- <p class="h6 text-center text-primary">לחץ על שורת תלמיד כדי לערוך או למחוק</p> -->
                <div id="sets_table" class="scrollbar"></div>

            <!-- </div> -->
        </div>

	<!-- End of page specific content -->		
    </body>
	
<script>

// Search a set
$("#sets_search_button").click(function()
{
  const tags = $('#sets_search_box').val().split(/\s+/);
  $("#optional_tags").text(tags)
	fill_sets_table(tags);
});

// jQuery init function. Code to intialize page comes here 
$(function() 
{
	
	// Fetch data
    fill_sets_table( null ); // All sets
    get_popular_tags();
    
});

</script>

</html>