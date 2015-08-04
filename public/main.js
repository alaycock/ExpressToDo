var todoItems = [];

$(document).ready(function() {
  $("#addItem").click(createNewItem);
  getAllItems();

});

function getAllItems() {
  startLoadingIcon();
  $.get( "/todo", function(data) {
    todoItems = data;
    refreshTodo();
    stopLoadingIcon();
  });
}

function deleteItem(input) {

  var delId = $(this).parent().attr('id');
  startLoadingIcon();

  $.ajax({
    url: '/todo/' + delId,
    type: 'DELETE',
    success: function(result) {
      for(var i = 0; i < todoItems.length; i++) {
        if(todoItems[i].id == delId) {
          todoItems.splice(i, 1);
          break;
        }
      }
      refreshTodo();
      stopLoadingIcon();
    }
  });
}

function toggleCompleteItem() {
  var checkedId = $(this).parent().attr('id');

  var index = -1;
  for(var i = 0; i < todoItems.length; i++) {
    if(todoItems[i].id == checkedId) {
      index = i;
      break;
    }
  }

  var isChecked = $(this).is(":checked");

  var clonedObject = $.extend(true, {}, todoItems[index]);
  clonedObject.data.complete = String(isChecked);

  startLoadingIcon();
  updateItem(clonedObject, function(result) {
    todoItems[index].data.complete = String(isChecked);
    refreshTodo();
    stopLoadingIcon();
  }, function(error) {
    errorMessage();
    stopLoadingIcon();
  });
}

function updateItem(item, onSuccess, onError) {
  console.log(item.data);
  $.ajax({
    url: '/todo/' + item.id,
    type: 'PUT',
    data: item.data,
    success: function(result) {
      if(result.error)
        onError(result.error);
      else
        onSuccess(result);
    },
    error: function(result, status, error) {
      onError(error);
    }
  });
}

function createNewItem() {

  startLoadingIcon();

  var newData = {
    order: todoItems.length,
    text: $("#addText").val(),
    color: "#FFFFFF",
    complete: "false"
  };

  $.post( "/todo", newData)
  .done(function( response ) {
    if(response.error) {
      errorMessage();
      return;
    }

    var newItem = {
      id: response.id,
      data: newData
    };

    todoItems.push(newItem);
    refreshTodo();
    $("#addText").val("");

    stopLoadingIcon();
  })
  .fail(function(error) {
    errorMessage();
  });
}

function refreshTodo() {
  var container = $('#todo-content').empty();
  $.each(todoItems, function(key, item){
    $('#todo-content').append(buildNewItem(item));
  });
  bindEvents();
}

function bindEvents() {
  $(".deleteItem").click(deleteItem);
  $(".completeCheckbox").click(toggleCompleteItem);
}

function buildNewItem(item) {
  console.log(item);
  var row = $('<li>').attr("id", item.id);
  var checkbox = $('<input type="checkbox">').addClass('completeCheckbox');
  if(item.data.complete.toLowerCase() == 'true') {
    row.addClass('complete');
    checkbox.attr('checked', true);
  }

  return row.html(checkbox.prop('outerHTML') + item.data.text +
    '<i class="fa fa-times deleteItem"></i>');
}

function startLoadingIcon() {
  $('#title').html('To Do <i class="fa fa-circle-o-notch fa-spin"></i>');
}

function stopLoadingIcon() {
  $('#title').html('To Do');
}

function errorMessage() {
  alert("Oops, something went wrong, check your internet connection and try again.");
}
