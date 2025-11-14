
const input = document.getElementById('input');
const tasklist = document.querySelector('.taskList');
const taskItem = document.querySelectorAll('.taskItem');


function addNewTask() {
    let value = input.value;
    const li = document.createElement('li');
    li.textContent = value;
    li.classList.add('taskItem');
    tasklist.appendChild(li);
    input.value = '';
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('deleteButton');
    li.appendChild(deleteButton);
    deleteButton.addEventListener('click', function() {
        tasklist.removeChild(li);
    });
}

function allTasks() {
    const addedTasks = [];
    taskItem.forEach(function(item) {
        taskItem.push(item.textContent);
    });
}