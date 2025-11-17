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
let boardColumMoves = {
    enter: "",
    leave: ""
}

async function onloadFuncBoard() {
    const ALL_TASKS = await getAllUsers('tasks');
    todos = getTaskArr(ALL_TASKS);

    const ALL_USER = await getAllUsers("contacts");
    contactUser = getUserData(ALL_USER);

    updateHTML();
    renderActiveAvatar();
}

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



function renderActiveAvatar() {
    const storedUserName = JSON.parse(sessionStorage.getItem('loggedInUser'))?.name;
    const avatarRev = document.getElementById("activeAvatar");

    // check if everything is available
    if (!avatarRev) { return; }

    if (!storedUserName) {
        avatarRev.innerHTML = "G";
        return;
    }

    //generate Avatar
    avatarRev.innerHTML = getUserItem(storedUserName);
}

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

function checkPosition(value, statusValue) {
    if (value.hasOwnProperty("pos")) {
        return value.pos;
    }
    else {
        return Object.keys(boardPos[statusValue]).length;
    }
}

function checkStatus(value) {
    if (value.hasOwnProperty("status")) {
        return value.status;
    }
    else {
        return "boardToDo";
    }
}

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
    const filtered = todos.filter(t => t.status === status);

    if (filtered.length != 0) {
        container.innerHTML = ``;
        for (const todo of filtered) {
            container.innerHTML += renderTask(todo);
        }
        container.innerHTML += `<div draggable="false" id="Preview-${status}" class="previewTask" style="display: none; height: 42px;">Preview</div> `;
    } else {
        container.innerHTML = `<div draggable="false" id="noEntry-${status}" class="noEntry">no Entry</div>
        <div draggable="false" id="Preview-${status}" class="previewTask" style="display: none; height: 42px;">Preview</div>`;
    }
}

/**
 * Generiert das HTML für eine einzelne Aufgabe.
 * @param {{id: number, title: string, category: string}} todo - Das Aufgabenobjekt.
 * @returns {string} - Das HTML-Element als String.
 */
function renderTask(todo) {
    return `<div draggable="true" id="toDo${todo.id}" ondragstart="startDragging('${todo.id}', '${todo.status}')" ondragend="stopDragging('${todo.id}')" class="todo">
                <div class="taskStatus ${todo.category}">${todo.category}</div>
                <div class="taskTitle"> ${todo.title}</div>
                <div class="taskDescription"> ${todo.description}</div>
                <div class="subtasks"> ${todo.subtasks}</div>
                <div class="taskFooter">
                    ${assignedUserAvatar(todo.assignedTo)} <img src="../assets/img/prio_${todo.priority}.svg">
                </div>
            </div>`;
}

function assignedUserAvatar(user) {
    if (user == null) return "";

    const users = Array.isArray(user) ? user : [user];

    let output = `<div class="AvatarArray">`;
    for (let i = 0; i < users.length; i++) {
        const contact = contactUser[users[i]];
        if (!contact) continue; // falls kein Eintrag vorhanden ist

        output += `<div class="contactAvater" style="background-color:${contact.color}"> 
                      ${getUserItem(contact.name)} 
                   </div>`;
    }
    output += "</div>";
    return output;
}

/**
 * Setzt die aktuell gezogene Aufgabe anhand ihrer ID.
 * @param {number} id - Die ID der gezogenen Aufgabe.
 */
function startDragging(id, columnName) {
    currentDraggedElement = id;
    startStatusColumn = columnName;

    const original = document.getElementById("toDo" + id);
    if (!original) return;

    // Unsichtbar machen (falls gewünscht)
    //original.classList.add("hideTaskContent");

    // NEU: Rotation um 5°
    original.classList.add("dragging");
    original.style.setProperty("--task-transform", "rotate(5deg)");
}

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
function allowDrop(ev, id) {
    ev.preventDefault();
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Verschiebt die aktuell gezogene Aufgabe in eine neue Kategorie.
 * @param {string} targetColumn - Die Zielkategorie
 */
async function moveTo(targetColumn) {
    const taskIndex = todos.findIndex(t => t.id == currentDraggedElement);
    if (taskIndex !== -1) {
        // Status im Array ändern
        todos[taskIndex].status = targetColumn;

        // Datenbank aktualisieren
        await putData('tasks/' + todos[taskIndex].id, todos[taskIndex]);

        // Frontend neu rendern
        updateHTML();
    }
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

function removePreview(columnId) {
    const container = document.getElementById(columnId);
    const preview = container.querySelector(".previewTask");
    boardColumMoves.leave = columnId;
    return;
    if (preview) {
        preview.remove();
    }

    // Optional: Highlight entfernen
    container.classList.remove("drag-over");
}