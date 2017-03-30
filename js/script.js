Array.prototype.removeValue = function(name, value){
  var array = $.map(this, function(v, i){
    return v[name] === value ? null : v;
  });
  this.length = 0;
  this.push.apply(this, array);
  console.log(array);
};

function load_table(){
  $.ajax({
    type: 'GET',
    url: "http://localhost:3000/posts",
    success: function(result){

      document.getElementById("loader").style.display = "block";

      var table_html = "<table id='posts_table' class='table sortable'>" +
        "<thead><tr><th data-defaultsort='asc'>Title</th><th>Body</th><th>Date</th><th colspan='2'></th></tr>" +
        "</thead><tbody>";

      $.each(result, function(){
        table_html +=
          "<tr id='"+this.id+"'><td>" + this.title + "</td>" +
          "<td>" + this.body + "</td>" +
          "<td>" + $.datepicker.formatDate('MM dd, yy', new Date(this.date)) + ' at ' + new Date(this.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).toUpperCase() + "</td>" +
          "<td><button class='btn_edit btn btn-primary'><i class='material-icons'>create</i></button></td>"+
          "<td><button class='btn_delete btn btn-danger'><i class='material-icons'>delete</i></button></td></tr>";
      });

      table_html += "</tbody></table>";
      $("#posts").html(table_html);

      var edit_btns = document.getElementsByClassName('btn_edit');
      var delete_btns = document.getElementsByClassName('btn_delete');

      $("#submit").click(function(){
        document.getElementById("title_err").style.display = 'none';
        document.getElementById("body_err").style.display = 'none';

        var post = {
          "title": $("#title").val(),
          "body": $("#body").val(),
          "date": new Date().toLocaleString()
        };

        if($("#title").val() === "" && $("#body").val() === ""){
          document.getElementById("title_err").style.display = 'block';
          document.getElementById("body_err").style.display = 'block';
        }else if($("#body").val() === ""){
          document.getElementById("body_err").style.display = 'block';
        }else if($("#title").val() === ""){
          document.getElementById("title_err").style.display = 'block';
        }else{
          if(!$('#active_post').val()){
            new_post(post);
          }else{
            update_post($('#active_post').val(), post);
          }

          $("#title").val("");
          $("#body").val("");
          $('#active_post').val("");
        }
      });

      $("#clear_active_post").click(function(){
        deselect_row($('#active_post').val());
        $('#active_post').val("");
        $("#title").val("");
        $("#body").val("");
      });

      for(var i = 0; i < edit_btns.length; i++){
        edit_btns[i].onclick = function(){
          if($('#active_post').val() !== ""){
            deselect_row($('#active_post').val());
          }
          select_row(this.parentNode.parentNode.id);
          console.log(this.parentNode.parentNode.id);
          $('#active_post').val(this.parentNode.parentNode.id);
          selectPost(this.parentNode.parentNode.id);
        };
      }

      for(var j = 0; j < delete_btns.length; j++){
        delete_btns[j].onclick = function(){

          var post_id = this.parentNode.parentNode.id;
          $('<div></div>').appendTo('body')
                  .html('<div><h6>Are you sure?</h6></div>')
                  .dialog({
                      modal: true,
                      title: 'Delete message',
                      zIndex: 10000,
                      autoOpen: true,
                      width: 'auto',
                      resizable: false,
                      buttons: {
                          Yes: function () {
                              delete_post(post_id);
                              $(this).dialog("close");
                          },
                          No: function () {
                              $(this).dialog("close");
                          }
                      },
                      close: function (event, ui) {
                          $(this).remove();
                      }
                  });
        };
      }

      setTimeout(function(){
        document.getElementById("loader").style.display = "none";
      }, 300);


      $.bootstrapSortable(true);
    },
    error: function(err){
      alert("Something went wrong :(");
    }
  });
}

$(document).ready(function(){
  load_table();
});

function delete_post(id){
  $.ajax({
    type: 'DELETE',
    url: "http://localhost:3000/posts/"+id,
    success: function(){
      alert("Successfully Deleted");
      location.reload();
    },
    error: function(){
      alert("Something went wrong :(");
    }
  });
}

function update_post(id, data){
  $.ajax({
    type: 'PUT',
    url: "http://localhost:3000/posts/"+id,
    data: data,
    success: function(){
      location.reload();
    },
    error: function(){
      alert("Something went wrong :(");
    }
  });
}

function new_post(data){
  $.ajax({
    type: 'POST',
    url: "http://localhost:3000/posts",
    data: data,
    success: function(){
      location.reload();
    },
    error: function(){
      alert("Something went wrong :(");
    }
  });
}

function selectPost(id){

  $.ajax({
    type: 'GET',
    url: "http://localhost:3000/posts/"+id,
  }).done(function(data) {
    document.getElementById("loader").style.display = "block";
    $('#active_post').val(data.id);
    $("#title").val(data.title);
    $("#body").val(data.body);
    document.getElementById("loader").style.display = "none";
  })
  .fail(function(xhr) {
    console.log('error', xhr);
  });
}

function select_row(id){
  $('#'+id).animate({
    backgroundColor: "#6FABF7"
  }, 300);
}

function deselect_row(id){
  $('#'+id).animate({
    backgroundColor: "white"
  }, 300);
}
