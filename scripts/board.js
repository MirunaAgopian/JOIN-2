let todos = [];
let currentDraggedElement = null;
let contactUser = {};
let startStatusColumn = "";


async function onloadFuncBoard() {

    const ALL_TASKS = await getAllUsers('tasks');
    todos = getTaskArr(ALL_TASKS);

    const ALL_USER = await getAllUsers("contacts");
    contactUser = getUserData(ALL_USER);

    updateHTML();
}

function getTaskArr(usersObj) {
    const arr = [];

    for (const [key, value] of Object.entries(usersObj)) {
        let statusValue = "";
        if (value.hasOwnProperty("status")) {
            statusValue = value.status;
        }
        else {
            statusValue = "boardToDo"
        }

        arr.push({
            id: key,
            title: value.title,
            description: value.description,
            category: value.category,
            date: value.date,
            priority: value.priority,
            subtasks: value.subtasks,
            assignedTo: value.assignedTo,
            status: statusValue
        });
    }

    return arr;
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
    return `<div draggable="true" id="toDo${todo.id}" ondragstart="startDragging('${todo.id}', '${todo.status}')" class="todo">
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

    return;
    const original = document.getElementById("toDo" + id);
    if (!original) return;

    // Unsichtbar machen
    original.classList.add("hideTaskContent");
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

/**
 * Entfernt die visuelle Hervorhebung des Drop-Bereichs.
 * @param {string} id - Die ID des Drop-Bereichs.
 */
function removeHighlight(id) {
    // document.getElementById(id).classList.remove('drag-area-highlight');
    const previewElement = document.getElementById("Preview-" + id);
    //console.log ("remove highlight: " + id);
    //previewElement.style.display = "none";
}

function renderTaskPreview(event) {
    const targetColumn = event.currentTarget.id;
    const TASK_ID = document.getElementById("toDo" + currentDraggedElement);
    const previewElement = document.getElementById("Preview-" + targetColumn);

    if(targetColumn == startStatusColumn){return;}

    if (previewElement && TASK_ID) {
        previewElement.style.display = "block";
        previewElement.style.height = TASK_ID.offsetHeight + "px";
    }
}
