var changeChk, resgisterMaterial, selectedChk, validregisterOld;

$(document).ready(function() {
  $(document).on("change", "input[type=radio]", selectedChk);
  $(document).on("change", "input[type=checkbox]", changeChk);
  $(document).on("click", "button", resgisterMaterial);
  setTimeout(function() {
    validregisterOld();
  }, 600);
  $("table.table-float").floatThead({
    useAbsolutePositioning: false,
    scrollingTop: 50
  });
});

resgisterMaterial = function(event) {
  var arr, counter, data, name;
  event.preventDefault();
  name = this.name.substr(3);
  counter = 0;
  arr = new Array();
  $("[name=chk" + name + "]").each(function() {
    if (this.checked && !$(this).is(":disabled")) {
      counter += 1;
      arr.push({
        oid: this.getAttribute("data-orders"),
        mid: this.getAttribute("data-mat"),
        brand: this.getAttribute("data-brand"),
        model: this.getAttribute("data-model"),
        cant: parseFloat(this.value)
      });
    }
  });
  if (counter > 0) {
    data = new Object();
    data.csrfmiddlewaretoken = $("input[name=csrfmiddlewaretoken]").val();
    data.mats = JSON.stringify(arr);
    data.addori = "PE";
    $.post("", data, function(response) {
      var i;
      if (response.status) {
        for (i in arr) {
          $("[name=chk" + arr[i].oid + "]").attr("disabled", "disabled");
        }
      }
    }, "json");
  } else {
    $().toastmessage("showWarningToast", "No se han seleccionado materiales.");
    return;
  }
};

changeChk = function(event) {
  var $chk, chk, name;
  event.preventDefault();
  name = this.name.substr(3);
  $chk = $("[name=chk" + name + "]");
  chk = 0;
  $("[name=rdo" + name + "]").each(function() {
    if (this.value === "") {
      this.checked = true;
    } else {
      $("[name=btn" + name + "]").attr("disabled", false);
    }
  });
  $chk.each(function() {
    if (this.checked) {
      chk += 1;
    }
  });
  $("[name=btn" + name + "]").attr("disabled", (chk === 0 ? true : false));
};

selectedChk = function(event) {
  var name, value;
  event.preventDefault();
  name = this.name.substr(3);
  value = Boolean(this.value);
  $("input[name=chk" + name + "]").each(function() {
    if ($(this).is(":disabled")) {
      return true;
    }
    this.checked = value;
  });
  $("button[name=btn" + name + "]").attr("disabled", !value);
};

validregisterOld = function() {
  $("button").each(function() {
    var $chkt, chk, name;
    name = this.name.substr(3);
    chk = 0;
    $chkt = $("input[name=chk" + name + "]");
    console.log(name);
    $chkt.each(function() {
      if (this.checked) {
        chk += 1;
      }
    });
    console.log(chk);
    if (chk === 1) {
      return true;
    } else if (chk > 1 && chk < $chkt.length || chk === $chkt.length) {
      $("[name=rdo" + name + "]").attr("disabled", "disabled");
      $("[name=btn" + name + "]").attr("disabled", "disabled");
    }
    if (chk > 1 && chk < $chkt.length) {
      $("[name=rdo" + name + "]").attr("disabled", false);
    }
  });
};
