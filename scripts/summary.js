
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

function onloadFunctionSummary(){
    renderActiveAvatar();
    insertNumbers();
    insertPrioIcon();
    insertUpcomingDeadline();
}

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

function setPrioIcon(task) {
    let background = document.getElementById('prio_icon_background');
    let icon = document.getElementById('prio_icon');
    let taskPriority = task.priority;
    if(taskPriority == 'low'){
        background.classList.add("prio-background", "low");
        icon.classList.add("prio-background-img", "low");
    } else if(taskPriority == 'medium'){
        background.classList.add("prio-background", "medium");
        icon.classList.add("prio-background-img", "medium");
    } else if(taskPriority == 'urgent') {
        background.classList.add('prio-background', 'urgent');
        icon.classList.add('prio-background-img', 'urgent');
    }
}

function insertPrioIcon() {
    for(let index = 0; index < todos.length; index++){
        setPrioIcon(todos[index]);
    }
}

function getUpcomingDeadline(){
    let today = new Date();
    let nextTask = null;
    for(let index = 0; index < todos.length; index++){
        let task = todos[index];
        let taskDate = new Date(task.date);
        if(task.status !== 'boardDone' && taskDate > today){
            if(nextTask === null || taskDate < new Date(nextTask.date)){
                nextTask = task;
            }
        }
    }
    return nextTask ? nextTask.date : null;
} //wait for the answer of DA regadring which tasks count as deadline

function changeDateFormat(){
    let deadline = getUpcomingDeadline();
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
    }).format(new Date(deadline));
}

function insertUpcomingDeadline(){
    let container = document.getElementById('datum');
    let deadline = changeDateFormat();
    container.textContent = deadline; 
}

function insertNumberOfDeadlines(){
    //.... to be continued
    //...i also need to insert that status under the number according to the prio
}

function redirectToBoard(){
    window.location.href = "./board.html"
}

//Next to do:
// fix the console error regarding getAllUsers()


