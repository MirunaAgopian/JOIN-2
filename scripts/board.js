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

//########################### Rendering #######################
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
 * render all task to related task/Board column
 * @param {string} status - Categorie .
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
 * Generate HTML Tag for every task in board.
 * @param {Object} todo Task Object.
 * @param {String} status Status bzw Colum of the board
 * @returns {string} HTML-Tag.
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
 * render the button for the overlay move display in mobile view
 * @param {String} todoId Database ID of the selected Task
 * @param {String} targetStatus Status bzw Colum of the target
 * @param {String} icon icon for the button (up or down)
 * @param {String} altText alternative Text for the button Image
 * @returns {String} html tag for the button
 */
function renderMoveButton(todoId, targetStatus, icon, altText) {
    return `<p class="boardMoveToButtonContent"
        onclick="event.stopPropagation(); changeBoardStatus('${todoId}', '${targetStatus}')">
        <img src="../assets/img/${icon}" alt="${altText}">
        ${getMobileDisplayMoveStatus(targetStatus)}
    </p>`;
}

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

/**
 * generate the html Tag for the Progress Bar of an Subtask for an task
 * @param {Object} subtasks 
 * @returns the render html Tag of the Progress
 */
function setProgress(subtasks) {
    if (subtasks == null) { return ""; }
    let subTotal = subtasks.length;
    let subDone = getSubTaskDone(subtasks); //"1";


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

//################### Dialog Handling ####################
/**
 * Shows the dialog to create a new task.
 * @param {string} column - The name of the column (status) where the task will be created.
 */
function showDialogAddTask(column) {
    clearTaskInput();
    getCssTheme('cssAddTask');
    document.getElementById('btnDialogLeftContent').innerHTML = "Cancel";
    document.getElementById("btnDialogLeft").onclick = closeDialog;
    document.getElementById('btnDialogRightContent').innerHTML = "Create Task";
    document.getElementById("btnDialogRight").onclick = addDialogTask;
    dialogBoardTaskRev.dialog.showModal();
    startStatusColumn = column;
}

/**
 * Shows the dialog with the values of the selected task.
 * @param {string} id - The ID of the task in the database.
 */
function showDialogTask(id) {
    isShowTaskActive = true;

    actualToDo = todos.find(t => t.id === id);

    getCssTheme('cssShowTask');

    clearTaskInput();

    currentDraggedElement = id;
    dialogBoardTaskRev.dialog.showModal();
    dialogBoardTaskRev.task_title.value = actualToDo.title;
    dialogBoardTaskRev.task_description.value = actualToDo.description;
    // autoResizeTextarea(dialogBoardTaskRev.task_description);
    dialogBoardTaskRev.due_date.value = actualToDo.date;

    getAllSubtask(actualToDo.subtasks);

    changeDOMIfShowTaskIsOpen(actualToDo);

    selectedPriority = actualToDo.priority;
    document.getElementById("taskPriority").innerHTML = `${actualToDo.priority} <img src="../assets/img/prio_${actualToDo.priority}.svg" alt="Prirority of task">`;

    document.getElementById("taskCategory").innerHTML = `<div class="taskStatus ${actualToDo.category.toLowerCase().replace(/ /g, "-")}">${actualToDo.category}</div>`;
    document.getElementById('selected_category').textContent = actualToDo.category;


    document.getElementById('btnDialogLeftContent').innerHTML = "Delete";
    document.getElementById("btnDialogLeft").onclick = deleteTask;
    document.getElementById('btnDialogRightContent').innerHTML = "Edit";
    document.getElementById("btnDialogRight").onclick = showDialogEdit;

    document.getElementById('btn_delete_task').onclick = deleteTask;
    document.getElementById('btn_edit_task').onclick = showDialogEdit;

    getAssignedUser();
}

/** 
 * Switches the dialog into edit mode for the currently selected task.
 */
function showDialogEdit() {
    isShowTaskActive = false;
    changeDOMIfShowTaskIsOpen(actualToDo);
    getCssTheme('cssEditTask');
    document.getElementById('btnDialogLeftContent').innerHTML = "OK";
    document.getElementById("btnDialogLeft").onclick = editDialogTask;
}

/** close the dialog and re render the board */
function closeDialog() {
    isShowTaskActive = false;
    changeDOMIfShowTaskIsOpen(actualToDo);
    dialogBoardTaskRev.dialog.close();
    getCssTheme('');
    onloadFuncBoard();
}

//################### Subtasks ###################
/**
 * Renders all subtasks of the selected task into the dialog.
 * @param {Array<Object>} subtasks - Array of subtasks belonging to the selected task.
 */
function getAllSubtask(subtasks) {
    if (subtasks == null) { return; }

    for (let index = 0; index < subtasks.length; index++) {
        addNewSubtask(subtasks[index].task, index);
    }
}

/**
 * Creates and appends a new subtask list item in the dialog.
 * @param {string} text - The text of the subtask.
 * @param {number} index - The index of the subtask in the array.
 */
function addNewSubtask(text, index) {
    const list = document.getElementById("subtask_list");

    const li = document.createElement("li");
    li.classList.add("subtask-list");

    li.innerHTML = `
    <input id="subtask_${index}" type="checkbox" onchange="updateSubTask(${index})" ${actualToDo.subtasks[index].checked ? "checked" : ""} class="subtask-checkbox"
    style="display:block;">
    <div id="checkbox_${index}" class="checkbox-container" onclick="controlCheckbox(${index})" style="display:block;"></div>
    <span class="subtask-text">${text}</span>
    <div class="subtask-element-img-wrapper">
      <button onclick="openEditingEnvironment(this)" class="subtask-edit-btn" title="Edit"></button>
      <div class="subtask-btn-divider-secondary"></div>
      <button onclick="deleteAddedSubtask(this)" class="subtask-delete-btn" title="Delete"></button>
    </div>
  `;

    const editLi = document.createElement("li");
    editLi.classList.add("subtask-edit-list", "d-none");
    editLi.innerHTML = `
      <span class="subtask-edit" contenteditable="true"></span>
      <div class="subtask-edit-btn-wrapper">
        <button onclick="deleteAddedSubtask(this)" class="subtask-delete-btn-secondary" title="Delete"></button>
        <div class="subtask-btn-divider-tertiary"></div>
        <button onclick="saveEditedSubtask(this)" class="subtask-save-btn" title="Save"></button>
      </div>
    `;

    list.appendChild(li);
    list.appendChild(editLi);
}

/**
 * update the Status of Subtask by clicking Checkbox
 * @param {Integer} index Array Index of Subtask
 */
async function updateSubTask(index) {
    let taskStatus = null;

    if ("checked" in actualToDo.subtasks[index]) {
        taskStatus = !actualToDo.subtasks[index].checked;
    } else {
        taskStatus = true;
    }

    await patchData(`tasks/${currentDraggedElement}/subtasks/${index}`, { checked: taskStatus });
    actualToDo.subtasks[index].checked = taskStatus;
}

/**
 * get all number of done Subtasks for the selcted Task
 * @param {Array} subtasks all Subtasks of the selected Task
 * @returns {Integer} the number of subtasks which are done
 */
function getSubTaskDone(subtasks) {
    let doneTask = 0;

    for (let index = 0; index < subtasks.length; index++) {
        const subtask = subtasks[index];

        if (subtask && "checked" in subtask && subtask.checked === true) {
            doneTask++;
        }
    }

    return doneTask;
}

/**
 * get Array of actual status of all subtaks of the actual Task
 * @param {Array} subtasks all Subtask of the actual Task
 * @returns {Array} Status of Subtasks
 */
function getSubtaskStatus(subtasks) {
    if (subtasks == null) {
        return null;
    }

    let subtaskStatus = [];

    for (let index = 0; index < subtasks.length; index++) {
        const subtask = subtasks[index];
        subtaskStatus[index] = !!(subtask && "checked" in subtask && subtask.checked === true);
    }

    return subtaskStatus;
}

/**
 * Renders all assigned users of the current task into the dialog.
 */
function getAssignedUser() {
    let contactRev = document.getElementById('contact_icons');
    let output = "";

    if (actualToDo.assignedTo.length == null) { return; }

    for (let index = 0; index < actualToDo.assignedTo.length; index++) {
        selectedContacts.add(actualToDo.assignedTo[index]);
        const contact = contactUser[actualToDo.assignedTo[index]];
        if (!contact) continue;

        output += renderAssignedUser(contact);
    }

    contactRev.classList.remove('d-none');
    contactRev.innerHTML = output;
}

/**
 * Renders all assigned users of the current task into the dialog.
 * @param {Object} contact name and color of the actual Contact
 * @returns html Tag of the actual contact
 */
function renderAssignedUser(contact) {

    return `<div class="assignedUser">
                <div class="contactAvater" style="background-color:${contact.color}"> 
                    ${getUserItem(contact.name)} </div>
                    <div class="userName">${contact.name}</div>
                </div>`;
}

//################ Mobile Move Overlay ###############
/**
 * Renders the overlay with possible move actions for a task in mobile view.
 * @param {Object} todo - The task object from the database.
 * @param {string} status - The current status column of the task.
 * @returns {string} HTML markup for the move overlay.
 */
function renderMobileMoveAction(todo, status) {
    let output = "";
    let moveTasks = getMobileDisplayMoveStatusColumn(status);
    output = `<div class="boardMoveToOverlay" onclick="event.stopPropagation()">
                <p class="boardMoveToHeadline onlyMobile">Move To</p>
                <div class="boardMoveToOverlayButtons">`;
    if (moveTasks.moveTaskUp != null) {
        output += renderMoveButton(todo.id, moveTasks.moveTaskUp, "arrow_upward.svg", "arrow up");
    }
    if (moveTasks.moveTaskDown != null) {
        output += renderMoveButton(todo.id, moveTasks.moveTaskDown, "arrow_downward.svg", "arrow down");
    }
    output += `</div></div>`;
    return output;
}

/**
 * Changes the status (column) of a task via the mobile overlay menu.
 * @param {string} id - The ID of the task in the database.
 * @param {string} targetColumn - The target column where the task will be moved.
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

//############## Task Actions ####################
/**
 * Creates a new task from dialog input and saves it to the database.
 */
async function addDialogTask() {
    let task = getTaskInput();
    if (!checkIfTaskIsValid(task)) { return; }
    task.status = startStatusColumn;
    dialogBoardTaskRev.dialog.close()
    uploadTaskToFirebase("tasks", task)
        .then((res) => {
            console.log("Task uploaded with ID:", res.name);
            clearTaskInput();
        })
        .catch((err) => {
            console.error("Upload failed:", err);
        });
    addTaskOverlay();
    onloadFuncBoard();
}

/**
 * overlay with information that task have been created
 */
function addTaskOverlay() {
    let container = document.getElementById('overlay_container');
    container.innerHTML = getRedirectTemplate();
    setTimeout(() => {
        container.innerHTML = '';
    }, 1500);
}

/**
 * Updates the currently selected task with dialog input and saves changes to the database.
 */

async function editDialogTask() {
    let task = getTaskInput();
    let subtaskStatus = getSubtaskStatus(actualToDo.subtasks);

    if (!checkIfTaskIsValid(task)) { return; }
    if (subtaskStatus != null) {
        for (let index = 0; index < subtaskStatus.length; index++) {
            task.subtasks[index].checked = subtaskStatus[index];
        }
    }
    dialogBoardTaskRev.dialog.close()
    await patchData('tasks/' + currentDraggedElement, task);
    onloadFuncBoard();
}

/**
 * Deletes the currently selected task from the database, closes the dialog, and refreshes the board.
 */
async function deleteTask() {
    await deleteData(`/tasks/${currentDraggedElement}`);

    closeDialog();
    onloadFuncBoard();
}

/**
 * Returns the possible move directions (up/down) for a task based on its current status column.
 * @param {string} status - The current status column of the task.
 * @returns {Object} An object with properties moveTaskUp and moveTaskDown.
 */
function getMobileDisplayMoveStatusColumn(status) {
    switch (status) {
        case 'boardToDo':
            return { moveTaskUp: null, moveTaskDown: 'boardProgress' }
        case 'boardProgress':
            return { moveTaskUp: 'boardToDo', moveTaskDown: 'boardFeedback' }
        case 'boardFeedback':
            return { moveTaskUp: 'boardProgress', moveTaskDown: 'boardDone' }
        case 'boardDone':
            return { moveTaskUp: 'boardFeedback', moveTaskDown: null }
    }
}

/**
 * Returns the display name of a status column for use in the mobile move overlay.
 * @param {string} status - The technical name of the status column.
 * @returns {string} The human-readable display name.
 */
function getMobileDisplayMoveStatus(status) {
    switch (status) {
        case 'boardToDo':
            return 'To Do'
        case 'boardProgress':
            return 'Progress'
        case 'boardFeedback':
            return 'Feedback'
        case 'boardDone':
            return 'Done'
    }
}

//############## Drag & Drop ###############
/**
 * Sets the global value for the currently dragged task and applies a rotation style.
 * @param {string} id - The ID of the dragged task.
 * @param {string} columnName - The name of the column the task originates from.
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
 * Allows dropping a task into a column and shows a preview placeholder.
 * @param {DragEvent} ev - The drag event object.
 * @param {string} columnId - The ID of the target column.
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
 * Moves the currently dragged task into a new column.
 * @param {string} targetColumn - The target column name.
 * @param {Event} ev - The drop event.
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

/**
 * Normalizes the positions of tasks within a column after a move.
 * @param {string} status - The status column to normalize.
 */
function normalizePositions(status) {
    const arr = todos.filter(t => t.status === status).sort((a, b) => a.pos - b.pos);
    arr.forEach((t, i) => { t.pos = i; boardPos[status][t.id] = i; putData('tasks/' + t.id, t); });
}

/**
 * Displays a preview placeholder when a task is dragged into another column.
 * @param {Event} event - The drag event.
 */
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

/**
 * Removes the preview placeholder when a task is no longer dragged over a column.
 * @param {string} columnId - The ID of the column.
 * @param {Event} ev - The related event.
 */
function removePreview(columnId, ev) {
    const container = document.getElementById(columnId);

    if (ev.relatedTarget && container.contains(ev.relatedTarget)) {
        return;
    }

    const preview = container.querySelector(".previewTask");
    if (preview) preview.style.display = "none";

    container.classList.remove("drag-area-highlight");
}

//################### Bootstrap ################
document.addEventListener('click', () => {
    document.querySelectorAll('.boardMoveToOverlay').forEach(overlay => {
        overlay.style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    onloadFuncBoard();
});

//##############  utility functions ######################
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

/** Manage the size of the textarea of the description for showTask in Dialog */
function autoResizeTextarea(element) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + 3 + "px";
}