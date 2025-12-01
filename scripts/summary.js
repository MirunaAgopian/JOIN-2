
//------------------------- Dynamic data summary.html ------------------------
// /** const with Link for the Database */
// const BASE_URL = 'https://remotestorage-162fc-default-rtdb.europe-west1.firebasedatabase.app/';

// /** loads all useres that are stored in the database
//  * @param {string} path key of the first Level of database
//  * @returns json of the reqest  */
// async function getAllUsers(path = '') {
//     let response = await fetch(BASE_URL + path + '.json');
//     let responseToJson = await response.json();

//     return responseToJson;
// }


function countTask(){
    let countToDo = 0;
    let countDone = 0;
    let countInProgress = 0;
    let countAwaitingFeedback = 0;
    for(let index = 0; index < todos.length; index++){
        if(todos[index].status == 'boardToDo'){
            countToDo++;
        } else if(todos[index].status == 'boardDone'){
            countDone++;
        } else if(todos[index].status == 'boardProgress'){
            countInProgress++;
        } else if(todos[index].status == 'boardFeedback') {
            countAwaitingFeedback++;
        } 
    }
    return returnNumberOfTasks(countToDo, countDone, countInProgress, countAwaitingFeedback);
}

function returnNumberOfTasks(toDo, done, inProgress, awaitingFeedback){
    return {
        toDo: toDo,
        done: done,
        inProgress: inProgress,
        awaitingFeedback: awaitingFeedback,
        total: toDo + done + inProgress + awaitingFeedback
    };
}

function insertNumbers(){
    let toDo = document.getElementById('to_do');
    let done = document.getElementById('done');
    let inProgress = document.getElementById('in_progress');
    let awaitingFeedback = document.getElementById('awaiting_feedback');
    let total = document.getElementById('total');
    let numbers = countTask();
    toDo.innerHTML = `${numbers.toDo}`;
    done.innerHTML = `${numbers.done}`;
    inProgress.innerHTML = `${numbers.inProgress}`;
    awaitingFeedback.innerHTML = `${numbers.awaitingFeedback}`;
    total.innerHTML = `${numbers.total}`
}

function onloadFunctionSummary(){
    renderActiveAvatar();
    insertNumbers();
}
// I should call insertNumbers() at onload but also take this into consideration
//onload="renderActiveAvatar()"

//Next to do:
// fix the console error regarding getAllUsers()
//write the funciton for upcoming deadline
//move al functions regarding the navigation in another file, navigation.js
//and add nav.js to all html pages, remove summary.js from unnecesarry pages (like add-task.html)
