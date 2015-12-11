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

      // sending emails to followers for this todo list
      followers.forEach(function(follower) {
        Email.send({
          from: "hello@todoapp.com",
          to: follower,
          subject: "New todo added",
          text: "here's the todo item: " + title
        });
      });
      
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
        Meteor.call('addTodo', todoText, function() {
          alert("todo added successfully");
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
    return this.isDone? "checked": "";
  }

  Template.main.todosList = function(){
    return Todos.find();
  }
}
