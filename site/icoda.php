<?php

session_start();
include "php/common.php";

assert_student();

?>

<!doctype html>
<html>
<head>
    <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1">

	<?php
		writePageJs();
		writePageCss();
	?>
    
</head>

<script>

var state = { txt: '', txt_pages: [], page_number: 0, mode: 'no_syllables', exposure: {
                    mode: 'gray', elem: 'word', page_num: 0, line_num: 0, word_num: 0, syll_num: 0, text_mode: 'no_syllables', word_exposured: ''
                }, scored: true, drawings_arrays: []
            };
var drawing_array = [];
var canvas, ctx, flag = false;
var lastPt = null;
const scores = ["ְ", "ִ", "ֵ", "ֶ", "ַ", "ָ", "ׁ", "ׂ", "ֹ", "ּ", "ֻ", "ֱ", "ֲ", "ֳ"];

function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    // Mouse events
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

    // Touch events 
    canvas.addEventListener("touchstart", draw, false);
    canvas.addEventListener("touchmove", draw, false);
    canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
        state.drawings_arrays.push(drawing_array);
        drawing_array = [];
        lastPt=null;
    }, false);
}

function draw(e, res) {
    var x, y;
    if (res == 'move'){
        x = e.offsetX;
        y = e.offsetY;
    } else {
        x = e.touches[0].pageX - canvas.offsetLeft;
        y = e.touches[0].pageY - canvas.offsetTop + document.getElementById('canvas_content').scrollTop;
    }
    e.preventDefault();
    if(lastPt!=null) {
        ctx.beginPath();
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.lineTo(x, y);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    lastPt = {x : x, y : y};
    drawing_array.push(lastPt);
}

function findxy(res, e) {
    if (res == 'down') {
        e.preventDefault();

        lastPt = {x: e.offsetX, y: e.offsetY};
        drawing_array.push(lastPt);
        flag = true;
    }
    if (res == 'up') {
        flag = false;
        state.drawings_arrays.push(drawing_array);
        drawing_array = [];
    }
    if (res == 'out'){
        lastPt = null;
        flag = false;
        state.drawings_arrays.push(drawing_array);
        drawing_array = [];
    }
    if (res == 'move') {
        if (flag) {
            draw(e, res);
        }
    }
}

$(function(){
 
    $.ajax({url: './api/text', method: 'GET', success: function(data){
        state.txt = data.text;
        set_up_pages(state.txt, false);
        init_text();
    }, error: function(err){
        if (err.status == 500){
            alert("status: " + err.status + "\nmsg: Internal server error");
        } else {
            alert("status: " + err.status + "\nmsg: Unexpected error");   
        }
    }});

    canvas=document.getElementById("can");

    let style_height = getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.width = style_width;
    canvas.height = style_height;

    ctx=canvas.getContext("2d");
    ctx.font="60px Arial";
    let line_height = 120; 

    function set_up_pages(txt, syllables) {
        if (txt == state.txt) {
            state.txt_pages = [];
        }
        let words = txt.split(' ');
        let max_lines = Math.floor((style_height - (style_height % line_height))/line_height);
        let lines = [];
        let line = '';

        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            if (word == '\n') {
                if (syllables) {line = line.slice(0,-1);}
                lines.push(line);
                line = '';
                continue;
            }

            if (word == "") {continue;}
            if (syllables) { word = divide_text_to_syllables(word) + "  "; }

            let test_line = line + word + ' ';
            let test_width = ctx.measureText(test_line).width;
            if (test_width > canvas.width-70 && i > 0) {
                if (syllables) { line = line.slice(0, -3); }
                lines.push(line);
                line = word + ' ';
            } else {
                line = test_line;
            }

            if (lines.length == max_lines) {
                state.txt_pages.push(lines);
                lines = []
            }
        }
        if (line != "") { lines.push(line); }
        if (lines != []) { state.txt_pages.push(lines); }
    }

    function divide_text_to_syllables(text) {
        let text_result = '';
        let words = text.split(' '); 

        for(var n = 0; n < words.length; n++) {
            let word = words[n];
            let newword = '';

            if (word == '\n') {
                text_result += word + '   ';
                continue;
            }

            newword += word[0];
            for (var i = 1; i < word.length; i++){
                if (word[i] == 'ו' && (word[i+1] == 'ֹ' || word[i+1] == 'ּ')) {
                    if (newword[newword.length-1] == ' ') { newword = newword.slice(0,-1); }
                    newword += word[i] + word[i+1] + ' ';
                    i += 1;
                }
                else if (word[i] == 'ו' && (word[i-1] == 'ו' || word[i-2] == 'ו')){
                    newword = newword.slice(0,-1);
                    newword += word[i] + ' ';
                }
                else if (word[i] == 'י' && word[i-1] == 'ִ' && !in_scores(word[i+1]) && word[i+1] != 'ו'){
                    newword = newword.slice(0,-1);
                    newword += word[i] + ' ';
                }
                else {
                    if (in_scores(word[i+1])){
                        newword += word[i] + word[i+1];
                        if (in_scores(word[i+2])){
                            newword += word[i+2];
                            if (in_scores(word[i+3])){
                                newword += word[i+3];
                                i+=1;
                            }
                            i += 1
                        }
                        i += 1;
                        newword += ' ';
                    } else { newword += word[i] + ' '; }
                }
            }
            text_result += newword + '  ';
        }
        return text_result.slice(0, -3);
    }

    function in_scores(scr){
        for (var i= 0; i < scores.length; i++){
            if (scr == scores[i]) { return true; }
        }
        return false;
    } 

    function fill_text_with_syllables(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        set_up_pages(state.txt, true);
        let text = state.txt_pages[state.page_number];
        fill_text(text, 'black');
    }

    function fill_text_without_syllables(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        set_up_pages(state.txt, false);
        if(state.page_number > state.txt_pages.length) { state.page_number = state.txt_pages.length-1; }
        let text = state.txt_pages[state.page_number];
        fill_text(text, 'black');
    }

    function fill_text(text_arr, color) {
        ctx.fillStyle = color;
        let y = 80;
        for (let i = 0; i < text_arr.length; i++) {
            ctx.fillText(text_arr[i], canvas.width-40, y);
            y += line_height;
        }
    }

    function fill_text_with_exposure_mode(dirc) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let y = 80;
        let color = "rgb(192,192,192)";
        if (state.exposure.mode == 'white') { color = 'white'; }

        if (state.page_number == state.exposure.page_num) {
            let page = state.txt_pages[state.exposure.page_num];
            
            ctx.fillStyle = "black";
            if (state.exposure.mode == "window_move") {
                ctx.fillStyle = color;
            }

            for (let i = 0; i < page.length; i++) {

                if (i == state.exposure.line_num || (i == state.exposure.line_num-1 && state.exposure.mode == 'window_move' && state.exposure.word_num == 0 && state.exposure.syll_num == 0 && dirc == 'back')) {
                    let text = divide_text_to_syllables(page[i].slice(0, -1)).split('   ');
                    let x = canvas.width-40;

                    if (state.exposure.text_mode == "syllables") {
                        text = page[i].split('   ');
                        
                    }
                    
                    for (let j = 0; j < text.length; j++) {
                        
                        let syll_arr = text[j].split(' ');
                        while (syll_arr[syll_arr.length-1] == '') {syll_arr.pop();}
                       
                        if (j == state.exposure.word_num && dirc == 'back' && state.exposure.word_num == 0 && state.exposure.elem == 'word') { ctx.fillStyle = color; }

                        for (let k = 0; k < syll_arr.length; k++) {

                            if (state.exposure.elem == "syllable") {
                                if (j == state.exposure.word_num && k == state.exposure.syll_num) { 
                                    ctx.fillStyle = color;
                                } else if ((j == state.exposure.word_num && k == state.exposure.syll_num-1) || ( (j == state.exposure.word_num-1 || j == text.length-1 && i == state.exposure.line_num-1) && state.exposure.syll_num == 0 && k == syll_arr.length-1) && state.exposure.mode == "window_move") {
                                    ctx.fillStyle = "black";
                                }
                                // state.exposure.word_exposured = syll_arr; 
                            } else if (state.exposure.elem == 'word') {
                                if (state.exposure.mode == "window_move" && j == state.exposure.word_num-1 || (i == state.exposure.line_num-1 && dirc == 'back' && j == text.length-1) ) {
                                    ctx.fillStyle = "black";
                                }
                            }

                            let syll = syll_arr[k];
                            if (state.exposure.text_mode == "syllables") { 
                                syll += ' '; 
                            }
                            ctx.fillText(syll, x, y);
                            x -= ctx.measureText(syll).width;
                        }
                        x -= ctx.measureText(' ').width;
                        if (state.exposure.text_mode == "syllables") { x -= ctx.measureText(' ').width; }
                        // $("#p1").html(JSON.stringify({'word_num': state.exposure.word_num, 'line_num': state.exposure.line_num, 'page_num': state.exposure.page_num}));

                        if (state.exposure.elem == "word") {
                            if(j == state.exposure.word_num-1) {
                                state.exposure.word_exposured = syll_arr;
                                ctx.fillStyle = color;
                                state.exposure.syll_num = 0;
                                if (state.exposure.word_num == text.length) {
                                    state.exposure.line_num += 1;
                                    state.exposure.word_num = 0;
                                    if (state.exposure.line_num == state.txt_pages[state.exposure.page_num].length) {
                                        state.exposure.page_num += 1;
                                        state.page_number += 1;
                                        state.exposure.line_num = 0;
                                    }
                                }
                            }
                        } else if (state.exposure.elem == "syllable") {
                            if (j == state.exposure.word_num && state.exposure.syll_num == syll_arr.length) {
                                state.exposure.word_num += 1;
                                state.exposure.syll_num = 0;
                                if (state.exposure.word_num == text.length) {
                                    state.exposure.line_num += 1;
                                    state.exposure.word_num = 0;
                                    if (state.exposure.line_num == state.txt_pages[state.exposure.page_num].length) {
                                        state.exposure.page_num += 1;
                                        // state.page_number += 1;
                                        // $("#next_page").click();
                                        state.exposure.line_num = 0;
                                    }
                                }
                            }
                        }
                    }
                    y += line_height;
                } else {
                    if (i+1 > state.exposure.line_num) { ctx.fillStyle = color; }
                    ctx.fillText(page[i], canvas.width-40, y)
                    y += line_height;
                }
            }
        } else {
            if (state.page_number < state.exposure.page_num) {
                fill_text(state.txt_pages[state.page_number], 'black');
            } else if (state.page_number > state.exposure.page_num) {
                fill_text(state.txt_pages[state.page_number], color);
            }
        }
    }

    function restart_exposure() {
        let xps = state.exposure;
        // xps.mode = "gray";
        // xps.elem = "word";
        xps.page_num = 0;
        xps.line_num = 0;
        xps.word_num = 0;
        xps.syll_num = 0;
        $("#exposure_forth").removeAttr('disabled');
    }

    function init_text(){
        fill_text_without_syllables();
        $("#no_syllables").hide();

        $("#no_syllables").click(function(){
            $("#no_syllables").hide();
            $("#syllables").show();
            fill_text_without_syllables();
            if(state.page_number == state.txt_pages.length-1) { $("#next_page").attr('disabled', 'disabled'); }
            state.mode = "no_syllables";
        }); 
        $("#syllables").click(function(){
            $("#syllables").hide();
            $("#no_syllables").show();
            if (state.mode == "no_syllables") { $("#next_page").removeAttr('disabled'); }
            fill_text_with_syllables();
            state.mode = "syllables";
        });  
        $("#exposure_forth").click(function(){
            if (state.mode != 'exposure') { restart_exposure(); }

            if (state.exposure.elem == 'word') {
                state.exposure.word_num += 1;
            } else {
                state.exposure.syll_num += 1;
            }

            $("#exposure_back").removeAttr('disabled');
            if (state.exposure.page_num > 0) {$("#prev_page").removeAttr('disabled');} else {$("#prev_page").attr('disabled', 'disabled');}
            if (state.page_number != state.exposure.page_num) { state.page_number = state.exposure.page_num; }
            // $("#p1").html(JSON.stringify({'syll_num': state.exposure.syll_num, 'word_num': state.exposure.word_num, 'line_num': state.exposure.line_num, 'page_num': state.exposure.page_num}));

            fill_text_with_exposure_mode('forth');

            // $("#p1").html(JSON.stringify({'syll_num': state.exposure.syll_num, 'word_num': state.exposure.word_num, 'line_num': state.exposure.line_num, 'page_num': state.exposure.page_num}));
            state.mode = "exposure";
            if (state.exposure.syll_num == 0 && state.exposure.word_num == 0 && state.exposure.line_num == 0 && state.exposure.page_num == state.txt_pages.length) {$("#exposure_forth").attr('disabled', 'disabled');}
        });
        $("#exposure_back").click(function(){
            if (state.mode != 'exposure') { restart_exposure(); }
            $("#exposure_forth").removeAttr('disabled');

            if (state.exposure.elem == 'word') {
                if (state.exposure.word_num == 0 || (state.exposure.word_num == 1 && state.exposure.line_num == 0 && state.exposure.page_num > 0)) {
                    if (state.exposure.word_num == 1 && state.exposure.line_num == 0 && state.exposure.page_num > 0) {state.exposure.word_num=1;} else {state.exposure.word_num=0;}
                    state.exposure.line_num -= 1;
                    if (state.exposure.line_num == -1 ) {
                        state.exposure.page_num -= 1;
                        state.page_number = state.exposure.page_num;
                        state.exposure.line_num = state.txt_pages[state.exposure.page_num].length-1;
                    }
                    if (state.exposure.text_mode != "syllables") { state.exposure.word_num  += state.txt_pages[state.exposure.page_num][state.exposure.line_num].slice(0, -1).split(' ').length-1; } else {state.exposure.word_num  += state.txt_pages[state.exposure.page_num][state.exposure.line_num].slice(0, -1).split('   ').length-1;}
                } else { state.exposure.word_num -= 1; }
            } else {
                if (state.exposure.syll_num == 0 || (state.exposure.syll_num == 1 && state.exposure.word_num == 0 && state.exposure.line_num == 0 && state.exposure.page_num > 0)) {
                    if (state.exposure.syll_num == 1 && state.exposure.word_num == 0 && state.exposure.line_num == 0 && state.exposure.page_num > 0) {state.exposure.syll_num=1;} else {state.exposure.syll_num=0}
                    if (state.exposure.word_num == 0) {
                        state.exposure.line_num -= 1;
                        if (state.exposure.line_num == -1 ){
                            state.exposure.page_num -= 1;
                            state.page_number = state.exposure.page_num;
                            state.exposure.line_num = state.txt_pages[state.exposure.page_num].length-1;
                        }
                        if (state.exposure.text_mode != "syllables") { state.exposure.word_num  = state.txt_pages[state.exposure.page_num][state.exposure.line_num].slice(0, -1).split(' ').length-1; } else {state.exposure.word_num = state.txt_pages[state.exposure.page_num][state.exposure.line_num].slice(0, -1).split('   ').length-1;}
                    } else { state.exposure.word_num -= 1; }
                    let prev_word;
                    if (state.exposure.text_mode != 'syllables') { 
                        prev_word = state.txt_pages[state.exposure.page_num][state.exposure.line_num].slice(0,-1).split(' '); 
                        state.exposure.syll_num += divide_text_to_syllables(prev_word[state.exposure.word_num]).split(' ').length-1;
                    } else { 
                        prev_word = state.txt_pages[state.exposure.page_num][state.exposure.line_num].split('   '); 
                        prev_word = prev_word[state.exposure.word_num].split(' ');
                        while (prev_word[prev_word.length-1] == '') {prev_word.pop();}
                        state.exposure.syll_num += prev_word.length-1;
                    }
                    if (state.exposure.syll_num == 1 && state.exposure.word_num == 0 && state.exposure.line_num == 0 && state.exposure.page_num > 0) {$("#prev_page").click();}
                } else { state.exposure.syll_num -= 1; }
            }

            if (state.page_number != state.exposure.page_num) { state.page_number = state.exposure.page_num; }
            if (state.exposure.page_num == 0) {$("#prev_page").attr('disabled', 'disabled');}
            // $("#p1").html(JSON.stringify({'syll_num': state.exposure.syll_num, 'word_num': state.exposure.word_num, 'line_num': state.exposure.line_num, 'page_num': state.exposure.page_num}));

            fill_text_with_exposure_mode('back');
            // $("#p1").html(JSON.stringify({'syll_num': state.exposure.syll_num, 'word_num': state.exposure.word_num, 'line_num': state.exposure.line_num, 'page_num': state.exposure.page_num}));

            state.mode = "exposure";
            if (state.exposure.page_num == 0 && state.exposure.line_num == 0 && state.exposure.word_num == 0 && state.exposure.syll_num == 0) { $("#exposure_back").attr('disabled', 'disabled'); }
        }); 
        $("#back_to_top").click(function(){
            restart_exposure();
            $("#exposure_forth").click();
        }); 
        $("#hide_show_scores").click(function(){
            if (state.scored == true) {
                state.scored = false;
            } else { state.scored = true; }
        });   

        $("#prev_page").click(function(){
            state.page_number -= 1;
            if (state.page_number == 0) { $("#prev_page").attr('disabled', 'disabled'); }
            $("#next_page").removeAttr('disabled');
            if (state.mode == "exposure") {
                fill_text_with_exposure_mode('forth');
            } else {
                $("#"+state.mode).click();
            }
        });
        $("#next_page").click(function(){
            state.page_number += 1;
            if (state.page_number == state.txt_pages.length-1) { $("#next_page").attr('disabled', 'disabled'); }
            $("#prev_page").removeAttr('disabled');
            if (state.mode == "exposure") {
                fill_text_with_exposure_mode('forth');
            } else {
                $("#"+state.mode).click();
            }
        });

        $('.elem a.dropdown-item').on('click', function(){
            state.exposure.elem = $(this).attr('id');
        });
        $('.mode a.dropdown-item').on('click', function(){
            state.exposure.mode = $(this).attr('id');
        });
        $('.text a.dropdown-item').on('click', function(){
            state.exposure.text_mode = $(this).attr('id');
            if (state.exposure.text_mode == "syllables") {
                set_up_pages(state.txt, true);
            } else { set_up_pages(state.txt, false); }
            state.page_number = 0;
            restart_exposure();
            $("#exposure_forth").click();
        });
    }      
});

</script>
<body onload="init()" dir="rtl">
	<?php write_nav_bar() ?>
    
    <div align="center">
        <button class="btn btn-primary" id="no_syllables">בלי חלוקה להברות</button>
        <button class="btn btn-primary" id="syllables">עם חלוקה להברות</button>
        
        <div class="dropdown show" style="display: inline">
            <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                מצב חשיפה
            </a>
          
            <div class="dropdown-menu mode" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" id="gray">אפור</a>
              <a class="dropdown-item" id="white">לבן</a>
              <a class="dropdown-item" id="window_move">חלון זז</a>
            </div>
        </div>
    
        <div class="dropdown show" style="display: inline">
            <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                אלמנט החשיפה
            </a>
          
            <div class="dropdown-menu elem" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" id="word">מילה</a>
              <a class="dropdown-item" id="syllable">הברה</a>
            </div>
        </div>

        <div class="dropdown show" style="display: inline">
            <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                צורת הצגת הטקסט
            </a>
          
            <div class="dropdown-menu text" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" id="no_syllables">לא מחולק להברות</a>
              <a class="dropdown-item" id="syllables">מחולק להברות</a>
            </div>
        </div>
    </div>
        
    <p id="p1"></p>

    <div id="canvas_content">
        <canvas id="can"></canvas>
    </div>

    <div align="center">
        <button class="btn btn-primary" id="exposure_back" disabled>אחורה</button>
        <button class="btn btn-primary" id="exposure_forth">קדימה</button>
        <button class="btn btn-primary" id="back_to_top">חזרה לתחילת הטקסט</button>
        <button class="btn btn-primary" id="prev_page" disabled><i class="fas fa-angle-right"></i> לדף הקודם</button>
        <button class="btn btn-primary" id="next_page">לדף הבא <i class="fas fa-angle-left"></i></button>
        <!-- <button class="btn btn-primary" id="hide_show_scores">הסתר/הצג ניקוד</button> -->
    </div>
    
</body>
</html>