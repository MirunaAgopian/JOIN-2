/**
 * Currently selected priority level for a task.
 * Possible values: "urgent", "medium", "low", or null if none selected.
 */
let selectedPriority = 'medium';

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
 * Toggles the contact list via CSS classes, making it visible or hidden
 * it also adds visuals to the dropdown arrow in the input
 */

function toggleContactList() {
  const list = document.getElementById("contact_list");
  const dropdown = document.getElementById("assigned_to");
  const arrow = document.getElementById("dropdown_arrow");
  const icons = document.getElementById("contact_icons");

  list.classList.toggle("d-none");
  dropdown.classList.toggle("active");
  arrow.classList.toggle("active");
  icons.classList.toggle("d-none", !list.classList.contains("d-none"));

  if (!list.classList.contains("d-none")) {
    setTimeout(() => document.addEventListener("click", outsideClick));
  } else {
    document.removeEventListener("click", outsideClick);
  }
  showContactList();
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
  if (!list.classList.contains("d-none")) {
    placeholder.textContent = "Select task category";
    setTimeout(() => document.addEventListener("click", outsideClick));
  } else {
    document.removeEventListener("click", outsideClick);
  }
}

/**
 * This function closes the dropdwon whenever the user clicks outside it
 * @param {MouseEvent} e - The click event triggered when the user clicks anywhere on the page. 
 */

function outsideClick(e) {
  const contactList = document.getElementById("contact_list");
  const contactDropdown = document.getElementById("assigned_to");
  const categoryList = document.getElementById("category_list");
  const categoryDropdown = document.getElementById("category_dropdown");
  if (contactList && !contactList.classList.contains("d-none")) {
    if (!contactList.contains(e.target) && !contactDropdown.contains(e.target)) {
      toggleContactList();
    }
  }
  if (categoryList && !categoryList.classList.contains("d-none")) {
    if (!categoryList.contains(e.target) && !categoryDropdown.contains(e.target)) {
      toggleCategories();
    }
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