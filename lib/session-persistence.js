const SeedData = require("./seed-data");
const deepCopy = require("./deep-copy");
const nextId = require("./next-id");
const { sortTodoLists, sortTodos } = require("./sort");

module.exports = class SessionPersistence {
  constructor(session) {
    this._todoLists = session.todoLists || deepCopy(SeedData);
    session.todoLists = this._todoLists;
  }

  // Are all of the todos in the todo list done? If the todo list has at least 
  // one todo and all of its todos are marked as done, then the todo list is 
  // done. Otherwise, it's undone
  isDoneTodoList(todoList) {
    return todoList.todos.length > 0 && todoList.todos.every(todo => todo.done);
  }

  hasUndoneTodos(todoList) {
    return todoList.todos.some(todo => !todo.done);
  }

  // Return the list of todo lists sorted by completion status and title (case-insensitive)
  sortedTodoLists() {
    let todoLists = deepCopy(this._todoLists);
    let undone = todoLists.filter(todoList => !this.isDoneTodoList(todoList));
    let done = todoLists.filter(todoList => this.isDoneTodoList(todoList));
    return sortTodoLists(undone, done);
  }

  // Returns a copy of the todo list with the indicated ID. Returns 'undefined'
  // if not found. 'todoListId' must be numeric.
  loadTodoList(todoListId) {
    let todoLists = deepCopy(this._todoLists);
    return todoLists.find(todoList => todoList.id === todoListId);
  };

  //Returns a copy of the todo with the indicated ID. Returns 'undefined' 
  // if not found. Both arguments must be numeric.
  loadTodo(todoListId, todoId) {
    let todoList = this.loadTodoList(todoListId);
    if (!todoList) return undefined;

    return todoList.todos.find(todo => todo.id === todoId);
  };

  sortedTodos(todoList) {
    return sortTodos(todoList);
  }

  // Returns a reference to the todo list with the indicated ID. Returns 'undefined'
  // if not found. 'todoListId' must be numeric
  _findTodoList(todoListId) {
    return this._todoLists.find(todoList => todoList.id === todoListId);
  }

  // Returns a reference to the todo with the indicated ID. Returns 'undefined'
  // if todo or todoList is not found . 'todoListId' and 'todoId' must be numeric
  _findTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;
    let todo = todoList.todos.find(todo => todo.id === todoId);
    return todo;
  }

  // Toggle a todo between the done and not done state. Returns 'true' on 
  // success, 'false' if the todo or todo list doesn't exist. Id args must be numeric
  toggleDoneTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);
    if (!todo) return false;

    todo.done = !todo.done;
    return true;
  }

  // Delete the specified todo from the specified todo list. Returns 'true' on 
  // success, 'false' if the todo or todo list doesn't exist. The args must be numeric.
  deleteTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    let todoIndex = todoList.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) return false;

    todoList.todos.splice(todoIndex, 1);
    return true;
  }

  // Deleted a todo list from the list of todo lists. Reutrns 'true' on success, 
  // 'false' if the todo list doesn't exist. The ID arg must be numeric. 

  deleteTodoList(todoListId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    let todoListIndex = this._todoLists.findIndex(todoList => todoList.id === todoListId);
    if (todoListIndex === -1) return false;

    this._todoLists.splice(todoListIndex, 1);
    return true;

  }

  // Mark all todos on the tod list as done. Returns 'true' on success, 
  // 'false' if the todo list doesn't exist. todoListId must be numeric.
  toggleAllTodosDone(todoListId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    todoList.todos.forEach(todo => {
      todo.done = true;
    });

    return true;
  }

  addTodo(todoListId, todoTitle) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    todoList.todos.push({ id: nextId(), title: todoTitle, done: false });

    return true;

  }

  // Set a new title for the specified todo list. Returns 'true' on success, 
  // 'false' if the todo list isn't found. The todo list ID must be numeric. 

  setTodoListTitle(todoListId, title) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    todoList.title = title;
    return true;
  }

  // Returns `true` if a todo list with the specified title exists in the list
  // of todo lists, `false` otherwise.
  existsTodoListTitle(title) {
    return this._todoLists.some(todoList => todoList.title === title);
  }

  // Create a new todo list with the specified title and add it to the list of 
  // todo lists. Returns 'true on success, 'false' on failure.
  createTodoList(title) {
    this._todoLists.push({id: nextId(), title, todos: [] });
    return true; 
  }

};