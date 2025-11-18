let tasks = [];
let selectedPriority = null;
let selectedContacts = new Set();

/**
 * Loads contacts from the server and initializes the due date input.
 * Ensures the due date cannot be set to a past date.
 */
window.onload = async () => {
  await createArrayOfContacts();
  console.log("Contacts loaded:", joinContacts);
  setDateStart();
};

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

function selectPriority(element) {
  if (element.classList.contains("urgent")) {
    return "urgent";
  } else if (element.classList.contains("medium")) {
    return "medium";
  } else {
    return "low";
  }
}

function getTaskInput() {
  const subtaskElements = document.querySelectorAll('#subtask_list .subtask-text');
  const subtasks = Array.from(subtaskElements).map(el => el.textContent.trim());
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

function setDateStart() {
  const dueDateInput = document.getElementById("due_date");
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  dueDateInput.setAttribute("min", todayISO);
};

function getAlert(){
  return `<span class='alert'>This field is required</span>`;
}

function handleFocus(event){
  let fieldDescription = event.target.closest('.field-description');
  let alertContainer = fieldDescription.querySelector('.alert-container');
  alertContainer.innerHTML = getAlert();
  fieldDescription.classList.add('alert');
}

function handleInput(event){
  let fieldDescription = event.target.closest('.field-description');
  let alertContainer = fieldDescription.querySelector('.alert-container');
  if(event.target.value.trim() !== ''){
    alertContainer.innerHTML = '';
    fieldDescription.classList.remove('alert');
    fieldDescription.classList.add('active');
  } else {
    alertContainer.innerHTML = getAlert();
    fieldDescription.classList.remove('active');
    fieldDescription.classList.add('alert');
  }
}

function handleBlur(event){
  let fieldDescription = event.target.closest('.field-description');
  let alertContainer = fieldDescription.querySelector('.alert-container');
  alertContainer.innerHTML = '';
  fieldDescription.classList.remove('alert', 'active');
}

function handleTextarea(isActive){
  let textarea = document.getElementById('task_description');
  if(isActive){
    textarea.classList.add('active');
  } else {
    textarea.classList.remove('active');
  }
}

function clearTaskInput() {
  resetBasicFields();
  resetCheckboxesAndPriorityVisuals();
  resetAllSubtasks();
}

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

function resetAllSubtasks(){
  const subtaskList = document.getElementById("subtask_list");
  subtaskList.innerHTML = "";
}

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

function redirectUser(){
  let container = document.getElementById('overlay_container');
  container.innerHTML = getRedirectTemplate();
  setTimeout(() => {
    window.location.href = './board.html'
  }, 1500);
}

function getRedirectTemplate(){
  return `<div class="add-task-overlay">
            <div class="overlay-img-text">
              <span>Task added to board</span>
              <img class ='board-icon' src="/assets/img/board.svg" alt="the logo of the board tab">
            </div>
          </div>`;
}

async function uploadTaskToFirebase(path = "", task = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  let responseAsJson = await response.json();
  return responseAsJson;
}

function getContactList(contact, initials, isCurrentUser = false) {
   const isChecked = selectedContacts.has(contact.mail);
  return `<li>
              <div class='username'>
                <span class='contact-circle' style='background-color:${
                  contact.color
                }'>${initials}</span>
                <span>${contact.name}${isCurrentUser ? " (You)" : ""}</span> 
              </div>  
                <div onclick='setCheckMark(this, "${contact.mail}")' 
                class='checkbox ${isChecked ? "checked" : ""}'></div>
            </li>`;
}

async function showContactList() {
  let container = document.getElementById("contact_ul");
  container.innerHTML = "";
  const { loggedInUser, sortedContacts } = checkForLoggedInUser();
  sortedContacts.forEach((contact) => {
    let initials = getUserItem(contact.name);
    const isCurrentUser =
      loggedInUser &&
      contact.mail.toLowerCase() === loggedInUser.mail.toLowerCase();
    container.innerHTML += getContactList(contact, initials, isCurrentUser);
  });
}

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

function getContactAvatar(contact, initials) {
  return `<div class="contact-circle" style="background-color:${contact.color}">
              <span>${initials}</span>
          </div>`;
}

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

function setCheckMark(element, mail) {
  element.classList.toggle("checked");

  if (element.classList.contains("checked")) {
    selectedContacts.add(mail);
  } else {
    selectedContacts.delete(mail);
  }

  showContactAvatar();
}


function toggleCategories(){
  let list = document.getElementById('category_list');
  let arrow = document.getElementById('category_dropdown_arrow');
  let dropdown = document.getElementById('category_dropdown');
  let placeholder = document.getElementById('selected_category');
  list.classList.toggle('d-none');
  arrow.classList.toggle('active');
  dropdown.classList.toggle('active');
  if(!list.classList.contains('d-none')){
    placeholder.textContent = 'Select task category';
  }
}

function selectCategory(item){
  let placeholder = document.getElementById('selected_category');
  placeholder.textContent = item.textContent;
  toggleCategories();
}

function activateSubtask() {
  document.getElementById('subtask').classList.add('active');
  document.getElementById('subtask_actions').classList.add('active');
}

function deactivateSubtask(event) {
  if (event && event.relatedTarget && event.relatedTarget.closest('#subtask_actions')) {
    return;
  }
  document.getElementById('subtask').classList.remove('active');
  document.getElementById('subtask_actions').classList.remove('active');
}

function getAddedTasks(text){
  return `<li class="subtask-list">
              <span class='subtask-text'>${text}</span>
              <div class='subtask-element-img-wrapper'>
                <button onclick='openEditingEnvironment(this)' class='subtask-edit-btn' title="Edit"></button>
                <div class='subtask-btn-divider-secondary'></div>
                <button onclick='deleteAddedSubtask(this)' class='subtask-delete-btn' title="Delete"></button>
              </div>
          </li>
          <li class='subtask-edit-list d-none'>
            <span class="subtask-edit" contenteditable='true'></span>
            <div class="subtask-edit-btn-wrapper">
              <button onclick='deleteAddedSubtask(this)' class='subtask-delete-btn-secondary' title="Delete"></button>
              <div class='subtask-btn-divider-tertiary'></div>
              <button onclick='saveEditedSubtask(this)' class="subtask-save-btn" title="save"></button>
            </div>
          </li>`;
}

function addSubtask(){
  let input = document.getElementById('subtask');
  let list = document.getElementById('subtask_list');
  let inputValue = input.value.trim();
  if(inputValue !== '') {
    list.innerHTML += getAddedTasks(inputValue);
    input.value = ''; 
  }
  clearSubtaskInput();
}

function clearSubtaskInput() {
  let input = document.getElementById('subtask');
  input.value = '';
  deactivateSubtask();
}

function deleteAddedSubtask(button){
  let li = button.closest('li');
  if(li.classList.contains('subtask-list')){
    let editLi = li.nextElementSibling;
    li.remove();
    if(editLi && editLi.classList.contains('subtask-edit-list')){
       editLi.remove();
    }
  }
  else if(li.classList.contains('subtask-edit-list')){
    let normalLi = li.previousElementSibling;
    li.remove();
    if(normalLi && normalLi.classList.contains('subtask-list')) {
      normalLi.remove();
    }
  }
}

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

function saveEditedSubtask(button){
  let editLi = button.closest('.subtask-edit-list');
  let normalLi = editLi.previousElementSibling;
  let editSpan = editLi.querySelector('.subtask-edit');
  let textSpan = normalLi.querySelector('.subtask-text');
  textSpan.textContent = editSpan.textContent;
  editLi.classList.add('d-none');
  normalLi.classList.remove('d-none');
}