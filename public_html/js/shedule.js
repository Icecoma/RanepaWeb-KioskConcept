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

var __SELECTED_ID = 0;
var __SELECTED_TYPE = -1;

var clear = function () {
    __SELECTED_ID = 0;
    __SELECTED_TYPE = -1;
    $('#teacher_or_group_name').val("");
    
}

var initKeyboard = function () {
    $('#keyboard').jkeyboard({
        layout: "russian",
        input: $('#teacher_or_group_name'),
    });    
    
    $("#teacher_or_group_name").focus(function() {
        $('#keyboard').show();
    });
    $('#date_start').on('click', function () {
        $('#keyboard').hide();
    });
    $('#date_end').on('click', function () {
        $('#keyboard').hide();
    });
}

var initApp = function () {
    var dataList = null;
    $('#teacher_or_group_name').on('keyup', function () {
        var field = $(this);
        if(dataList === null) {
            if(field.val().length > 4) {
                $.ajax({
                    url: 'http://services.niu.ranepa.ru/API/public/teacher/teachersAndGroupsList',
                    method: 'get',
                    success: function (data) {
                        dataList = data;                       
                        createTeacherList(dataList, field.val());
                    }
                });
            }
        }
        else {
            if(field.val().length > 4) {
                createTeacherList(dataList, field.val());
            } 
            else {
                $('#found').empty();
                $('#found').hide();
            }
        }
    }); 
    $('#clear_teacher').on('click', function () {
           clear();
    });
    $('#search').on('click', function () {
        $('#keyboard').hide();
        if($('#date_start').val() == "") {
            alert("Введите начало периода");
            return ;
        }
        if($('#date_end').val() == "") {
            alert("Введите конец периода");
            return ;
        }
        if(__SELECTED_ID == 0) {
            alert("Выберите преподавателя или группу!");
            return ;
        }
        var url = "";
        var dateStart = new Date($('#date_start').val());
        var dateEnd = new Date($('#date_end').val());
        if(__SELECTED_TYPE == 1) {
            url = 'http://services.niu.ranepa.ru/API/public/teacher/getSchedule?id=' + __SELECTED_ID + '&dateBegin=' + format(dateStart, 'dd.MM.yyyy') + '&dateEnd=' + format(dateEnd, 'dd.MM.yyyy')
        } else if(__SELECTED_TYPE == 0) {
            url = 'http://services.niu.ranepa.ru/API/public/group/getSchedule?id=' + __SELECTED_ID + '&dateBegin=' + format(dateStart, 'dd.MM.yyyy') + '&dateEnd=' + format(dateEnd, 'dd.MM.yyyy')
        } else {
            return;
        }
        $.ajax({
            url: url,
            method: 'post',
            success: function (data) {
                prepareSheduleList(data);
            }
        });
    });
};

var createTeacherList = function (data, val) {
    $('#found').empty();
    $('#found').show();
    for(var i = 0; i < data.length; i++) {
        if(data[i]['value'].toLowerCase().indexOf(val.toLowerCase()) != -1) {
            createTeacherItem(data[i]);
        }
    }
};

var createTeacherItem = function (item) {
    var row = document.createElement('tr');
    $(row).on('click', function () {
        $('#teacher_or_group_name').val(item.value);
        __SELECTED_ID = item.oid;
        __SELECTED_TYPE = item.type;
        $('#found').empty();
        $('#found').hide();
    })
    if(item.type == 0)
        $(row).append('<td width="50px"><i class="material-icons mdl-list__item-avatar">group</i></td><td class="mdl-data-table__cell--non-numeric" style="text-align: left">' + item.value + '</td>');
    if(item.type == 1)
        $(row).append('<td width="50px"><i class="material-icons mdl-list__item-avatar">person</i></td><td class="mdl-data-table__cell--non-numeric" style="text-align: left">' + item.value + '</td>');
    $('#found').append(row);
}


var prepareSheduleList = function (data) {
    $('#found').empty();
    $('#found').show();
    
    var dateGroup = {};
    
    for(var i = 0; i < data.length; i++) {
        if(typeof(dateGroup[data[i].xdt]) === 'undefined') {
            dateGroup[data[i].xdt] = [];
        }
        dateGroup[data[i].xdt].push(data[i]);
    }
    createSheduleList(dateGroup);
}

var createSheduleList = function (data) {
    var row = document.createElement('tr');
    if(__SELECTED_TYPE == 1) {
        $(row).append('<th >№ п/п</th><th >Время начала</th><th >Время окончания</th>' +
                '<th style="text-align: left; width: 290px !important;">Предмет</th><th style="text-align: center;">Аудитория</th><th style="text-align: center;">Группа</th>');    
    }
    if(__SELECTED_TYPE == 0) {
        $(row).append('<th >№ п/п</th><th >Время начала</th><th >Время окончания</th>' +
                '<th style="text-align: left; width: 290px !important;">Предмет</th><th style="text-align: left;">Преподаватель</th><th style="text-align: center;">Аудитория</th>'); 
    }
    $('#found').append(row);
    for(k in data)
        createSheduleItem(data[k], k);
}

var createSheduleItem = function (item, dateString) {
    var row = document.createElement('tr');
    
    var date = new Date(dateString);
    
    $(row).append('<td colspan="6" style="text-align: center; font-weight: bold">' + format(date, 'dd.MM.yyyy') + '</td>');    
    $('#found').append(row);
    for(var i = 0; i < item.length; i++) {
        var row = document.createElement('tr');
        if(__SELECTED_TYPE == 1) {
            $(row).append('<td style="text-align: center;">' + (i+1) + '</td><td  style="text-align: center;">' + item[i].nf + '</td><td  style="text-align: center;">' + item[i].kf + '</td><td  style="text-align: left;"><div style="width: 250px !important; white-space: normal">' +
                    item[i].subject + ' (' + item[i].type + ')</div></td><td  style="text-align: center;">' + item[i].number + '</td><td  style="text-align: center;">' + item[i].group + '</td>');    
        }
        if(__SELECTED_TYPE == 0) {
            $(row).append('<td style="text-align: center;">' + (i+1) + '</td><td  style="text-align: center;">' + item[i].nf + '</td><td  style="text-align: center;">' + item[i].kf + '</td><td  style="text-align: left;"><div style="width: 250px !important; white-space: normal">' +
                    item[i].subject + ' (' + item[i].type + ')</div></td><td  style="text-align: center;">' + item[i].teacher + '</td><td  style="text-align: center;">' + item[i].number + '</td>'); 
        }
        
        $('#found').append(row);
    }
    
};

                

var format = function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}