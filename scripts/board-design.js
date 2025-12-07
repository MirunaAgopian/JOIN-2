let isShowTaskActive = false;

/**
 * This function is used to change the img icon and the color of input frame on mouse hover event
 * 
 * @param {String} action - includes the mouse action (onmouseover, onmouseout) 
 * @param {String} idFrame - includes the id of the complete div container (input frame) 
 * @param {String} idImg - includes the id of the img 
 */
function changeImgOfSearchIcon(action, idFrame, idImg){
    const contentFrameRef = document.getElementById(idFrame);
    const contentImgRef = document.getElementById(idImg);
    if(action == 'add'){
        contentFrameRef.style = "border:1px solid #29ABE2;";
        contentImgRef.src = '../assets/img/search_click.svg';
    }else if(action == 'remove'){
        contentFrameRef.style = "border:1px solid #D1D1D1;";
        contentImgRef.src = '../assets/img/search.svg';
    }
}

/**
 * This function changes the DOM elements and deactivates unnecessary css classes for show task dialog
 * 
 * @param {Object} arrSubtasks - includes the object with filled tasks data from firebase 
 */
function changeDOMIfShowTaskIsOpen(arrSubtasks){
    changeDOMIndication('task_title', 'title_indication');
    changeDOMIndication('due_date', 'date_indication');
    changeDOMIndication('task_description', 'description_indication');
    changeDateFormat('date_indication');
    hiddenInputFieldSubtask();
    hiddenCheckboxSubtask(arrSubtasks);
    loadCheckedCheckboxes(arrSubtasks);
    changeCtrlButtons();
    disableCssClass('cssAddTaskStandard');
    disableCssClass('cssAddTaskInteractions');
}

/**
 * This subfunction of changeDOMIfShowTaskIsOpen() copied the values of input fields and paste it to the indication elements
 * 
 * @param {String} idInput - includes the id of input field 
 * @param {String} idSpan - includes the id of span tag 
 */
function changeDOMIndication(idInput, idSpan){
    let inputDOMRef = document.getElementById(idInput);
    let spanDOMRef = document.getElementById(idSpan);
    if(isShowTaskActive){
        spanDOMRef.innerHTML = inputDOMRef.value;
        inputDOMRef.style = "display:none;";
        spanDOMRef.style = "display:block;"; 
    }else{
        spanDOMRef.style = "display:none;";
        inputDOMRef.style = "display:block;"; 
    }
}

/**
 * This function changes the date format
 * 
 * @param {String} idSpan - includes the id of span tag where the date will indicate 
 */
function changeDateFormat(idSpan){
    let date = document.getElementById(idSpan);
    let spanContent = date.textContent.trim();
    let [year, month, day] = spanContent.split('-');
    let newDateFormat = `${day}/${month}/${year}`;
    date.textContent = newDateFormat;
}

/**
 * This function hides unnecessary tags on show task dialog
 * 
 */
function hiddenInputFieldSubtask(){
    let inputSubtask = document.getElementById('subtask');
    if(isShowTaskActive){
        inputSubtask.style = "display:none;";
    }else{
        inputSubtask.style = "display:block;";
    }
}

/**
 * This function is used to hide the checkboxes tags of subtasks and shows the img for subtasks boxes
 * 
 * @param {Object} arrSub - includes the object with filled tasks data from firebase
 */
function hiddenCheckboxSubtask(arrSub){
    if(arrSub != null){
        let amountOfSubtasks = checkIfSubtasksInObjectExist(arrSub);
        let isClassActive = !document.getElementById('cssAddTask').disabled;
        for (let index = 0; index < amountOfSubtasks; index++) {
            deactivateCheckboxesIfShowTaskIsOpen(index, isClassActive);
        }
    }
}

/**
 * This function checks the object of the task if are subtasks created
 * 
 * @param {Object} arrSub - includes the object with filled tasks data from firebase
 * @returns - returns the amount of subtasks implemtented in the task
 */
function checkIfSubtasksInObjectExist(arrSub){
    let amountOfSubtasks;
    if(arrSub.subtasks != undefined){
        amountOfSubtasks = arrSub.subtasks.length;
    }else{
        amountOfSubtasks = 0;
    }
    return amountOfSubtasks;
}

/**
 * This function hides the checkboxes of subtasks in a clicked task 
 * 
 * @param {Number} index - number of subtask in task 
 * @param {String} cssClass - id of css class AddTask 
 */
function deactivateCheckboxesIfShowTaskIsOpen(index, cssClass){
    if(isShowTaskActive){
        document.getElementById(`subtask_${index}`).style = "display:none;";
        document.getElementById(`subtask_${index}`).classList.remove('subtask-checkbox');
    }else{
        if(cssClass == false){
            document.getElementById(`subtask_${index}`).style = "display:block;";
            document.getElementById(`subtask_${index}`).classList.add('subtask-checkbox');
        }
    }
}

/**
 * This function checks the value of the inputfield checkbox of subtask and changes the img of checkbox 
 * 
 * @param {String} indexSubtask - includes the number of subtask from clicked task 
 */
async function controlCheckbox(indexSubtask){
    let checkbox = document.getElementById(`subtask_${indexSubtask}`);
    let checkboxImg = document.getElementById(`checkbox_${indexSubtask}`);
    let isChecked = checkbox.checked;
    if(isChecked){
        checkbox.checked = false;
        checkboxImg.classList.remove('checkbox-checked');
        checkboxImg.classList.add('checkbox-container');
    }else{
        checkbox.checked = true;
        checkboxImg.classList.remove('checkbox-container');
        checkboxImg.classList.add('checkbox-checked');
    }
    await updateSubTask(indexSubtask);
}

/**
 * This function checks the implemented subtasks of tasks and customizes the img value during onload of show task dialog
 * 
 * @param {Object} arrSub - includes the object of filled data from task 
 */
function loadCheckedCheckboxes(arrSub){
    if(arrSub != null){
        let amountOfSubtasks = checkIfSubtasksInObjectExist(arrSub);
        let isClassActive = !document.getElementById('cssAddTask').disabled;
        if(isClassActive == false){
            for (let index = 0; index < amountOfSubtasks; index++) {
                if(document.getElementById(`subtask_${index}`).checked){
                    document.getElementById(`checkbox_${index}`).classList.remove('checkbox-container');
                    document.getElementById(`checkbox_${index}`).classList.add('checkbox-checked');
                }      
            }
        }
    }
}

/**
 * This function changes the img of control buttons on show task dialog
 * 
 */
function changeCtrlButtons(){
    let dialogButtons = document.getElementById('buttons_dialog');
    let showTaskButtons = document.getElementById('task_ctrl_box');
    if(isShowTaskActive){
        dialogButtons.classList.add('hidden');
        showTaskButtons.classList.remove('hidden');
    }else{
        showTaskButtons.classList.add('hidden');
        dialogButtons.classList.remove('hidden');
    }
}

/**
 * This function changes the images of control buttons if mouse on over
 * 
 * @param {String} id - includes the id of control button 
 */
function changeTaskImgHover(id){
    let contentImgRef = document.getElementById(id);
    if(id == 'btn_edit_task'){
        contentImgRef.src = '../assets/img/edit_contact_hover.svg';
    }else if(id == 'btn_delete_task'){
        contentImgRef.src = '../assets/img/delete_contact_hover.svg';
    }
}

/**
 * This function changes the images of control button if mouse out event is active
 * 
 * @param {String} id - includes id of control button 
 */
function changeTaskImgOut(id){
    const contentImgRef = document.getElementById(id);
    if(id == 'btn_edit_task'){
        contentImgRef.src = '../assets/img/edit_contact.svg';
    }else if(id == 'btn_delete_task'){
        contentImgRef.src = '../assets/img/delete_contact.svg';
    }
}

/**
 * This function is used to disable unnecessary css classes during show task dialog is open
 * 
 * @param {String} id - includes the id of css class 
 */
function disableCssClass(id){
    if(isShowTaskActive){
        document.getElementById(id).disabled = true;
    }else{
        document.getElementById(id).disabled = false;
    }
}