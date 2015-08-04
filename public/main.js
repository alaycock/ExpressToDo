var todoItems = [];

// Setup
$(document).ready(function() {
  // Click the plus, or press enter to submit,
  $("#addItem").click(createNewItem);
  $("#addText").keyup(function(event){
    if(event.keyCode == 13){
      $("#addItem").click();
    }
  });
  getAllItems();
});

// Get all items and render them
function getAllItems() {
  startLoadingIcon();
  $.get( "/todo", function(data) {
    todoItems = data;
    refreshTodo();
    stopLoadingIcon();
  });
}

// Delete an item from the DB, then rerender
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

  var index = getItemIndexById(checkedId);

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
  var newData = {
    order: todoItems.length,
    text: $("#addText").val(),
    complete: "false"
  };

  startLoadingIcon();
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

// When the text is clicked, make it editable, on enter or blur, submit the text
function editText() {
  var editId = $(this).parent().attr('id');
  var index = getItemIndexById(editId);
  var input = $('<input>')
    .attr('type', 'text')
    .val(todoItems[index].data.text)

  input.keyup(function(){
    if(event.keyCode == 13){
      submitEditText(index, input);
    }
  });

  input.blur(function() {
    submitEditText(index, input);
  });

  $(this).replaceWith(input);
  console.log();
}

//
function submitEditText(index, input) {
  var clonedItem = $.extend(true, {}, todoItems[index]);
  clonedItem.data.text = input.val();

  startLoadingIcon();
  updateItem(clonedItem, function() {
    todoItems[index].data.text = input.val();
    refreshTodo();
    stopLoadingIcon();
  }, function() {
    refreshTodo();
    errorMessage();
    stopLoadingIcon();
  });
}

// Redraw todo list from data
function refreshTodo() {
  var container = $('#todo-content').empty();
  $.each(todoItems, function(key, item){
    $('#todo-content').append(buildNewItem(item));
  });
  bindEvents();
}

// ----------- Utility methods -----------

function bindEvents() {
  $(".deleteItem").click(deleteItem);
  $(".completeCheckbox").click(toggleCompleteItem);
  $(".todoText").click(editText);
}

function getItemIndexById(id) {
  var index = -1;
  for(var i = 0; i < todoItems.length; i++) {
    if(todoItems[i].id == id) {
      index = i;
      break;
    }
  }
  return index;
}

// Build html for a new item
function buildNewItem(item) {
  console.log(item);
  var row = $('<li>').attr("id", item.id);
  var checkbox = $('<input type="checkbox">').addClass('completeCheckbox');
  if(item.data.complete.toLowerCase() == 'true') {
    row.addClass('complete');
    checkbox.attr('checked', true);
  }

  var text = $('<span>')
    .addClass('todoText')
    .text(item.data.text);

  return row.html(checkbox.prop('outerHTML') + text.prop('outerHTML') +
    '<i class="fa fa-times deleteItem"></i>');
}

// Draw loading icon
function startLoadingIcon() {
  $('#title').html('To Do <i class="fa fa-circle-o-notch fa-spin"></i>');
}

// Undraw loading icon
function stopLoadingIcon() {
  $('#title').html('To Do');
}

// Generic error message for the user
function errorMessage() {
  alert("Oops, something went wrong, check your internet connection and try again.");
}
