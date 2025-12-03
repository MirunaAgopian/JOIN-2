let users = [];
let todos = [];
const BASE_URL = 'https://remotestorage-162fc-default-rtdb.europe-west1.firebasedatabase.app/';

async function onloadFunc(){
    console.log('test');
    // loadData('/name/type');
    // postData('/name',{"type" : "strawberry", "eatable" : "yes"});
    // deleteData('/name/-OZDY6sjSSy--kHVzl9s');
    // putData('/name',{"type" : "strawberry", "eatable" : "yes"});
    // addEditSingleUser();

    let userResponse = await loadData('/namen');
    let userKeysArr = Object.keys(userResponse);
    for (let index = 0; index < userKeysArr.length; index++) {
        users.push(
            {
                id : userKeysArr[index],
                user : userResponse[userKeysArr[index]] 
            }
        );
    }
    await addEditSingleUser(users[1].id, {"name":"Henri"});
    //await addEditSingleUser(id=55, {"name" : "Batzolein"});
    console.log(users);
}

/** loads all useres that are stored in the database
 * @param {string} path ky of the first Level of database
 * @returns json of the reqest  */
async function loadData(path = ''){
    let response = await fetch(BASE_URL + path + '.json');
    let responseAtJson = await response.json();
   // console.log(responseAtJson);
    return responseAtJson;
}

async function getAllUsers(path = ''){
    let response = await fetch(BASE_URL + path + '.json');
    let responseAtJson = await response.json();
   // console.log(responseAtJson);
    return responseAtJson;
}

async function postData(path='', data={}){
    let response = await fetch(BASE_URL + path + '.json', {
        method : "POST",
        header : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    });
    // return resonseToJson = await response.json();
}

async function deleteData(path=''){
    let response = await fetch(BASE_URL + path + '.json', {
        method : "DELETE"
    });
    return resonseToJson = await response.json();
}

async function putData(path='', data = {}){
    await fetch(BASE_URL + path + '.json', {
        method : "PUT",
        header : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    });
}

async function addEditSingleUser(id=44, user={"name" : "Herbert"}){
    putData(`/namen/${id}`, user);
}

async function loadData1(path=''){
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();

    return responseToJson;
}

/**
 * Updates specific fields of a record in the database using HTTP PATCH.
 * Only the provided keys in the data object will be modified, 
 * leaving all other fields of the record unchanged.
 *
 * @param {string} path - The relative path in the database 
 * @param {Object} data - Key-value pairs to update 
 * @returns {Promise<void>} - Resolves when the update request has completed.
 */
async function patchData(path = '', data = {}) {
  try {
    await fetch(BASE_URL + path + '.json', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error("patchData Error:", err);
  }
}

// Functions copied from from Board.js in order to see if data 
//is being passed to summary.html
let currentDraggedElement = null;
let contactUser = {};
let startStatusColumn = "";
let boardPos = {
    boardToDo: {},
    boardProgress: {},
    boardFeedback: {},
    boardDone: {}
};
let actualToDo = null;
let desiredPos = null;

async function onloadFuncBoard() {
    const ALL_TASKS = await loadData('tasks');
    todos = getTaskArr(ALL_TASKS);
    const ALL_USER = await loadData("contacts");
    contactUser = getUserData(ALL_USER);
    updateHTML();
    renderActiveAvatar();
}

async function processChanges() {
    const ALL_TASKS = await loadData('tasks');
    const searchValue = document.getElementById("searchBoard").value.toLowerCase();

    if (searchValue.length > 2) {
        const allTodos = getTaskArr(ALL_TASKS);
        todos = allTodos.filter(todo =>
            todo.title.toLowerCase().includes(searchValue) ||
            todo.description.toLowerCase().includes(searchValue)
        );
    } else {
        todos = getTaskArr(ALL_TASKS);
    }
    updateHTML();
}

function getTaskArr(ALL_TASKS) {
    const arr = [];

    for (const [key, value] of Object.entries(ALL_TASKS)) {
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

function checkStatus(value) {
    if (value.hasOwnProperty("status")) {
        return value.status;
    }
    else {
        return "boardToDo";
    }
}

function checkPosition(value, statusValue) {
    if (value.hasOwnProperty("pos")) {
        return value.pos;
    }
    else {
        return Object.keys(boardPos[statusValue]).length;
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

