/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    initApp();
});




var initApp = function () {
    
  document.getElementById('placecert').onchange = function() {
  var inoe = document.querySelector('.depend');
  inoe.style.display = ((this.value) == 15 ? 'block' : 'none');
};
    $('#send').on('click', function () {
        if($('#gradebook').val() == "") {
            alert("Введите номер зачетной книжки!");
            return;
        } 
         if($('#kol').val() == "") {
            alert("Введите количество экземпляров!");
            return;
        } 
        if ('.depend.display' == 'block'){
        if($('#niudata').val() == "") {
            alert("Введите наименование организации!");
            return;
         }  
      alert("Заявка успешно отправлена!");
        $('#gradebook').val("");
        $('#kol').val("");
        $('#niudata').val("");
        } 
        alert("Заявка успешно отправлена!");
        $('#gradebook').val("");
        $('#kol').val("");
    });
};