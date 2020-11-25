<?php

session_start();
include "php/common.php";
assert_admin();

?>
<!DOCTYPE html>
<html>
    <head>
        <title>ניהול רשימת תלמידים</title>
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
                <div class="col">
                    <a class="btn btn-primary w-75" href="add_student.php">הוסף תלמיד</a>
                </div>
                <div class="col">
                    <p class="h2 text-center text-primary">ניהול תלמידים</p>
                </div>
                <div class="col">
                    <input class="rounded border-primary w-75 p-2" type="search" id="student_search_box" name="id" placeholder="הזן מספר תלמיד לחיפוש">
                    <i id="student_search_button"class="text-primary fa fa-search" style="font-size:24px"></i>
                </div>
                
            </div>
            <div class="card card_container students">
            <div class="modal" id="data_card" tabindex="-1" role="dialog" aria-labelledby="data_card_Label">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="data_card_Label">פרטי תלמיד</h4>
                        </div>
                        <div class="modal-body">
                        ...
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" id="delete-btn">מחיקה</button>
                        <button type="button" class="btn btn-primary" id="edit-btn">עריכת פרטים</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="alert alert-success" id="success-alert">
                    <button type="button" class="close" data-dismiss="alert">x</button>
                </div>
                <p class="h6 text-center text-primary">לחץ על שורת תלמיד כדי לערוך או למחוק</p>
                <div id="students_table" class="scrollbar"></div>

            </div>
        </div>

	<!-- End of page specific content -->		
    </body>
	
<script>

// Search a student
$("#student_search_button").click(function()
{
	const id = $('#student_search_box').val();
	fill_students_table(id);
});

// jQuery init function. Code to intialize page comes here 
$(function() 
{
	
	// Fetch data
    fill_students_table( null ); // All students

    $(".student").click(function(){
        $("#data_card").modal("show");
    });
    $("#data_card").on('show.bs.modal', function(e){
        let id = $(e.relatedTarget).data('id');
        $('#delete-btn').data('id', id);
        $('#edit-btn').data('id', id);
        $(".modal-body").html($(e.relatedTarget).data('name'));
        
        $("#edit-btn").click(function(){
            edit_student($(this).data('id'));
        });
        $("#delete-btn").click(function(){
            delete_student($(this).data('id'), $(e.relatedTarget).data('name'));
        });
    });
});

</script>

</html>