Todos = new Meteor.Collection('todos');
Todos.allow({
  remove: function() { return true; },
  update: function() { return true; }
});

var followers = [
  "hello@kadira.io"
];

if(Meteor.isServer) {
  Meteor.publish('todos', function() {
    return Todos.find();
  });

  Meteor.methods({
    addTodo: function(title) {
      check(title, String);      
      var a =  Todos.insert({'title': title});
    }
  });
}

if(Meteor.isClient) {
  Meteor.subscribe('todos');

  Template.main.events({
    'click #add-todo': function () {
      var todoText = $('#input-todo').val();
      if(todoText.trim() != ""){
        Meteor.call('addTodo', todoText, function(err) {
          if(err) {
            alert("Error adding todo: " + err.reason);
          }
        });
        $('#input-todo').val('');
      }
    },

    'click .delete-todo': function () {
      Todos.remove(this._id);
    },

    'change .todo-done ': function(e){
      var isDone = $(e.target).is(':checked');
      Todos.update({_id: this._id}, {$set: {isDone: isDone}})
    }
  });

  Template.main.checkedState = function() {
    // Ah ha! You found it. Remove this loop to fix the issue.
    for(var lc=0; lc<20000; lc++) {
      Random.id();
    }
    return this.isDone? "checked": "";
  }

  Template.main.todosList = function(){
    return Todos.find();
  }
}
