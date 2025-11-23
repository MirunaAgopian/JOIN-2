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

/**
 * This function close the add contact dialog after created contact, without slide effect
 * 
 */
function closeDialogAfterCreatedContact(){
    const contentDialogContactRef = document.getElementById('add_contact_dialog');
    contentDialogContactRef.close();
    contentDialogContactRef.classList.remove('dialogOpened');
}

/**
 * This function is used to read the input fields from add contact dialog an creates an object
 * 
 * @returns - object with input values
 */
function getInputFields(){
    let name = document.getElementById('add_name').value;
    let mail = document.getElementById('add_mail').value;
    let phone = document.getElementById('add_phone').value;

    let inputData = createContactObj(name, mail, phone);
    return inputData;
}

/**
 * This subfunction of getInpuFields() creates an contact object and return the object
 * 
 * @param {string} name - inculdes the name of input field 
 * @param {string} mail - includes the mail address of input field 
 * @param {string} phone - includes the phone number of input field
 * @returns - object with filled input data
 */
function createContactObj(name, mail, phone){
    let contactObj = {
        "name" : name,
        "mail" : mail,
        "phone" : phone
    };
    return contactObj;
}

/**
 * This function deletes the values of input fields on dialog add contact
 * 
 */
function clearInputFields(){
    document.getElementById('add_name').value = '';
    document.getElementById('add_mail').value = '';
    document.getElementById('add_phone').value = '';
}

/**
 * This function is used to change the color and img from the cancel button of add contact dialog during hover
 * 
 */
function changeColorHover(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #29ABE2;';
    contentImageRef.src = '../assets/img/cancel_x_hover.svg';
}

/**
 * This function changes the color and img back to normal values if onmouseout event from cancel button
 * 
 */
function changeColorOut(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #2A3647;';
    contentImageRef.src = '../assets/img/cancel_x.svg';
}

/**
 * This function changes the color and img of cancel button, if the event on mousedown is active
 * 
 */
function changeColorDown(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #091931;';
    contentImageRef.src = '../assets/img/cancel_x_active.svg';
}


/**
 * This functions opens a message dialog with slide effect and includes the information of succesfully contact creation
 * 
 * @param {string} text - includes the message for dialog indication 
 */
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

/**
 * This subfunction of openCantactMsgDialog() closes the message dialog with slide effect automaticly after 1 sec of show 
 * 
 * @param {element} element - element of contact dialog ref
 */
async function closeContactMsgDialog(element){
    const contentDialogRef = element;
    contentDialogRef.classList.add('msg-closed');
    await timeout(1000);
    contentDialogRef.close();
    contentDialogRef.classList.remove('msg-opened');
    contentDialogRef.classList.remove('msg-closed');
}

/**
 * This function is used to open the dialog "edit contact"
 * 
 */
function openDialogEditContact(){
    const contentEditContactRef = document.getElementById('edit_contact_dialog');
    contentEditContactRef.showModal();
    contentEditContactRef.classList.add('dialogOpened');
}

/**
 * This function closes the edit dialog box with slide effect
 * 
 */
async function closeDialogEditContact(){
    const contentEditContactRef = document.getElementById('edit_contact_dialog');
    contentEditContactRef.classList.add('dialogClosed'); 
    await timeout(600);
    contentEditContactRef.close();
    contentEditContactRef.classList.remove('dialogOpened');
    contentEditContactRef.classList.remove('dialogClosed');
}

/**
 * This function reads the input fields with changes of the edit dialog
 * 
 * @returns - returns an object with filled data for change
 */
function getInputFieldsEditDialog(){
    let name = document.getElementById('edit_name').value;
    let mail = document.getElementById('edit_mail').value;
    let phone = document.getElementById('edit_phone').value;

    let inputData = createContactEditObj(name, mail, phone);
    return inputData;
}

/**
 * This subfunction of getInputFieldsEditDialog() is used to create an object for edit contact data of firebase
 * 
 * @param {string} name - name of contact person 
 * @param {string} mail - mail address of contact person 
 * @param {string} phone - phone number of contact person 
 * @returns - an object with filled data in firebase format
 */
function createContactEditObj(name, mail, phone){
    let contactObj = {
        "name" : name,
        "mail" : mail,
        "phone" : phone,
        "color" : ''
    };
    return contactObj;
}

/**
 * This function deltes the contact on firebase and closes the edit dialog without slide effect
 * 
 * @param {string} mail - mail address for searching correct contact on firebase (key) 
 */
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
        closeDialogAndReloadWindow('edit_contact_dialog', 'dialogOpened');
    }
}

/**
 * This subfunction of deleteContactOnDialog() closes the dialog after delete function and reload the window
 * 
 * @param {string} id - id of dialog 
 * @param {string} cssClass - removes the css class from dialog needed for slide in effect during opening dialog 
 */
function closeDialogAndReloadWindow(id, cssClass){
    let dialog = document.getElementById(id);
    dialog.close();
    dialog.classList.remove(cssClass);
    window.location.reload();
}