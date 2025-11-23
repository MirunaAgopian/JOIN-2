/**
 * This function is used to open the dialog "add contact"
 * 
 */
function openDialogAddContact(){
    const contentDialogContactRef = document.getElementById('add_contact_dialog');
    contentDialogContactRef.showModal();
    contentDialogContactRef.classList.add('dialogOpened');
}

/**
 * This function close the dialog with slide effect on right side
 * 
 */
async function closeDialogAddContact(){
    const contentDialogContactRef = document.getElementById('add_contact_dialog');
    contentDialogContactRef.classList.add('dialogClosed'); 
    await timeout(600);
    contentDialogContactRef.close();
    contentDialogContactRef.classList.remove('dialogOpened');
    contentDialogContactRef.classList.remove('dialogClosed');
}

function closeDialogAfterCreatedContact(){
    const contentDialogContactRef = document.getElementById('add_contact_dialog');
    contentDialogContactRef.close();
    contentDialogContactRef.classList.remove('dialogOpened');
}

function getInputFields(){
    let name = document.getElementById('add_name').value;
    let mail = document.getElementById('add_mail').value;
    let phone = document.getElementById('add_phone').value;

    let inputData = createContactObj(name, mail, phone);
    return inputData;
}

function createContactObj(name, mail, phone){
    let contactObj = {
        "name" : name,
        "mail" : mail,
        "phone" : phone
    };
    return contactObj;
}

function clearInputFields(){
    document.getElementById('add_name').value = '';
    document.getElementById('add_mail').value = '';
    document.getElementById('add_phone').value = '';
}

function changeColorHover(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #29ABE2;';
    contentImageRef.src = '../assets/img/cancel_x_hover.svg';
}

function changeColorOut(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #2A3647;';
    contentImageRef.src = '../assets/img/cancel_x.svg';
}

function changeColorDown(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #091931;';
    contentImageRef.src = '../assets/img/cancel_x_active.svg';
}

async function openContactMsgDialog(text){
    closeDialogAfterCreatedContact();
    const contentDialogRef = document.getElementById('msg_contact_dialog');
    contentDialogRef.innerHTML = '';
    contentDialogRef.innerHTML = getDialogMsgTemplate(text);
    contentDialogRef.showModal();
    contentDialogRef.classList.add('msg-opened');
    await timeout(1000);
    await closeContactMsgDialog(contentDialogRef);
}

async function closeContactMsgDialog(element){
    const contentDialogRef = element;
    contentDialogRef.classList.add('msg-closed');
    await timeout(1000);
    contentDialogRef.close();
    contentDialogRef.classList.remove('msg-opened');
    contentDialogRef.classList.remove('msg-closed');
}

function openDialogEditContact(){
    const contentEditContactRef = document.getElementById('edit_contact_dialog');
    contentEditContactRef.showModal();
    contentEditContactRef.classList.add('dialogOpened');
}

async function closeDialogEditContact(){
    const contentEditContactRef = document.getElementById('edit_contact_dialog');
    contentEditContactRef.classList.add('dialogClosed'); 
    await timeout(600);
    contentEditContactRef.close();
    contentEditContactRef.classList.remove('dialogOpened');
    contentEditContactRef.classList.remove('dialogClosed');
}

function getInputFieldsEditDialog(){
    let name = document.getElementById('edit_name').value;
    let mail = document.getElementById('edit_mail').value;
    let phone = document.getElementById('edit_phone').value;

    let inputData = createContactEditObj(name, mail, phone);
    return inputData;
}

function createContactEditObj(name, mail, phone){
    let contactObj = {
        "name" : name,
        "mail" : mail,
        "phone" : phone,
        "color" : ''
    };
    return contactObj;
}

async function deleteContactOnDialog(mail){
    let contactDeleted = false;
    let contactsResponse = await getAllUsers('/contacts');
    let contactsKeysArr = Object.keys(contactsResponse);
    for (let index = 0; index < contactsKeysArr.length; index++) {
        if((contactsResponse[contactsKeysArr[index]].mail) == mail){
            await deleteData(`/contacts/${contactsKeysArr[index]}`);
            contactDeleted = true;
            break;
        }
    }
    if(contactDeleted){
        let dialog = document.getElementById('edit_contact_dialog');
        dialog.close();
        dialog.classList.remove('dialogOpened');
        window.location.reload();
    }
}

