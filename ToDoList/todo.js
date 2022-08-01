//Implementing IIFE in todo.js

(function () {
    let tasks = [];
    const taskList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');

    console.log('Working');

    async function fetchTodos() {
        // //GET request
        // fetch('https://jsonplaceholder.typicode.com/todos') //fetch returns Promise
        // .then(function(response){
        //     return response.json(); //json will also return Promise and converting the response into json
        // })
        // .then(function(data){
        //     tasks = data.slice(0, 10); //fetching the first 10 items
        //     renderList();
        // })
        // .catch(function(error){
        //     showNotification(error);
        // })

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
            tasks = data.slice(0, 10); //fetching the first 10 items
            renderList();
        }
        catch (error) {
            console.log(error);
        }
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg" class="delete" data-id="${task.id}" />
    `;
        taskList.append(li);
    }

    function renderList() {
        taskList.innerHTML = '';
        for (let i = 0; i < tasks.length; i++) {
            addTaskToDOM(tasks[i]);
        }
        tasksCounter.innerHTML = tasks.length;
    }

    function toggleTask(taskId) {
        const completeTask = tasks.filter(t => t.id === Number(taskId));
        if (completeTask.length > 0) {
            const currentTask = completeTask[0];
            currentTask.completed = !currentTask.completed;
            renderList();
            showNotification('Task toggled successfully');
            return;
        }
        showNotification('could not toggle the task');
    }

    function deleteTask(taskId) {
        const newTasks = tasks.filter(t => t.id !== Number(taskId));
        tasks = newTasks;
        renderList();
        showNotification('Task deleted successfully.')
    }

    function addTask(task) {
        if (task) {
            //POST request using fetch
            // fetch('https://jsonplaceholder.typicode.com/todos',{
            //     method: 'POST',
            //     headers:{
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(task),
            //     }) //fetch returns Promise
            //     .then(function(response){
            //         return response.json(); //json will also return Promise and converting the response into json
            //     })
            //     .then(function(data){
            //         tasks.push(task);
            //         renderList();
            //         showNotification('Task added successfully');
            //         console.log(data); //changes to be made should be done here 
            //     })
            //     .catch(function(error){
            //         showNotification(error);
            //     })
            tasks.push(task);
            renderList();
            showNotification('Task added successfully');
            return;
        }

        showNotification('Task can not be added.');
    }

    function showNotification(text) {
        alert(text);
    }

    function handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            const text = e.target.value;
            console.log("text ", text);

            if (!text) {
                showNotification('Task text can not be empty.');
                return;
            }

            const task = {
                title: text,
                id: Date.now(),
                completed: false
            };

            e.target.value = '';
            addTask(task);
        }

    }

    function handleClickListener(e) {
        const target = e.target;
        if (target.className === 'delete') {
            const taskId = target.dataset.id;  //getting the data-id from img tag with dataset.id(data-id)
            deleteTask(taskId);
            return;
        }
        else if (target.className === 'custom-checkbox') {
            const taskId = target.id;
            toggleTask(taskId);
            return;
        }
    }


    function initializeApp() {
        fetchTodos();
        addTaskInput.addEventListener('keyup', handleInputKeyPress);
        document.addEventListener('click', handleClickListener); //Event delegation example, which means instead of handling click for indvidiual
        //element we are adding to common parent and with the target we can identify which element is clicked.
    }

    initializeApp();
})()
