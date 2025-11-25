let todos = [];
let currentDraggedElement = null;
let contactUser = {};
let startStatusColumn = "";
let boardPos = {
    boardToDo: {},
    boardProgress: {},
    boardFeedback: {},
    boardDone: {}
};

let desiredPos = null;

const dialogBoardTaskRev = {
    dialog: document.getElementById("dialaogBoardTask"),
    dialaogBoardTask: document.getElementById("dialaogBoardTask"),
    task_title: document.getElementById("task_title"),
    task_description: document.getElementById("task_description"),
    due_date: document.getElementById("due_date"),
    assigned_to: document.getElementById("assigned_to"),
    dropdown_arrow: document.getElementById("dropdown_arrow"),
    contact_icons: document.getElementById("contact_icons"),
    contact_list: document.getElementById("contact_list"),
    contact_ul: document.getElementById("contact_ul"),
    category_dropdown: document.getElementById("category_dropdown"),
    selected_category: document.getElementById("selected_category"),
    category_dropdown_arrow: document.getElementById("category_dropdown_arrow"),
    category_list: document.getElementById("category_list"),
    categories: document.getElementById("categories"),
    subtask_wrapper: document.getElementById("subtask_wrapper"),
    subtask: document.getElementById("subtask"),
    subtask_actions: document.getElementById("subtask_actions"),
    subtask_list: document.getElementById("subtask_list")
}

/**
 * Loads tasks and contacts from the database, initializes the board,
 * and renders the UI.
 */
async function onloadFuncBoard() {
    const ALL_TASKS = await getAllUsers('tasks');
    todos = getTaskArr(ALL_TASKS);

    const ALL_USER = await getAllUsers("contacts");
    contactUser = getUserData(ALL_USER);

    updateHTML();
    renderActiveAvatar();
}

/**
 * Processes search input and updates the task list accordingly.
 * Filters tasks if the search string has not enought characters.
 */
async function processChanges() {
    const ALL_TASKS = await getAllUsers('tasks');
    const searchValue = document.getElementById("searchBoard").value.toLowerCase();

    if (searchValue.length > 2) {
        const allTodos = getTaskArr(ALL_TASKS);
        todos = allTodos.filter(t =>
            t.title.toLowerCase().includes(searchValue) ||
            t.description.toLowerCase().includes(searchValue)
        );
    } else {
        todos = getTaskArr(ALL_TASKS);
    }

    updateHTML();
}

/**
 * Converts a user object into an array of task objects with status and position.
 * @param {Object} usersObj - Object containing tasks keyed by ID.
 * @returns {Array<Object>} Array of task objects.
 */
function getTaskArr(usersObj) {
    const arr = [];

    for (const [key, value] of Object.entries(usersObj)) {
        let statusValue = checkStatus(value);
        let posValue = checkPosition(value, statusValue);

        arr.push({
            id: key,
            title: value.title,
            description: value.description,
            category: value.category,
            date: value.date,
            pos: posValue,
            priority: value.priority,
            subtasks: value.subtasks,
            assignedTo: value.assignedTo,
            status: statusValue
        });
        boardPos[statusValue][key] = posValue;
    }

    return arr;
}

/**
 * Determines the position of a task within its status column.
 * @param {Object} value - Task object.
 * @param {string} statusValue - The status column name.
 * @returns {number} Position index within the column.
 */
function checkPosition(value, statusValue) {
    if (value.hasOwnProperty("pos")) {
        return value.pos;
    }
    else {
        return Object.keys(boardPos[statusValue]).length;
    }
}

/**
 * Determines the status bzw. column of a task. If no status is set, the Task will get Status "To Do"
 * @param {Object} value - Task object.
 * @returns {string} Status column name.
 */
function checkStatus(value) {
    if (value.hasOwnProperty("status")) {
        return value.status;
    }
    else {
        return "boardToDo";
    }
}

/**
 * get all User who are assigned to the task and get their name and Avatar Color from database according to theri email adress and
 * @param {Object} usersObj - Object containing user data.
 * @returns {Object} Map of users keyed by email with name and color.
 */
function getUserData(usersObj) {
    const USERS_ARRAY = Object.values(usersObj);

    const USERS = {};

    for (const user of USERS_ARRAY) {
        USERS[user.mail] = {
            name: user.name,
            color: user.color
        };
    }

    return USERS;
}

/**
 * Aktualisiert die HTML-Darstellung aller Aufgabenbereiche.
 * Wird beim Laden der Seite aufgerufen.
 */
function updateHTML() {
    renderTodos('boardToDo');
    renderTodos('boardProgress');
    renderTodos('boardFeedback');
    renderTodos('boardDone');
}

/**
 * Rendert alle Aufgaben einer bestimmten Kategorie in den entsprechenden Bereich.
 * @param {string} status - Die Kategorie der Aufgaben ('open', 'closed', 'backup').
 */
function renderTodos(status) {
    const container = document.getElementById(status);
    const filtered = todos.filter(t => t.status === status)
        .sort((a, b) => a.pos - b.pos);

    if (filtered.length > 0) {
        container.innerHTML = "";
        for (const todo of filtered) {
            container.innerHTML += renderTask(todo, status);
        }
        container.innerHTML += `<div draggable="false" id="Preview-${status}" 
            class="previewTask" style="display:none;height:42px;">Preview</div>`;
    } else {
        container.innerHTML = `<div draggable="false" id="noEntry-${status}" 
            class="noEntry">no Entry</div>
            <div draggable="false" id="Preview-${status}" 
            class="previewTask" style="display:none;height:42px;">Preview</div>`;
    }
}


/**
 * Generiert das HTML für eine einzelne Aufgabe.
 * @param {{id: number, title: string, category: string}} todo - Das Aufgabenobjekt.
 * @returns {string} - Das HTML-Element als String.
 */
function renderTask(todo, status) {
    return `<div draggable="true" id="toDo${todo.id}" onclick="showDialogTask('${todo.id}')" ondragstart="startDragging('${todo.id}', '${todo.status}')" ondragend="stopDragging('${todo.id}')" class="todo">
                <div class="boardMoveToIcon onlyMobile" onclick="openBoardMoveToOverlay(event)">
                    <img src="../assets/img/swap_horiz.svg" alt="Move To Icon">
                </div>

                ${renderMobileMoveAction(todo, status)}

                <div class="taskStatus ${todo.category.toLowerCase().replace(/ /g, "-")}">${todo.category}</div>
                <div class="taskTitle"> ${todo.title}</div>
                <div class="taskDescription"> ${todo.description}</div>
                <div class="subtasks"> ${setProgress(todo.subtasks)}</div>
                <div class="taskFooter">
                    ${assignedUserAvatar(todo.assignedTo)} <img src="../assets/img/prio_${todo.priority}.svg">
                </div>
            </div>`;
}

/**
 * activate and deactivate the necessary CSS Files, which are responsible for the visibility of the dialog
 * @param {string} theme ID of the selected CSS File
 */
function getCssTheme(theme) {
    document.getElementById("cssAddTask").disabled = (theme != "cssAddTask");
    document.getElementById("cssAddTaskBoard").disabled = (theme != "cssAddTask");
    document.getElementById("cssEditTask").disabled = (theme != "cssEditTask");
    document.getElementById("cssShowTask").disabled = (theme != "cssShowTask");
}

/**
 * show the dialog to create a new Task
 * @param {string} column name the column bzw. Status for the task
 */
function showDialogAddTask(column) {
    clearTaskInput()
    getCssTheme('cssAddTask');
    document.getElementById('btnDialogLeftContent').innerHTML = "Cancel";
    document.getElementById("btnDialogLeft").onclick = closeDialog;
    document.getElementById('btnDialogRightContent').innerHTML = "Create Task";
    document.getElementById("btnDialogRight").onclick = addDialogTask;
    dialogBoardTaskRev.dialog.showModal();
    startStatusColumn = column;
}

/**
 * show the dialog with the Values of the selected Task
 * @param {string} id ID of the task in the Database 
 */
function showDialogTask(id) {
    const todo = todos.find(t => t.id === id);

    getCssTheme('cssShowTask');

    currentDraggedElement = id;
    dialogBoardTaskRev.dialog.showModal();
    dialogBoardTaskRev.task_title.value = todo.title;
    dialogBoardTaskRev.task_description.value = todo.description;
    autoResizeTextarea(dialogBoardTaskRev.task_description);
    dialogBoardTaskRev.due_date.value = todo.date;

    getAllSubtask(todo.subtasks);

    selectedPriority = todo.priority;
    document.getElementById("taskPriority").innerHTML = `${todo.priority} <img src="../assets/img/prio_${todo.priority}.svg" alt="Prirority of task">`;

    document.getElementById("taskCategory").innerHTML = `<div class="taskStatus ${todo.category.toLowerCase().replace(/ /g, "-")}">${todo.category}</div>`;
    document.getElementById('selected_category').textContent = todo.category;


    document.getElementById('btnDialogLeftContent').innerHTML = "Delete";
    document.getElementById("btnDialogLeft").onclick = deleteTask;
    document.getElementById('btnDialogRightContent').innerHTML = "Edit";
    document.getElementById("btnDialogRight").onclick = showDialogEdit;

    console.log(todo);
    getAssignedUser(todo);
}

function getAllSubtask(subtasks){
    if(subtasks== null){return;}

    for (let index = 0; index < subtasks.length; index++) {
        addNewSubtask(subtasks[index]);
        
    }
}

/** render indvidual subtask in Dialog */
function addNewSubtask(text) {
  // Referenz auf die Liste holen
  const list = document.getElementById("subtask_list");

  // Neues li-Element erstellen
  const li = document.createElement("li");
  li.classList.add("subtask-list");

  // Inhalt einfügen
  li.innerHTML = `
    <span class="subtask-text">${text}</span>
    <div class="subtask-element-img-wrapper">
      <button onclick="openEditingEnvironment(this)" class="subtask-edit-btn" title="Edit"></button>
      <div class="subtask-btn-divider-secondary"></div>
      <button onclick="deleteAddedSubtask(this)" class="subtask-delete-btn" title="Delete"></button>
    </div>
  `;

  // li an die Liste anhängen
  list.appendChild(li);
}

/** Manage the size of the textarea of the description for showTask in Dialog */
function autoResizeTextarea(element) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + 3 + "px";
}

/**
 * For showTask in Dialog. Get all assigned user and render the Avatar
 * @param {*} todo 
 */
function getAssignedUser(todo) {
    let contactRev = document.getElementById('contact_icons');
    let output = "";

if (todo.assignedTo.length == null) {return;}

    for (let index = 0; index < todo.assignedTo.length; index++) {
        selectedContacts.add(todo.assignedTo[index]);
        const contact = contactUser[todo.assignedTo[index]];
        if (!contact) continue;

        output += `<div class="contactAvater" style="background-color:${contact.color}"> 
                      ${getUserItem(contact.name)} 
                    </div>
                    <div>${contact.name}</div>`;
    }

    contactRev.classList.remove('d-none');
    contactRev.innerHTML = output;
}


/** Delete the actual Task from Database, close Dialog and update the Board  */
async function deleteTask() {
    await await deleteData(`/tasks/${currentDraggedElement}`);

    closeDialog();
    onloadFuncBoard();
}

/** Edit the actual Tas in Dialog */
function showDialogEdit() {
    getCssTheme('cssEditTask');
    document.getElementById('btnDialogLeftContent').innerHTML = "OK";
    document.getElementById("btnDialogLeft").onclick = editDialogTask;
}

/**
 * generate the html Tag for the Progress Bar of an Subtask for an task
 * @param {Object} subtasks 
 * @returns the render html Tag of the Progress
 */
function setProgress(subtasks) {
    if (subtasks == null) { return ""; }
    let subDone = "1";
    let subTotal = subtasks.length;

    if (subTotal == null) {
        return `no subtasks`;
    }

    return `<div class="processBarContainer">
                <div class="progress">
                    <div class="progressBar" style="width: ${(subDone / subTotal) * 100}%"></div>
                </div>
                <span class="progressLabel">${subDone}/${subTotal} Subtasks</span>
            </div> `;
}

/**
 * render html Tag of the Overlay for the possibile Moveactions of the Status bzw. Column in Mobile View
 * @param {Object} todo Object of the Database
 * @param {String} status the actual bzw. column of the task
 * @returns render html Tag for the possibility status Colum are availaible for the actual Task
 */
function renderMobileMoveAction(todo, status) {
    let output = "";
    let moveTaskUp = null;
    let moveTaskDown = null;

    switch (status) {
        case 'boardToDo':
            moveTaskUp = null;
            moveTaskDown = 'boardProgress';
            break;
        case 'boardProgress':
            moveTaskUp = 'boardToDo';
            moveTaskDown = 'boardFeedback';
            break;
        case 'boardFeedback':
            moveTaskUp = 'boardProgress';
            moveTaskDown = 'boardDone';
            break;
        case 'boardDone':
            moveTaskUp = 'boardFeedback';
            moveTaskDown = null;
            break;
    }

    output = `<div class="boardMoveToOverlay" onclick="event.stopPropagation()">
                <div class="boardMoveToHeadline onlyMobile">Move To</div>
                <div class="boardMoveToOverlayButtons">`;
    if (moveTaskUp != null) {
        output += `<div class="boardMoveToButtonContent"
           onclick="event.stopPropagation(); changeBoardStatus('${todo.id}', '${moveTaskUp}')"><img
             src="../assets/img/arrow_upward.svg" alt="arrow up">${moveTaskUp}</div>`;
    }
    if (moveTaskDown != null) {
        output += `<div class="boardMoveToButtonContent"
           onclick="event.stopPropagation(); changeBoardStatus('${todo.id}', '${moveTaskDown}')"><img
             src="../assets/img/arrow_downward.svg" alt="arrow down">${moveTaskDown}</div>`;


        output += `</div></div>`;
        return output;
    }
}

/**
 * cheanges the the status bzw. Column of an task by the overlay Menu in mobile View
 * @param {String} id ID bzw key of Element in Firebase Database
 * @param {*String} targetColumn target Column where the Task will be moved
 * @returns 
 */
async function changeBoardStatus(id, targetColumn) {
    const task = todos.find(t => t.id === id);
    if (!task) return;

    task.status = targetColumn;

    await putData('tasks/' + id, task);

    updateHTML();
}

/**
 * shows or hide the Overlay Move Dialog of an Task in Mobile View
 * @param {Event} event 
 */
function openBoardMoveToOverlay(event) {
    event.stopPropagation();

    const todo = event.currentTarget.closest('.todo');
    const overlay = todo.querySelector('.boardMoveToOverlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

document.addEventListener('click', () => {
    document.querySelectorAll('.boardMoveToOverlay').forEach(overlay => {
        overlay.style.display = 'none';
    });
});

/**
 * Generates avatar HTML for assigned users.
 * @param {string|string[]} user - Email(s) of assigned users.
 * @returns {string} HTML string of avatar elements.
 */
function assignedUserAvatar(user) {
    if (user == null) return "";

    const maxUser = 3;
    const users = Array.isArray(user) ? user : [user];

    let output = `<div class="AvatarArray">`;

    if (users.length > maxUser) {
        for (let i = 0; i < maxUser; i++) {
            const contact = contactUser[users[i]];
            if (!contact) continue;
            output += `<div class="contactAvater" style="background-color:${contact.color}"> 
                          ${getUserItem(contact.name)} 
                       </div>`;
        }

        const diff = users.length - maxUser;
        output += `<div class="contactAvater" style="background-color:gray; color:white;">+${diff}</div>`;
    } else {
        for (let i = 0; i < users.length; i++) {
            const contact = contactUser[users[i]];
            if (!contact) continue;

            output += `<div class="contactAvater" style="background-color:${contact.color}"> 
                          ${getUserItem(contact.name)} 
                       </div>`;
        }
    }

    output += "</div>";
    return output;
}

/** add new Task to Databas */
async function addDialogTask() {
    let task = getTaskInput();

    if (!checkIfTaskIsValid(task)) {
        return;
    }

    task.status = startStatusColumn;

    dialogBoardTaskRev.dialog.close()
    await patchData('tasks/' + currentDraggedElement, task);
    onloadFuncBoard();
}

/** update task */
async function editDialogTask() {
    let task = getTaskInput();

    if (!checkIfTaskIsValid(task)) {
        return;
    }

    dialogBoardTaskRev.dialog.close()
    await patchData('tasks/' + currentDraggedElement, task);
    onloadFuncBoard();
}

/**
 * set the global Value for the current dragging task and rotate the the dragging Task
 * @param {number} id - Die ID der gezogenen Aufgabe.
 * @param {name } columnName name of the actual Column
 */
function startDragging(id, columnName) {
    currentDraggedElement = id;
    startStatusColumn = columnName;

    const original = document.getElementById("toDo" + id);
    if (!original) return;

    original.classList.add("dragging");
    original.style.setProperty("--task-transform", "rotate(5deg)");
}

/**
 * Stops dragging and resets the dragged element's style.
 * @param {string} id - Task ID.
 */
function stopDragging(id) {
    const original = document.getElementById("toDo" + id);
    if (!original) return;

    original.classList.remove("dragging");
    original.style.removeProperty("--task-transform");
}

/**
 * Erlaubt das Ablegen eines Elements im Drop-Bereich.
 * @param {DragEvent} ev - Das DragEvent-Objekt.
 */
function allowDrop(ev, columnId) {
    ev.preventDefault();
    const container = document.getElementById(columnId);
    const tasks = [...container.querySelectorAll(".todo:not(.dragging)")];
    let index = tasks.length;
    const y = ev.clientY ?? ev.touches?.[0]?.clientY;
    for (let i = 0; i < tasks.length; i++) {
        const rect = tasks[i].getBoundingClientRect();
        if (y < rect.top + rect.height / 2) { index = i; break; }
    }
    desiredPos = index;
    const preview = document.getElementById("Preview-" + columnId);
    if (preview) container.insertBefore(preview, tasks[index] || null);
    preview.style.display = "block";
}

/**
 * Verschiebt die aktuell gezogene Aufgabe in eine neue Kategorie.
 * @param {string} targetColumn - Die Zielkategorie
 */
async function moveTo(targetColumn, ev) {
    ev.preventDefault();
    const idx = todos.findIndex(t => t.id == currentDraggedElement);
    if (idx === -1) return;
    todos[idx].status = targetColumn;
    todos[idx].pos = desiredPos ?? todos.filter(t => t.status === targetColumn).length;
    normalizePositions(targetColumn);
    await putData('tasks/' + todos[idx].id, todos[idx]);
    desiredPos = null;
    updateHTML();
}


function normalizePositions(status) {
    const arr = todos.filter(t => t.status === status).sort((a, b) => a.pos - b.pos);
    arr.forEach((t, i) => { t.pos = i; boardPos[status][t.id] = i; putData('tasks/' + t.id, t); });
}



function renderTaskPreview(event) {
    const targetColumn = event.currentTarget.id;
    const TASK_ID = document.getElementById("toDo" + currentDraggedElement);
    const previewElement = document.getElementById("Preview-" + targetColumn);

    if (targetColumn == startStatusColumn) { return; }

    if (previewElement && TASK_ID) {
        previewElement.style.display = "block";
        previewElement.style.height = TASK_ID.offsetHeight + "px";
    }
}

function removePreview(columnId, ev) {
    const container = document.getElementById(columnId);

    if (ev.relatedTarget && container.contains(ev.relatedTarget)) {
        return;
    }

    const preview = container.querySelector(".previewTask");
    if (preview) preview.style.display = "none";

    container.classList.remove("drag-area-highlight");
}

function closeDialog() {
    dialogBoardTaskRev.dialog.close();
    getCssTheme('');
}

document.addEventListener("DOMContentLoaded", () => {
    onloadFuncBoard();
});