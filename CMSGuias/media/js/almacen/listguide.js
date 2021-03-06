// Generated by CoffeeScript 1.12.5
var show_annular, view;

$(document).ready(function() {
  var searchGuide;
  $('input[name=dates]').datepicker({
    showAnim: 'slide',
    dateFormat: 'yy-mm-dd'
  });
  $('.btn-show-gv').click(function(event) {
    event.preventDefault();
    $('.btn-gv').val(this.value);
    $('.mview').modal('show');
  });
  $('.btn-gv').click(function(event) {
    var host, ruc, url;
    event.preventDefault();
    host = $("#hreport").val();
    ruc = $("#ruc").val();
    url = host + "guide/remission/materials?idguide=" + this.value + "&ruc" + ruc;
    window.open(url, '_blank');
  });
  $('input[name=search]').change(function() {
    $('input[name=search]').each(function() {
      if (this.checked) {
        $("input[name=" + this.value + "]").attr('disabled', false);
      } else {
        $("input[name=" + this.value + "]").attr('disabled', true);
      }
    });
  });
  $('.btn-search').click(function(event) {
    event.preventDefault();
    searchGuide();
  });
  searchGuide = function() {
    var data, input;
    input = null;
    data = {};
    $("input[name=search]").each(function() {
      if (this.checked) {
        input = this.value;
      }
    });
    if (input !== null) {
      data['tra'] = input;
      $("input[name=" + input + "]").each(function() {
        data[this.id] = $.trim(this.value) === '' ? '' : this.value;
      });
      $.getJSON('', data, function(response) {
        var $tb, i, temp;
        if (response.status) {
          $tb = $('tbody');
          temp = "<tr class='success tr{{guia_id}}'>\n<td class='text-center'>{{item}}</td>\n<td class='text-center'>{{guia_id}}</td>\n<td>{{nompro}}</td>\n<td>{{traslado}}</td>\n<td>{{connom}}</td>\n<td class='text-center'>\n  <button class='btn btn-link btn-sm text-black btn-show-gv' onClick='view(this);' value='{{guia_id}}'>\n    <span class='glyphicon glyphicon-paperclip'></span>\n  </button></td><td class=\"text-center\">\n  <a class=\"btn btn-link btn-sm text-black\" href=\"/almacen/guide/edit/{{guia_id}}/\">\n    <i class=\"fa fa-pencil\"></i>\n  </a>\n</td>\n<td class='text-center'>\n  <button class='btn btn-link btn-sm text-black'  onclick='show_annular(this);' value='{{guia_id}}'>\n    <span class='glyphicon glyphicon-fire'></span>\n  </button>\n</td></tr>";
          $tb.empty();
          for (i in response.list) {
            $tb.append(Mustache.render(temp, response.list[i]));
          }
          if (!response.list.length) {
            sweetAlert({
              title: "No se han encontrado datos!",
              text: "",
              type: "warning",
              timer: 2000
            });
          }
        } else {
          sweetAlert({
            title: "No se han encontrado datos!",
            text: "",
            type: "error",
            timer: 2000
          });
          return;
        }
      });
    } else {
      $().toastmessage('showWarningToast', 'Los campos se encuentrán vacios.');
    }
  };
  $('.btn-annular').click(function(event) {
    var $btn, data, val;
    $btn = $(this);
    $btn.attr("disabled", true);
    val = $('.series').html().trim();
    if (val !== "") {
      data = {
        'series': val,
        'observation': $("[name=obser]").val(),
        'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
      };
      $.post('', data, (function(response) {
        if (response.status) {
          $('.mannular').modal('hide');
          $().toastmessage('showNoticeToast', "Se a anulado la Guía de Remisión " + val + " correctamente.");
          $btn.attr("disabled", false);
          setTimeout((function() {
            location.reload();
          }), 2600);
        }
      }), 'json');
    } else {
      $().toastmessage('showWarningToast', 'No se puede anular la Guía de Remisión.');
    }
  });
});

view = function(tag) {
  $('.btn-gv').val(tag.value);
  $('.mview').modal('show');
};

show_annular = function(obj) {
  $('.series').html(obj.value);
  $('.mannular').modal('show');
};
