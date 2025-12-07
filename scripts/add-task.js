/**
 * Set of contacts assigned to the current task.
 * Stores unique contact identifiers (e.g., email addresses).
 */
let selectedContacts = new Set();

/**
 * Loads contacts from the server and initializes the due date input.
 * Ensures the due date cannot be set to a past date.
 * Renders the active user avatar
 * @async
 */
window.onload = async () => {
  await createArrayOfContacts();
  setDateStart();
  renderActiveAvatar();
};


/**
 * Collects and returns the current task input values from the form.
 * Extracts title, description, due date, priority, assigned contacts, category, and subtasks.
 *  @function getTaskInput
 * @returns {Object} Task object containing the following properties:
 * @returns {string} return.title - The task title entered by the user.
 * @returns {string} return.description - The task description entered by the user.
 * @returns {string} return.date - The due date for the task (formatted as string).
 * @returns {string|null} return.priority - The selected priority level ("urgent", "medium", "low"), or null if none selected.
 * @returns {string[]} return.assignedTo - Array of contact identifiers (e.g., email addresses) assigned to the task.
 * @returns {string} return.category - The selected category label for the task.
 * @returns {string[]} return.subtasks - Array of subtasks, each represented as a trimmed string. 
 */
function getTaskInput() {
  const subtaskElements = document.querySelectorAll('#subtask_list .subtask-text');
  const subtasks = Array.from(subtaskElements).map((el, index) => {
    return { task: el.textContent.trim() };
  });
  return {
    title: document.getElementById("task_title").value.trim(),
    description: document.getElementById("task_description").value.trim(),
    date: document.getElementById('due_date').value.trim(),
    priority: selectedPriority,
    assignedTo: Array.from(selectedContacts),
    category: document.getElementById("selected_category").textContent.trim(),
    subtasks: subtasks
  };
}

/**
 * Contols the date a user can select from the calender
 * Ensures that users cannot select a past date by setting the minimum value
 * to today's date in ISO format (YYYY-MM-DD).
 * @returns {void} This function does not return a value.
 */
function setDateStart() {
  const dueDateInput = document.getElementById("due_date");
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  dueDateInput.setAttribute("min", todayISO);
};


/**
 * Clears all task input fields and resets form state.
 * Calls helper functions to reset fields, priority visuals, and subtasks.
 */
function clearTaskInput() {
  resetBasicFields();
  resetCheckboxesAndPriorityVisuals();
  resetAllSubtasks();
}

/**
 * Resets basic task form fields to their default values.
 * Clears text inputs, category, contact icons, and selected contacts.
 */
function resetBasicFields(){
  document.getElementById("task_title").value = "";
  document.getElementById("task_description").value = "";
  document.getElementById("due_date").value = "";
  document.getElementById("assigned_to").value = "";
  document.getElementById("contact_icons").innerHTML = "";
  document.getElementById("selected_category").textContent = "Select task category";
  document.getElementById("subtask").value = "";
  selectedContacts.clear();
}

/**
 *  Clears all subtasks from the subtask list.
 */
function resetAllSubtasks(){
  const subtaskList = document.getElementById("subtask_list");
  subtaskList.innerHTML = "";
}

/**
 * Checks if a task object has the required fields.
 * Validates title, date, and category.
 * @param {Object} task - The task object to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function checkIfTaskIsValid(task) {
  if (!task.title) {
    return false;
  }
  if (!task.date) {
    return false;
  }
  if (!task.category) {
    return false;
  }
  return true;
}

/**
 * Redirects the user to the board page once the task has been added to FireBase
 */
function redirectUser(){
  let container = document.getElementById('overlay_container');
  container.innerHTML = getRedirectTemplate();
  setTimeout(() => {
    window.location.href = './board.html'
  }, 1500);
}


/**
 * Shows the avatars of selected contacts.
 * Clears the contact area and adds an icon with initials for each contact that has been chosen.
 */
function showContactAvatar() {
  let container = document.getElementById("contact_icons");
  container.innerHTML = "";
  joinContacts.forEach((contact) => {
    if (selectedContacts.has(contact.mail)) {
      let initials = getUserItem(contact.name);
      container.innerHTML += getContactAvatar(contact, initials);
    }
  });
}

/**
 * Adds a new subtask to the list.
 * Takes the text from the input field, creates a new item, clears the input, and resets the field state.
 */
function addSubtask(){
  let input = document.getElementById('subtask');
  let list = document.getElementById('subtask_list');
  let inputValue = input.value.trim();
  if (inputValue !== '') {
    list.innerHTML += getAddedTasks(inputValue);
    input.value = '';
  }
  clearSubtaskInput();
}

/**
 * Clears the subtask input field.
 * Empties the text box and turns off the active state.
 */
function clearSubtaskInput() {
  let input = document.getElementById('subtask');
  input.value = '';
  deactivateSubtask();
}

/**
 * Deletes a subtask from the list.
 * Removes the chosen subtask item and its paired edit item if present.
 * @param {HTMLElement} button - The delete button inside the subtask item.
 */
function deleteAddedSubtask(button){
  let li = button.closest('li');
  if (li.classList.contains('subtask-list')) {
    let editLi = li.nextElementSibling;
    li.remove();
    if (editLi && editLi.classList.contains('subtask-edit-list')) {
      editLi.remove();
    }
  }
  else if (li.classList.contains('subtask-edit-list')) {
    let normalLi = li.previousElementSibling;
    li.remove();
    if (normalLi && normalLi.classList.contains('subtask-list')) {
      normalLi.remove();
    }
  }
}

/**
 * Switches a subtask into edit mode.
 * Hides the normal view, shows the editable field,
 * copies the current text into it, and places the cursor at the end.
 * @param {HTMLElement} button - The edit button inside the subtask item.
 */
function openEditingEnvironment(button){
  let normalLi = button.closest('.subtask-list');
  let editLi = normalLi.nextElementSibling;
  let textSpan = normalLi.querySelector('.subtask-text');
  let editSpan = editLi.querySelector('.subtask-edit');
  editSpan.textContent = textSpan.textContent;
  normalLi.classList.add('d-none');
  editLi.classList.remove('d-none');
  editSpan.focus();
  placeCaretAtEnd(editSpan);
}

/**
 * Moves the text cursor to the end of an editable element.
 * Ensures the user can continue typing after the existing text.
 * @param {HTMLElement} el - The editable element where the cursor should be placed.
 */
function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
    && typeof document.createRange != "undefined") {
    let range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * Saves changes made to a subtask.
 * Copies the edited text back into the normal subtask view,
 * hides the edit field, and shows the updated subtask item.
 * @param {HTMLElement} button - The save button inside the edited subtask item.
 */
function saveEditedSubtask(button){
  let editLi = button.closest('.subtask-edit-list');
  let normalLi = editLi.previousElementSibling;
  let editSpan = editLi.querySelector('.subtask-edit');
  let textSpan = normalLi.querySelector('.subtask-text');
  textSpan.textContent = editSpan.textContent;
  editLi.classList.add('d-none');
  normalLi.classList.remove('d-none');
}