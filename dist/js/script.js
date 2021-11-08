'use strict';

document.addEventListener('DOMContentLoaded', function() {

const todoItems = document.querySelector('.main__todos'),
      todoSubmit = document.querySelector('.main__add-button'),
      todoInput = document.querySelector('.main__user-input'),
      taskSelector = document.querySelector('.main__task-selector'),
      todoCard = document.querySelector('.todo-card'),
      todoCardOverlay = document.querySelector('.todo-card__overlay'),
      todoCardTimestamp = document.querySelector('.todo-card__timestamp'),
      todoCardClose = document.querySelector('.todo-card__close'),
      todoCardDescr = document.querySelector('.todo-card__descr');
      ;

let todos = [],
    remoteTodos = [];



function timeConvert(unixTime) {

    let date = new Date(unixTime);

    return `${+date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}


function initTodos() {
    const storage = localStorage.getItem('todos');
    const taskFromServer = localStorage.getItem('remoteTodos');

    if (!taskFromServer) {
        fetch('https://jsonplaceholder.typicode.com/todos/')
        .then((response) => response.json())
        .then((json) => {
            localStorage.setItem('remoteTodos', JSON.stringify(json));
        })
    }


    if (storage) {
        todos = JSON.parse(storage);
        showTodos(todos, 'local');
    }
    if (taskFromServer) {
        remoteTodos = JSON.parse(taskFromServer);
    }
}


function addTodo(task) {
    
    if (task !== '') {
        const todo = {
            id: Date.now(),
            title: task
    }

    todos.push(todo);
    addToLocalStorage(todos, 'local');

    todoInput.value = '';
    } else {
        alert("Task can't be empty. Please, typing task description.")
    }
}

function addToLocalStorage(todos, taskFrom) {

    if (taskFrom == 'local') {
        localStorage.setItem('todos', JSON.stringify(todos));

        showTodos(todos, 'local');
    }
    
    if (taskFrom == 'server') {
        localStorage.setItem('remoteTodos', JSON.stringify(remoteTodos));

        showTodos(remoteTodos, 'server');
    }
}


function deleteTodo(id, taskFrom) {
    if (taskFrom == 'local') {
        todos = todos.filter((item) => {
            return item.id != id;
        });

        addToLocalStorage(todos, 'local');
    }

    if (taskFrom == 'server') {
        remoteTodos = remoteTodos.filter((item) => {
            return item.id != id;
        });

        addToLocalStorage(remoteTodos, 'server');
    }

    
}


function showTodos(todos, locationAttribut) {

    todoItems.innerHTML = '';


    todos.forEach((item) => {

        const li = document.createElement('li');
        let text = item.title;
    
        li.setAttribute('data-task-id', item.id);

        li.setAttribute('data-task-from', locationAttribut);


        if (text.length > 18) {
            text = `${text.substring(0, 19)}...`
        }

        li.innerHTML = `
            <h3 class="main__todo-descr">${text}</h3>
            <span class="delete">&#10006</span>
        `;
    
        todoItems.append(li);
    
    });


    todoItems.addEventListener('click', (event) => {
        event.stopImmediatePropagation();

        if (event.target.className === 'delete') {
            deleteTodo(event.target.parentElement.getAttribute('data-task-id'), event.target.parentElement.getAttribute('data-task-from'));
        }

        if (event.target.parentElement.getAttribute('data-task-from') == 'local' && event.target.className === 'main__todo-descr') {
            let localTodos = JSON.parse(localStorage.todos);
        
            localTodos.forEach( todo => {
                if (todo.id == event.target.parentElement.getAttribute('data-task-id')) {
                    todoCardTimestamp.innerText = `Created time: ${timeConvert(+event.target.parentElement.getAttribute('data-task-id'))}`;
                    todoCardDescr.innerText = `${JSON.stringify(todo.title)}`;
                    todoCard.classList.toggle('show');
                    todoCardOverlay.classList.toggle('show');
                } 
            });
        }

        if (event.target.parentElement.getAttribute('data-task-from') == 'server' && event.target.className === 'main__todo-descr') {
            let serverTodos = JSON.parse(localStorage.remoteTodos);

            serverTodos.forEach( todo => {
                if (todo.id == event.target.parentElement.getAttribute('data-task-id')) {
                    todoCardTimestamp.innerText = `Task id: ${event.target.parentElement.getAttribute('data-task-id')}`;
                    todoCardDescr.innerText = `${JSON.stringify(todo.title)}`;
                    todoCard.classList.toggle('show');
                    todoCardOverlay.classList.toggle('show');
                } 
            });
        }
    });
}


function updateTaskSelector() {
    let option = taskSelector.value;


    if (option == 'local') {
        showTodos(todos, 'local');
    }
        if (option == 'remote') {
        showTodos(remoteTodos, 'server');
    }
}


taskSelector.addEventListener('click', (event) => {
    event.preventDefault();

    updateTaskSelector();
});

todoCardClose.addEventListener('click', () => {
    todoCard.classList.toggle('show');
    todoCardOverlay.classList.toggle('show');
});

todoCardOverlay.addEventListener('click', () => {
    todoCard.classList.toggle('show');
    todoCardOverlay.classList.toggle('show');
});

todoSubmit.addEventListener('click', () => {

    taskSelector.value = 'local';
    addTodo(todoInput.value);

});

document.addEventListener('keydown', (event) => {
    if (event.code == 'Enter') {
        taskSelector.value = 'local';
        addTodo(todoInput.value);
    }
});


initTodos();



});