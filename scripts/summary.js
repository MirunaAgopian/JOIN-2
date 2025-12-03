
function onloadFunctionSummary(){
    renderActiveAvatar();
    insertNumbers();
    insertUpcomingDeadline();
    insertDeadlineMessage();
}

function countTask(){
    let countToDo = 0;
    let countDone = 0;
    let countInProgress = 0;
    let countAwaitingFeedback = 0;
    let countUrgentTasks = 0;
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
        if(todos[index].priority == 'urgent' && todos[index].status !== 'boardDone'){
            countUrgentTasks++;
        }
    }
    return returnNumberOfTasks(countToDo, countDone, countInProgress, countAwaitingFeedback, countUrgentTasks);
}

function returnNumberOfTasks(toDo, done, inProgress, awaitingFeedback, urgent){
    return {
        toDo: toDo,
        done: done,
        inProgress: inProgress,
        awaitingFeedback: awaitingFeedback,
        urgent: urgent,
        total: toDo + done + inProgress + awaitingFeedback
    };
}

function insertNumbers(){
    let toDo = document.getElementById('to_do');
    let done = document.getElementById('done');
    let inProgress = document.getElementById('in_progress');
    let awaitingFeedback = document.getElementById('awaiting_feedback');
    let urgentTasks = document.getElementById('urgent_tasks_number');
    let total = document.getElementById('total');
    let numbers = countTask();
    toDo.innerHTML = `${numbers.toDo}`;
    done.innerHTML = `${numbers.done}`;
    inProgress.innerHTML = `${numbers.inProgress}`;
    awaitingFeedback.innerHTML = `${numbers.awaitingFeedback}`;
    urgentTasks.innerHTML = `${numbers.urgent}`
    total.innerHTML = `${numbers.total}`
}

function getUpcomingDeadline(){
    let today = new Date();
    let nextTask = null;
    for(let index = 0; index < todos.length; index++){
        let task = todos[index];
        let taskDate = new Date(task.date);
        if(task.status !== 'boardDone' && task.priority == 'urgent'  && taskDate > today){
            if(nextTask === null || taskDate < new Date(nextTask.date)){
                nextTask = task;
            }
        }
    }
    return nextTask ? nextTask.date : null;
}

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

function insertDeadlineMessage(){
    let deadlineString = getUpcomingDeadline();
    let deadline = new Date(deadlineString);
    let today = new Date();
    let container = document.getElementById('deadline_message');
    if(deadline < today) {
        container.innerHTML = "Missed deadline";
    } else {
        container.innerHTML ="Upcoming deadline"
    }
}

function redirectToBoard(){
    window.location.href = "./board.html"
}



