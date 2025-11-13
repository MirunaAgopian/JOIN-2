let tasks = [];
let selectedPriority = null;
const BASE_URL = 'https://remotestorage-162fc-default-rtdb.europe-west1.firebasedatabase.app/';

function setPrioColor(element) {
  const containers = document.querySelectorAll('.txt-img');
  containers.forEach(c => {
    c.classList.remove('active');
    const icon = c.querySelector('.prio-img');
    if (icon) icon.classList.remove('active');
  });
  element.classList.add('active');
  const clickedIcon = element.querySelector('.prio-img');
  if (clickedIcon) clickedIcon.classList.add('active');
  selectedPriority = selectPriority(element);
}

function selectPriority(element){
  if(element.classList.contains('urgent')){
    return 'urgent';
  } else if(element.classList.contains('medium')) {
    return 'medium';
  } else {
    return 'low';
  }
}

function getTaskInput(){
  return {
    title: document.getElementById('task_title').value.trim(),
    description: document.getElementById('task_description').value.trim(),
    date: document.getElementById('due_date').value.trim(),
    priority: selectedPriority,
    assignedTo: document.getElementById('assigned_to').value,
    category: document.getElementById('category').value,
    subtasks: document.getElementById('subtask').value.trim()
  };
}

function clearTaskInput(){
  document.getElementById('task_title').value = '';
  document.getElementById('task_description').value = '';
  document.getElementById('due_date').value = '';
  document.getElementById('assigned_to').value = '';
  document.getElementById('category').value = '';
  document.getElementById('subtask').value = '';
  selectPriority = null;
  document.querySelectorAll('.txt-img').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.prio-img').forEach(icon => icon.classList.remove('active'));
}

function addTask(){
  let task = getTaskInput();
  tasks.push(task);
  uploadTaskToFirebase('tasks', task)
  .then(res => {
    console.log('Task uploaded with ID:', res.name);
    clearTaskInput();
  })
  .catch(err => {
    console.error('Upload failed:', err)
  });
}

async function uploadTaskToFirebase(path='', task={}) {
  let response = await fetch( BASE_URL + path + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task)
  });
  let responseAsJson = await response.json();
  return responseAsJson;
}



