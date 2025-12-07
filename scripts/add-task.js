/**
 * Currently selected priority level for a task.
 * Possible values: "urgent", "medium", "low", or null if none selected.
 */
let selectedPriority = 'medium';

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
 * Sets the color according to the priority of the task
 * Visual styles (low = green, medium = orange, urgent = red) are applied via CSS.
 * By default, the priority is set to medium
 * @param {HTMLElement} element - The clicked priority container element.
 * @returns {void}
 */
function setPrioColor(element) {
  const containers = document.querySelectorAll(".txt-img");
  containers.forEach((c) => {
    c.classList.remove("active");
    const icon = c.querySelector(".prio-img");
    if (icon) icon.classList.remove("active");
  });
  element.classList.add("active");
  const clickedIcon = element.querySelector(".prio-img");
  if (clickedIcon) clickedIcon.classList.add("active");
  selectedPriority = selectPriority(element);
}

/**
 * Determines the priority level based on the CSS class of the given element.
 *
 * @param {HTMLElement} element - The priority element containing a class ("urgent", "medium", or "low").
 * @returns {string} The priority level ("urgent", "medium", or "low").
 */
function selectPriority(element) {
  if (element.classList.contains("urgent")) {
    return "urgent";
  } else if (element.classList.contains("medium")) {
    return "medium";
  } else {
    return "low";
  }
}

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
 * This function hughlights the input field once an user has cliked on it
 * if the user does not type something in the required input field an alert is being added
 * the alert state and non-alert state are being styled via CSS classes
 * @param {FocusEvent} event - The focus event triggered when the user clicks on an input field.
 */
function handleFocus(event){
  let fieldDescription = event.target.closest('.field-description');
  let alertContainer = fieldDescription.querySelector('.alert-container');
  alertContainer.innerHTML = getAlert();
  fieldDescription.classList.add('alert');
}

/**
 * Validates user input in a form field and updates its visual state.
 * When the user types into a required input field:
 * - If the field contains a text, the alert message is removed and the field is marked as active.
 * - If the field is empty, an alert message is displayed and the field is marked with an alert state.
 * Both states are styled via CSS classes.
 * @param {InputEvent} event - The input event triggered when the user types into a form field.
 */
function handleInput(event){
  let fieldDescription = event.target.closest('.field-description');
  let alertContainer = fieldDescription.querySelector('.alert-container');
  if (event.target.value.trim() !== '') {
    alertContainer.innerHTML = '';
    fieldDescription.classList.remove('alert');
    fieldDescription.classList.add('active');
  } else {
    alertContainer.innerHTML = getAlert();
    fieldDescription.classList.remove('active');
    fieldDescription.classList.add('alert');
  }
}

/**
 * Removes the CSS styling of the input field once the user has left the input field
 * @param {FocusEvent} event - The blur event triggered when the user leaves a form field.
 */
function handleBlur(event){
  let fieldDescription = event.target.closest('.field-description');
  let alertContainer = fieldDescription.querySelector('.alert-container');
  alertContainer.innerHTML = '';
  fieldDescription.classList.remove('alert', 'active');
}

/**
 * Toggles the active state of the task description textarea.
 * Adds or removes the "active" CSS class.
 * @param {boolean} isActive - Whether the textarea should be marked as active.
 */
function handleTextarea(isActive){
  let textarea = document.getElementById('task_description');
  if (isActive) {
    textarea.classList.add('active');
  } else {
    textarea.classList.remove('active');
  }
}

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
 * Resets all checkboxes and priority visuals.
 * Restores default priority to "medium".
 */
function resetCheckboxesAndPriorityVisuals(){
  document.querySelectorAll(".checkbox.checked").forEach(cb => cb.classList.remove("checked"));
  document.querySelectorAll(".txt-img").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".prio-img").forEach(icon => icon.classList.remove("active"));
  const mediumContainer = document.querySelector(".txt-img.medium");
  const mediumIcon = document.querySelector(".medium-img.prio-img");
  if (mediumContainer && mediumIcon) {
    mediumContainer.classList.add("active");
    mediumIcon.classList.add("active");
    selectedPriority = "medium";
  }
}

/**
 *  Clears all subtasks from the subtask list.
 */
function resetAllSubtasks(){
  const subtaskList = document.getElementById("subtask_list");
  subtaskList.innerHTML = "";
}

/**
 * Adds a new task if valid.
 * Collects input, validates, uploads to Firebase, clears the form, and redirects the user to the board page.
 */
function addTask() {
  let task = getTaskInput();
  if (!checkIfTaskIsValid(task)) {
    return;
  }
  tasks.push(task);
  uploadTaskToFirebase("tasks", task)
    .then((res) => {
      console.log("Task uploaded with ID:", res.name);
      clearTaskInput();
    })
    .catch((err) => {
      console.error("Upload failed:", err);
    });
  redirectUser();
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
 * Retrieves the logged-in user from session storage and sorts contacts.
 * Ensures the logged-in user appears first in the list.
 * @returns {{loggedInUser: Object|null, sortedContacts: Object[]}}
 * An object containing the logged-in user (or null) and the sorted contacts array.
 */
function checkForLoggedInUser() {
  const userData = sessionStorage.getItem("loggedInUser");
  const loggedInUser = userData ? JSON.parse(userData) : null;
  const sortedContacts = [...joinContacts].sort((a, b) => {
    if (loggedInUser && a.mail === loggedInUser.mail) return -1;
    if (loggedInUser && b.mail === loggedInUser.mail) return 1;
    return 0;
  });

  return { loggedInUser, sortedContacts };
}

/**
 * Toggles the contact list via CSS classes, making it visible or hidden
 * it also adds visuals to the dropdown arrow in the input
 */
function toggleContactList() {
  let list = document.getElementById("contact_list");
  let dropdown = document.getElementById("assigned_to");
  let arrow = document.getElementById("dropdown_arrow");
  let icons = document.getElementById("contact_icons");
  list.classList.toggle("d-none");
  dropdown.classList.toggle("active");
  arrow.classList.toggle("active");
  if (list.classList.contains("d-none")) {
    icons.classList.remove("d-none");
  } else {
    icons.classList.add("d-none");
  }
  showContactList();
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
 * Marks or unmarks a contact as selected.
 * Toggles the checkmark on the contact, updates the list of chosen contacts,
 * and refreshes the displayed avatars.
 */
function setCheckMark(element, mail) {
  element.classList.toggle("checked");
  if (element.classList.contains("checked")) {
    selectedContacts.add(mail);
  } else {
    selectedContacts.delete(mail);
  }
  showContactAvatar();
}

/**
 * Opens or closes the category list.
 * Switches the dropdown and arrow on or off and shows a placeholder text when the list is opened.
 */
function toggleCategories(){
  let list = document.getElementById('category_list');
  let arrow = document.getElementById('category_dropdown_arrow');
  let dropdown = document.getElementById('category_dropdown');
  let placeholder = document.getElementById('selected_category');
  list.classList.toggle('d-none');
  arrow.classList.toggle('active');
  dropdown.classList.toggle('active');
  if (!list.classList.contains('d-none')) {
    placeholder.textContent = 'Select task category';
  }
}

/**
 * Chooses a category from the list.
 * Updates the placeholder text with the chosen category and then closes the dropdown.
 *  @param {HTMLElement} item - The category element that was clicked,
 * containing the text to display as the selected category.
 */
function selectCategory(item){
  let placeholder = document.getElementById('selected_category');
  placeholder.textContent = item.textContent;
  toggleCategories();
}

/**
 * Turns on the subtask input area.
 * Highlights the field and shows the action buttons.
 */
function activateSubtask() {
  document.getElementById('subtask').classList.add('active');
  document.getElementById('subtask_actions').classList.add('active');
}

/**
 * Turns off the subtask input area.
 * Removes the highlight and hides the action buttons, unless the user is still clicking inside the actions area.
 * @param {FocusEvent} event - The blur event when leaving the subtask field.
 */
function deactivateSubtask(event) {
  if (event && event.relatedTarget && event.relatedTarget.closest('#subtask_actions')) {
    return;
  }
  document.getElementById('subtask').classList.remove('active');
  document.getElementById('subtask_actions').classList.remove('active');
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