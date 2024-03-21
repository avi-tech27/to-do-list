class Utils {
    constructor() {
        this.currentSortSelect = "priority"
        this.currentView = "all"
    }

    generateRandomUuid() {
        const uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return uuidTemplate.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    addTask(task, list, key) {
        const todoList = document.getElementById(list + '-list');
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
    
    <label class="task-text">${task.title}</label>
    <input type="text" class="form-control" style="display: none;" value="${task.title}">
    <div class="btn-group">
      <button class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split"></button>
    </div>
    <label style="display:none">${task.taskId}</label>
    
  `;

        const div = document.createElement("div");
        div.className = "task-information"
        div.innerHTML = `
    <div class="bold-text info">Description</div>
    <label>${task.description}</label>
    <input type="text" class="form-control" style="display: none; text-align: center;" value="${task.description}">
    <div class="bold-text info">Task Priority</div>
    <label>${task.priority}</label>
    <select id="todo-priority" class="form-select" style="display: none;">
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    </select>
    <div class="bold-text info">End Date</div>
    <label>${task.endDate}</label>
    <input type="date" class="form-control" style="display: none; text-align: center;">
        `

        const taskDropDownElement = li.children[2].children[0];
        taskDropDownElement.addEventListener('click', (ev) => {
            if (div.style.display == "none") {
                div.style.display = "flex"
            } else {
                div.style.display = "none"
            }

        })

        //to set placeholder for date input
        div.lastElementChild.value = task.endDate
        //to set placeholder for task priorty
        div.children[5].value = task.priority

        const buttonDiv = document.createElement("div")
        buttonDiv.className = "task-fuction-btns"

        const removeButton = document.createElement("button")
        removeButton.classList = "btn btn-primary"
        removeButton.style.background = "#d64c4c"
        removeButton.style.borderColor = "#d64c4c"
        removeButton.textContent = "Remove"

        const editButton = document.createElement("button")
        editButton.classList = "btn btn-primary"
        editButton.textContent = "Edit"

        const completeButton = document.createElement("button")
        completeButton.style.background = "#47b95a"
        completeButton.style.borderColor = "#47b95a"
        completeButton.classList = "btn btn-primary"
        completeButton.textContent = "Complete"

        const currentStatus = key ? key : list

        if (key == "todo" || list == "todo") {
            const startButton = document.createElement("button")
            startButton.classList = "btn btn-primary"
            startButton.style.background = "#f5de13"
            startButton.style.borderColor = "#f5de13"

            startButton.textContent = "Start"
            buttonDiv.appendChild(editButton)
            buttonDiv.appendChild(removeButton)
            buttonDiv.appendChild(startButton)
            this.initStartButton(startButton, currentStatus, task.taskId)
            this.initEditButton(editButton, currentStatus, li, div)
        } else if (!(key == "done" || list == "done")) {
            buttonDiv.appendChild(completeButton)
            buttonDiv.appendChild(editButton)
            buttonDiv.appendChild(removeButton)
            this.initCompleteButton(completeButton, currentStatus, task.taskId)
            this.initEditButton(editButton, currentStatus, li, div)
        } else {
            buttonDiv.appendChild(removeButton)
        }

        this.initRemoveButton(removeButton, currentStatus, task.taskId)

        todoList.appendChild(li);
        todoList.appendChild(div)
        div.appendChild(buttonDiv)
    }

    clearLists() {
        const tasks = document.querySelectorAll('ul')
        tasks.forEach(element => {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
    }

    initEditButton(editButton, currentStatus, taskTitleElement, taskInfoElement) {
        editButton.addEventListener('click', (ev) => {
            const taskIdElement = taskTitleElement.lastElementChild
            const taskElement = taskTitleElement.firstElementChild
            const taskInputElement = taskTitleElement.children[1]
            const taskDescriptionElement = taskInfoElement.children[1]
            const taskDescriptionInputElement = taskInfoElement.children[2]
            const taskPriorityElement = taskInfoElement.children[4]
            const taskPriorityInputElement = taskInfoElement.children[5]
            const endDateElement = taskInfoElement.children[7]
            const endDateInputElement = taskInfoElement.children[8]
            if (ev.target.textContent.toLocaleLowerCase() === 'edit') {
                taskElement.style.display = "none"
                taskInputElement.style.display = "block"
                taskDescriptionElement.style.display = "none"
                taskDescriptionInputElement.style.display = "block"
                taskPriorityElement.style.display = "none"
                taskPriorityInputElement.style.display = "block"
                endDateElement.style.display = "none"
                endDateInputElement.style.display = "block"
                ev.target.textContent = 'Save';
            }
            else {
                ev.target.textContent = 'Edit';
                taskElement.style.display = "block"
                taskInputElement.style.display = "none"
                taskDescriptionElement.style.display = "block"
                taskDescriptionInputElement.style.display = "none"
                taskPriorityElement.style.display = "block"
                taskPriorityInputElement.style.display = "none"
                endDateElement.style.display = "block"
                endDateInputElement.style.display = "none"
                if (!(taskElement.textContent == taskInputElement.value && taskDescriptionElement.textContent == taskDescriptionInputElement.value && taskPriorityElement.textContent == taskPriorityInputElement.value && endDateElement.textContent == endDateInputElement.value)) {
                    taskElement.textContent = taskInputElement.value
                    taskDescriptionElement.textContent = taskDescriptionInputElement.value
                    taskPriorityElement.textContent = taskPriorityInputElement.value
                    endDateElement.textContent = endDateInputElement.value
                    db_utils.editItem(currentStatus, taskIdElement.textContent, taskElement.textContent, taskDescriptionElement.textContent, taskPriorityElement.textContent, endDateElement.textContent)
                }
            }
        })
    }

    initRemoveButton(removeButton, currentStatus, taskId) {
        removeButton.addEventListener('click', (ev) => {
            db_utils.deleteItem(currentStatus, taskId)
        })
    }

    initStartButton(startButton, currentStatus, taskId) {
        startButton.addEventListener('click', (ev) => {
            db_utils.moveItem(currentStatus, "doing", taskId)
        })
    }

    initCompleteButton(completeButton, currentStatus, taskId) {
        completeButton.addEventListener('click', (ev) => {
            db_utils.moveItem(currentStatus, "done", taskId)
        })
    }

    initSorting() {
        document.getElementById('sortBySelect').addEventListener('change', (ev) => {
            ev.preventDefault();
            this.currentSortSelect = ev.target.value
        })

        const upBtn = document.getElementById('up-btn');
        const downBtn = document.getElementById('down-btn');

        upBtn.addEventListener('click', () => {
            if (this.currentSortSelect == 'priority') {
                // Sort the "todo" array based on the "priority" field
                if (this.currentView == "all") {
                    db_utils.combinedLocalDb.all.sort((a, b) => {
                        const priorityOrder = { Low: 3, Medium: 2, High: 1 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                } else {
                    db_utils.jsonDB[this.currentView].sort((a, b) => {
                        const priorityOrder = { Low: 3, Medium: 2, High: 1 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                }

            }
            if (this.currentSortSelect == 'end-date') {
                // Sort the "todo" array based on the "end date" field
                if (this.currentView == "all") {
                    db_utils.combinedLocalDb.allsort((a, b) => {
                        const priorityOrder = { Low: 3, Medium: 2, High: 1 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });

                } else {
                    db_utils.jsonDB[this.currentView].sort((a, b) => {
                        const priorityOrder = { Low: 3, Medium: 2, High: 1 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                }
                // Sort the "todo" array based on the "endDate" field in ascending order
                jsonObject.todo.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
            }
            db_utils.refreshList()
        });

        downBtn.addEventListener('click', () => {
            if (this.currentSortSelect == 'priority') {
                // Sort the "todo" array based on the "priority" field
                if (this.currentView == "all") {
                    db_utils.combinedLocalDb.all.sort((a, b) => {
                        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                }else{
                    db_utils.jsonDB[this.currentView].sort((a, b) => {
                        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                }

            }
            if (this.currentSortSelect == 'end-date') {
                // Sort the "todo" array based on the "end date" field
                if (this.currentView == "all") {
                    db_utils.combinedLocalDb.all.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

                } else {
                    db_utils.jsonDB[this.currentView].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                }
            }
            db_utils.refreshList()
        });
    }

    initListViews() {
        document.getElementById('inlineFormCustomSelect').addEventListener('change', (ev) => {
            ev.preventDefault();
            document.getElementsByName(ev.target.id)[0].classList.add('show')
            this.currentView = ev.target.value
            const uncheckedOptions = document.querySelectorAll('input[name="btnradio"]:not(:checked)');
            for (const uncheckedOption of uncheckedOptions) {
                document.getElementsByName(uncheckedOption.id)[0].classList.remove('show')
            }
        })
    }
}

const utils = new Utils();

class DB_Utils {

    constructor() {
        this.combinedLocalDb = { all: [] }
        this.jsonDB = {
            todo: [],
            doing: [],
            done: []
        };
        this.loadDataFromFile()
    }

    // load data from JSON file to working memory
    loadDataFromFile() {
        try {
            fetch("https://json.extendsclass.com/bin/4755e4bfab17")
                .then(response => response.json())
                .then((data) => {
                    this.jsonDB = data
                                        this.combinedLocalDb.all = [
                        ...this.jsonDB.todo.map(item => ({ ...item, parentList: 'todo' })),
                        ...this.jsonDB.doing.map(item => ({ ...item, parentList: 'doing' })),
                        ...this.jsonDB.done.map(item => ({ ...item, parentList: 'done' }))
                    ];
                    this.refreshList()

                })
                .catch(error => console.error('Error fetching data:', error));

        } catch (err) {
            console.error('Error loading data from file:', err);
        }
    }

    // Save data from memory to JSON file
    saveDataToFile() {
        try {

            // Options for the fetch request
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.jsonDB)
            };

            // Fetch PUT request
            fetch("https://json.extendsclass.com/bin/4755e4bfab17", requestOptions)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error updating data:', error));
            this.refreshList()
        } catch (err) {
            console.error('Error saving data to file:', err);
        }
        this.combinedLocalDb.all = [
            ...this.jsonDB.todo.map(item => ({ ...item, parentList: 'todo' })),
            ...this.jsonDB.doing.map(item => ({ ...item, parentList: 'doing' })),
            ...this.jsonDB.done.map(item => ({ ...item, parentList: 'done' }))
        ];

    }

    // Function to add an item to the JSON database
    addItem(title, description, todoPriorityValue, endDate) {
        let newItem = {
            taskId: utils.generateRandomUuid(), // Generate a unique Task ID
            title: title,
            description: description,
            priority: todoPriorityValue,
            endDate: endDate
        };
        this.jsonDB.todo.push(newItem);
        this.saveDataToFile();  
    }

    // Function to delete an item from the JSON database based on Task ID
    deleteItem(currentStatus, taskId) {
        const index = this.jsonDB[currentStatus].findIndex(item => item.taskId === taskId);
        if (index !== -1) {
            this.jsonDB[currentStatus].splice(index, 1);
            this.saveDataToFile();
        }
    }

    //Function to move item from the diffrent list based on the task status
    moveItem(currentStatus, newStatus, taskId) {
        const taskIndex = this.jsonDB[currentStatus].findIndex(task => task.taskId === taskId);
        if (taskIndex !== -1) {
            const task = this.jsonDB[currentStatus][taskIndex];
            this.jsonDB[currentStatus].splice(taskIndex, 1);
            this.jsonDB[newStatus].push(task);
        }
        this.saveDataToFile();
    }

    // Function to edit an item in the JSON database based on Task ID
    editItem(currentStatus, taskId, newTitle, newDescription, newPriority, newEndDate) {
        const index = this.jsonDB[currentStatus].findIndex(item => item.taskId === taskId);
        if (index !== -1) {
            this.jsonDB[currentStatus][index].title = newTitle;
            this.jsonDB[currentStatus][index].description = newDescription;
            this.jsonDB[currentStatus][index].priority = newPriority;
            this.jsonDB[currentStatus][index].endDate = newEndDate;
            this.saveDataToFile();
        }
    }

    //Refresh all list
    refreshList() {
        utils.clearLists()
        document.getElementById("all-list-label").textContent = `ALL(` + (this.jsonDB.todo.length + this.jsonDB.doing.length + this.jsonDB.done.length) + `)`
        document.getElementById("to-do-list-label").textContent = `To-Do(` + this.jsonDB.todo.length + `)`
        document.getElementById("doing-list-label").textContent = `Doing(` + this.jsonDB.doing.length + `)`
        document.getElementById("done-list-label").textContent = `Done(` + this.jsonDB.done.length + `)`
        for (const key in this.jsonDB) {
            for (const task of this.jsonDB[key]) {
                utils.addTask(task, key)
            }
        }
        for(const task of this.combinedLocalDb.all){
            utils.addTask(task, 'all', task.parentList)
        }
    }
}

const db_utils = new DB_Utils();

//to disable backdate to-do list
document.getElementById('todo-end-date').setAttribute("min", new Date().toISOString().slice(0, 10))

// Event listener for form submission
document.getElementById("todo-form").addEventListener("submit",
    function (event) {
        event.preventDefault();
        const taskTitle = document.getElementById("todo-task");
        const taskDescription = document.getElementById("todo-description");
        const taskPrioritySelect = document.getElementById('todo-priority');
        const taskEndDate = document.getElementById("todo-end-date");
        const taskTitleValue = taskTitle.value.trim();
        const taskDescriptionValue = taskDescription.value.trim();
        const taskPriorityValue = taskPrioritySelect.value.trim();
        const taskEndDateValue = taskEndDate.value.trim();
        if (taskTitleValue !== "" && taskDescriptionValue !== "" && taskEndDateValue !== "") {
            db_utils.addItem(taskTitleValue, taskDescriptionValue, taskPriorityValue, taskEndDateValue);
            taskTitle.value = "";
            taskDescription.value = "";
            taskEndDate.value = "";
            //utils.addTask(taskTitleValue)
        }
    });





utils.initSorting()
utils.initListViews()


