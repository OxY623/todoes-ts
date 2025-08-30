import type IToDo = require("./types");
import type PrintToDo = require("./types");
import type types = require("./types");




(function() {
  // Globals
  const todoList = document.getElementById('todo-list');
  const userSelect = document.getElementById('user-todo');
  const form = document.querySelector('form');
  let todos: types.IToDo[]  = [];
  let users: types.IUser[]  = [];

  // Attach Events
  document.addEventListener('DOMContentLoaded', initApp);
  (form as HTMLFormElement).addEventListener('submit', handleSubmit);

  // Basic Logic
  function getUserName (userId: types.ID): string {
    const user = users.find((u) => u.id === userId)!;
    return user?.name || '';
  }
  function printTodo({ id, userId, title, completed }: types.IToDo) {
    if(todoList){
      const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id  = String(id) as string;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleTodoChange);

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';
    close.addEventListener('click', handleClose);

    li.prepend(status);
    li.append(close);

    (todoList as HTMLUListElement)?.prepend(li);
    }
    
  }

  function createUserOption(user: types.IUser) {
    if(userSelect){
      const option: HTMLOptionElement = document.createElement('option');
    option.value = String(user.id) as string;
    option.innerText = user.name;

    (userSelect as HTMLSelectElement).append(option);
  }
}  

  function removeTodo(todoId: types.ID) {
    if(todoList){
      todos = todos.filter((todo) => todo.id !== todoId);
      const todo = todoList?.querySelector(`[data-id="${todoId}"]`);

      if(todo){
      const input = todo!.querySelector('input');
      if (input) {
        input.removeEventListener('change', handleTodoChange);
      }
      const closeBtn = todo!.querySelector('.close');
      if (closeBtn) {
        closeBtn.removeEventListener('click', handleClose);
      }

      todo.remove();
    }
  }
}

  function alertError(error: Error) {
    alert(error.message);
  }

  // Event Logic
  function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;

      // Отправить в разметку
      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => createUserOption(user));
    });
  }
  function handleSubmit(event: Event) {
    event.preventDefault();

    const val: Omit<types.IToDo, "id"> = {
      userId: Number(form!.user.value) as number,
      title: (form as HTMLFormElement).todo.value,
      completed: false,
    };

    createTodo(val);
  }
  function handleTodoChange(this:HTMLInputElement) {
    const parent = this.parentElement;
    if(parent){
    const todoId = this.parentElement?.dataset.id;
    const completed = this.checked;

    todoId && toggleTodoComplete(todoId, completed);
    }
  }
  function handleClose(this:HTMLSpanElement) {
    const parent = this.parentElement;
    if(parent){
      const todoId = this.parentElement.dataset.id;
      todoId && deleteTodo(todoId);
    }
    
  }

  // Async logic
  async function getAllTodos() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=15'
      );
      const data = await response.json();

      return data;
    } catch (error) {
      if(error instanceof Error) alertError(error);
    }
  }

  async function getAllUsers() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users?_limit=5'
      );
      const data = await response.json();

      return data;
    } catch (error) {
      if(error instanceof Error) alertError(error);
    }
  }

  async function createTodo(todo: Omit<types.IToDo, "id">) {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos',
        {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newTodo = await response.json();

      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  async function toggleTodoComplete(todoId: types.ID, completed: boolean) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ completed }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to connect with the server! Please try later.');
      }
    } catch (error) {
      if(error instanceof Error) alertError(error);
    }
  }

  async function deleteTodo(todoId: types.ID) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        removeTodo(todoId);
      } else {
        throw new Error('Failed to connect with the server! Please try later.');
      }
    } catch (error) {
      if(error instanceof Error) alertError(error);
    }
  }
})()
