let isShowTaskActive = false;

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

function changeDOMIfShowTaskIsOpen(arrSubtasks){
    changeDOMIndication('task_title', 'title_indication');
    changeDOMIndication('due_date', 'date_indication');
    changeDateFormat('date_indication');
    hiddenInputFieldSubtask();
    hiddenCheckboxSubtask(arrSubtasks);
    loadCheckedCheckboxes(arrSubtasks);
}

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

function changeDateFormat(idSpan){
    let date = document.getElementById(idSpan);
    let spanContent = date.textContent.trim();
    let [year, month, day] = spanContent.split('-');
    let newDateFormat = `${day}/${month}/${year}`;
    date.textContent = newDateFormat;
}

function hiddenInputFieldSubtask(){
    let inputSubtask = document.getElementById('subtask');
    if(isShowTaskActive){
        inputSubtask.style = "display:none;";
    }else{
        inputSubtask.style = "display:block;";
    }
}

function hiddenCheckboxSubtask(arrSub){
    if(arrSub != null){
        let amountOfSubtasks;
        if(arrSub.subtasks != undefined){
            amountOfSubtasks = arrSub.subtasks.length;
        }else{
            amountOfSubtasks = 0;
        }
        let isClassActive = !document.getElementById('cssAddTask').disabled;
        for (let index = 0; index < amountOfSubtasks; index++) {
            if(isShowTaskActive){
                document.getElementById(`subtask_${index}`).style = "display:none;";
                document.getElementById(`subtask_${index}`).classList.remove('subtask-checkbox');
            }else{
                if(isClassActive == false){
                    document.getElementById(`subtask_${index}`).style = "display:block;";
                    document.getElementById(`subtask_${index}`).classList.add('subtask-checkbox');
                }
            }
        }
    }
}

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

function loadCheckedCheckboxes(arrSub){
    if(arrSub != null){
        let amountOfSubtasks;
        if(arrSub.subtasks != undefined){
            amountOfSubtasks = arrSub.subtasks.length;
        }else{
            amountOfSubtasks = 0;
        }
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