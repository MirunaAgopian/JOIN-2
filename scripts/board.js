let todos = [
    { id: 0, title: 'Putzen</br>abc', category: 'boardToDo', position: 0 },
    { id: 1, title: 'Kochen', category: 'boardToDo', position: 1 },
    { id: 2, title: 'Einkaufen', category: 'boardProgress', position: 0 },
    { id: 3, title: 'Papierkram', category: 'boardDone', position: 0 }
];

let currentDraggedElement = null;

function onloadFuncBoard() {
    updateHTML();
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
 * @param {string} category - Die Kategorie der Aufgaben ('open', 'closed', 'backup').
 */
function renderTodos(category) {
    const container = document.getElementById(category);
    const filtered = todos.filter(t => t.category === category);

    if (filtered.length != 0) {
        container.innerHTML = ``;
        for (const todo of filtered) {
            container.innerHTML += generateTodoHTML(todo);
        }
        container.innerHTML += `<div draggable="false" id="Preview-${category}" class="previewTask" style="display: none; height: 42px;">Preview</div> `;
    } else {
        container.innerHTML = `<div draggable="false" id="noEntry-${category}" class="noEntry">no Entry</div>
        <div draggable="false" id="Preview-${category}" class="previewTask" style="display: none; height: 42px;">Preview</div>`;
    }
}

/**
 * Generiert das HTML für eine einzelne Aufgabe.
 * @param {{id: number, title: string, category: string}} todo - Das Aufgabenobjekt.
 * @returns {string} - Das HTML-Element als String.
 */
function generateTodoHTML(todo) {
    return `<div draggable="true" id="toDo${todo.id}" ondragstart="startDragging(${todo.id})" class="todo">${todo.title}</div>`;
}

/**
 * Setzt die aktuell gezogene Aufgabe anhand ihrer ID.
 * @param {number} id - Die ID der gezogenen Aufgabe.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Erlaubt das Ablegen eines Elements im Drop-Bereich.
 * @param {DragEvent} ev - Das DragEvent-Objekt.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Verschiebt die aktuell gezogene Aufgabe in eine neue Kategorie.
 * @param {string} category - Die Zielkategorie ('open', 'closed', 'backup').
 */
function moveTo(category) {
    if (currentDraggedElement !== undefined) {
        todos[currentDraggedElement].category = category;
        updateHTML();
    }
}

/**
 * Hebt den Drop-Bereich visuell hervor.
 * @param {string} id - Die ID des Drop-Bereichs.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Entfernt die visuelle Hervorhebung des Drop-Bereichs.
 * @param {string} id - Die ID des Drop-Bereichs.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

function renderTaskPreview(event) {
    const targetColumn = event.currentTarget.id;
    const TASK_ID = document.getElementById("toDo" + currentDraggedElement);
    const previewElement = document.getElementById("Preview-" + targetColumn);

    if (previewElement && TASK_ID) {
        previewElement.style.display = "block";
        previewElement.style.height = TASK_ID.offsetHeight + "px";
    }
}
