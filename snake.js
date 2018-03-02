$(document).ready(function() {
    var main_table = $('table#snake_table_main');

// рвзмер поля
    var count_tr = 20; // количество строк
    var count_td = 15; // количество столбцов

    var snake_speed = 150; //скорость в милисек
    var step = true;
    var div_score = $('div#snake_score');
    var div_minutes = $('span#snake_minutes');
    var div_seconds = $('span#snake_seconds');

    var direction = 'up';
    var target;


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function find(array, value) {
        if (array.indexOf) { // если метод существует
            return array.indexOf(value);
        }

        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) return i;
        }

        return -1;
    }


    for (var i = 0; i < count_tr; i++) {
        var new_tr = document.createElement('tr');
        for (var j = 0; j < count_td; j++) {
            var new_td = document.createElement('td');
            new_tr.appendChild(new_td);
        }
        $(new_tr).appendTo(main_table);
    }

    var all_td_main_table = main_table.find('td');

    var new_length_snake = 3
    var first_first_tr = Math.round(count_tr * count_td * 0.8) + Math.round(count_td / 2) - 1;
    var first_end_tr = first_first_tr + count_td * (new_length_snake - 1)

    var arr_snake = [first_first_tr]
    for (var i = 1; i < new_length_snake; i++) {
        var next_cell_body = arr_snake[0] + count_td * i
        arr_snake.push(next_cell_body);
    }


    function arrToTd() {
        for (var i = 0; i < arr_snake.length; i++) {
            all_td_main_table.eq(arr_snake[i]).addClass('snake_td');
        }
    }

    arrToTd()

    function nextTdHead(num_td_head) {
        var next_td;
        if (direction === 'up') {
            next_td = num_td_head - count_td;
            if (next_td < 0) {
                next_td = num_td_head + count_td * (count_tr - 1);
            }
        } else if (direction === 'left') {
            next_td = num_td_head - 1;
            if ((next_td + 1) % count_td === 0 || next_td < 0) {
                next_td = num_td_head + count_td - 1
            }
        } else if (direction === 'right') {
            next_td = num_td_head + 1;
            if (next_td % count_td === 0 || next_td >= all_td_main_table.length) {
                next_td = num_td_head - count_td + 1
            }
        } else if (direction === 'down') {
            next_td = num_td_head + count_td;
            if (next_td >= all_td_main_table.length) {
                next_td = num_td_head - count_td * (count_tr - 1);
            }
        }
        return next_td;
    }


    function set_target() {
        var allTdExceptSnake = []
        for (var i = 0; i < all_td_main_table.length; i++) {
            if (find(arr_snake, i) === -1) {
                allTdExceptSnake.push(i);
            }
        }
        var num_target = getRandomInt(0, allTdExceptSnake.length);
        all_td_main_table.eq(allTdExceptSnake[num_target]).addClass('bonus')
        target = allTdExceptSnake[num_target];
        return allTdExceptSnake[num_target]
    }

    set_target();

    function oneStep() {
        var next_td_head = nextTdHead(arr_snake[0]);

        if (next_td_head !== target) {
            var end_td = arr_snake.pop();
            all_td_main_table.eq(end_td).removeClass('snake_td');
        } else {
            all_td_main_table.eq(next_td_head).removeClass('bonus');
            textPlusOne(div_score);
            set_target();
        }
        all_td_main_table.eq(next_td_head).addClass('snake_td');

        if (find(arr_snake, next_td_head) === -1) {
            arr_snake.unshift(next_td_head);
            step = true;
            window.setTimeout(function () {
                oneStep();
            }, snake_speed);
        } else {
            window.clearInterval(timer_time);
        }
    }

    $('body').on('keydown', function (e) {
        if (step) {
            if (e.keyCode == 38) {
                if (direction !== 'down') {
                    direction = 'up';
                    step = false;
                }
            } else if (e.keyCode == 40) {
                if (direction !== 'up') {
                    direction = 'down';
                    step = false;
                }
            } else if (e.keyCode == 37) {
                if (direction !== 'right') {
                    direction = 'left';
                    step = false;
                }
            } else if (e.keyCode == 39) {
                if (direction !== 'left') {
                    direction = 'right';
                    step = false;
                }
            }
        }
    })

    oneStep()

    function textPlusOne(obj) {
        obj.text(Number(obj.text()) + 1);
    }

    var timer_time = window.setInterval(function () {
        var num_seconds = Number(div_seconds.text()) + 1;
        var num_minutes = Number(div_minutes.text());
        if (num_seconds < 10) {
            num_seconds = '0' + num_seconds;
        } else if (num_seconds > 59) {
            num_seconds = '00';
            num_minutes++;
        }

        if (num_minutes < 10) {
            num_minutes = '0' + num_minutes;
        }

        div_seconds.text(num_seconds);
        div_minutes.text(num_minutes);


    }, 1000);

});
