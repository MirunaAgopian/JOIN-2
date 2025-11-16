let tasks = [];
let selectedPriority = null;
let selectedContacts = new Set();

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
  return {
    title: document.getElementById("task_title").value.trim(),
    description: document.getElementById("task_description").value.trim(),
    date: document.getElementById("due_date").value.trim(),
    priority: selectedPriority,
    assignedTo: Array.from(selectedContacts),
    category: document.getElementById("selected_category").textContent.trim(),
    subtasks: document.getElementById("subtask").value.trim(),
  };
}

function clearTaskInput() {
  document.getElementById("task_title").value = "";
  document.getElementById("task_description").value = "";
  document.getElementById("due_date").value = "";
  document.getElementById("assigned_to").value = "";
  document.getElementById("contact_icons").innerHTML = "";
  document.getElementById("selected_category").textContent = "Select task category";
  document.getElementById("subtask").value = "";
  selectPriority = null;
  selectedContacts.clear();
  document
    .querySelectorAll(".checkbox.checked")
    .forEach((cb) => cb.classList.remove("checked"));
  document
    .querySelectorAll(".txt-img")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelectorAll(".prio-img")
    .forEach((icon) => icon.classList.remove("active"));
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

//here I need to add my own alerts + set the medium-prio as selected by default
//then I need to upload the loggedInUser
//then I need to create the ovelays for the add task (task created succesfully + mobile overlay)
//then I need to create the ul at subtasks + buttons
//I should also make sure that the checkes items remain checked when I toggle the contact list

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

//** Gets the contacts from server
window.onload = async () => {
  await createArrayOfContacts();
  console.log("Contacts loaded:", joinContacts);
};

function getContactList(contact, initials, isCurrentUser = false) {
  return `<li>
              <div class='username'>
                <span class='contact-circle' style='background-color:${
                  contact.color
                }'>${initials}</span>
                <span>${contact.name}${isCurrentUser ? " (You)" : ""}</span> 
              </div>  
                <div onclick='setCheckMark(this, "${
                  contact.mail
                }")' class='checkbox'></div>
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
  if (event.relatedTarget && event.relatedTarget.closest('#subtask_actions')) {
    return;
  }
  document.getElementById('subtask').classList.remove('active');
  document.getElementById('subtask_actions').classList.remove('active');
}

function getAddedTasks(text){
  return `<li>${text}</li>`;
}

function addSubtask(){
  console.log('Add subtask button clicked');
  
  let input = document.getElementById('subtask');
  let list = document.getElementById('subtask_list');
  let inputValue = input.value.trim();
  if(inputValue !== '') {
    list.innerHTML += getAddedTasks(inputValue);
    input.value = ''; 
  }
}