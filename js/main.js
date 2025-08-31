var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    // Globals
    const todoList = document.getElementById('todo-list');
    const userSelect = document.getElementById('user-todo');
    const form = document.querySelector('form');
    let todos = [];
    let users = [];
    // Attach Events
    document.addEventListener('DOMContentLoaded', initApp);
    form.addEventListener('submit', handleSubmit);
    // Basic Logic
    function getUserName(userId) {
        const user = users.find((u) => u.id === userId);
        return (user === null || user === void 0 ? void 0 : user.name) || '';
    }
    function printTodo({ id, userId, title, completed }) {
        if (todoList) {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = String(id);
            li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;
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
            todoList === null || todoList === void 0 ? void 0 : todoList.prepend(li);
        }
    }
    function createUserOption(user) {
        if (userSelect) {
            const option = document.createElement('option');
            option.value = String(user.id);
            option.innerText = user.name;
            userSelect.append(option);
        }
    }
    function removeTodo(todoId) {
        if (todoList) {
            todos = todos.filter((todo) => todo.id !== todoId);
            const todo = todoList === null || todoList === void 0 ? void 0 : todoList.querySelector(`[data-id="${todoId}"]`);
            if (todo) {
                const input = todo.querySelector('input');
                if (input) {
                    input.removeEventListener('change', handleTodoChange);
                }
                const closeBtn = todo.querySelector('.close');
                if (closeBtn) {
                    closeBtn.removeEventListener('click', handleClose);
                }
                todo.remove();
            }
        }
    }
    function alertError(error) {
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
    function handleSubmit(event) {
        event.preventDefault();
        const val = {
            userId: Number(form.user.value),
            title: form.todo.value,
            completed: false,
        };
        createTodo(val);
    }
    function handleTodoChange() {
        var _a;
        const parent = this.parentElement;
        if (parent) {
            const todoId = (_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.dataset.id;
            const completed = this.checked;
            todoId && toggleTodoComplete(todoId, completed);
        }
    }
    function handleClose() {
        const parent = this.parentElement;
        if (parent) {
            const todoId = this.parentElement.dataset.id;
            todoId && deleteTodo(todoId);
        }
    }
    // Async logic
    function getAllTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://jsonplaceholder.typicode.com/todos?_limit=15');
                const data = yield response.json();
                return data;
            }
            catch (error) {
                if (error instanceof Error)
                    alertError(error);
                return [];
            }
        });
    }
    function getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
                const data = yield response.json();
                return data;
            }
            catch (error) {
                if (error instanceof Error)
                    alertError(error);
                return [];
            }
        });
    }
    function createTodo(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://jsonplaceholder.typicode.com/todos', {
                    method: 'POST',
                    body: JSON.stringify(todo),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const newTodo = yield response.json();
                printTodo(newTodo);
            }
            catch (error) {
                if (error instanceof Error)
                    alertError(error);
            }
        });
    }
    function toggleTodoComplete(todoId, completed) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ completed }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to connect with the server! Please try later.');
                }
            }
            catch (error) {
                if (error instanceof Error)
                    alertError(error);
            }
        });
    }
    function deleteTodo(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    removeTodo(todoId);
                }
                else {
                    throw new Error('Failed to connect with the server! Please try later.');
                }
            }
            catch (error) {
                if (error instanceof Error)
                    alertError(error);
            }
        });
    }
})();
export {};
//# sourceMappingURL=main.js.map