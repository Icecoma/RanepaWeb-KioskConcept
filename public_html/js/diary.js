/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    clear()
    initApp();
    initKeyboard();
});

var clear = function () {
    $('#gradebook').val("");
    $('#found').empty();
    $('#found').show();
    
}

var initApp = function () {
    $('#clear_gradebook').on('click', function () {
           clear();
    });
    
    $('#search').on('click', function () {
        if($('#gradebook').val() == "") {
            alert("Введите номер зачетной книжки!");
            return ;
        }
        $.ajax({
            url: 'http://services.niu.ranepa.ru/API/public/student/getDiary?recBook=' + $('#gradebook').val(),
            method: 'post',
            success: function (data) {
                createDiaryList(data);
            }
        });
    });
    
};

var createDiaryList = function (data) {
    $('#found').empty();
    $('#found').show();
    
    var row = document.createElement('tr');
    $(row).append('<th>Курс</th><th >Предмет</th><th >Тип</th><th>Оценка</th>');    
    $('#found').append(row);
    
    for(k in data) {
        createDiaryItem(data[k]);
    }
};

var createDiaryItem = function (item) {
    var row = document.createElement('tr');
    $(row).append('<td>' + item.course + '</td><td>' + item.subject + '</td><td>' + item.type + '</td><td>' + item.mark + '</td>');
    $('#found').append(row);
}


var initKeyboard = function () {
    $('#keyboard').jkeyboard({
        layout: "russian",
        input: $('#gradebook'),
    });    
}