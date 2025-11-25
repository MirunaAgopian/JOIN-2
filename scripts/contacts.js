let joinContacts = [];
const colorContacts = ['#FF7A00', '#9327FF' , '#FF745E', '#FFC701', '#FFE62B',
    '#FF5EB3', '#00BEE8', '#FFA35E', '#0038FF', '#FF4646',
    '#6E52FF', '#1FD7C1', '#FC71FF', '#C3FF2B', '#FFBB2B'
];
let activatedContact = 0;

/**
 * This function is used to read the input fields on add contact dialog and crestes a new object in firebase
 * 
 */
async function createContact(){
    let contactData = getInputFields();
    await createArrayOfContacts();
    await checkNewContact(contactData, joinContacts);
}

/**
 * This function loads all contacts of firebase an crates an array with contacts
 * 
 */
async function createArrayOfContacts(){
    let userResponse = await getAllUsers('/contacts');
    let userKeysArr = Object.keys(userResponse);
    fillArrayOfContacts(userKeysArr, userResponse);
}

/**
 * This subfunction of crateArrayOfContacts() pushes the loaded contacts of firbase into the array
 * 
 * @param {Array} objKeysArr - an array with object keys of firebase contacts
 * @param {Object} contactsObj - includes all of loaded contacts data of firebase 
 */
function fillArrayOfContacts(objKeysArr, contactsObj){
    joinContacts = [];
    let keysArr = objKeysArr;
    let amountOfContacts = keysArr.length;
    for (let index = 0; index < amountOfContacts; index++) {
        joinContacts.push({
            "name" : `${contactsObj[keysArr[index]].name}`,
            "mail" : `${contactsObj[keysArr[index]].mail}`,
            "phone" : `${contactsObj[keysArr[index]].phone}`,
            "color" : `${contactsObj[keysArr[index]].color}`
        });
    }
}

/**
 * This function is used to check if the new contact already exist
 * 
 * @param {Object} contactObj - includes the data of the new contact 
 * @param {Array} contactsArr - includes all contacts of firebase 
 */
async function checkNewContact(contactObj, contactsArr){
    let amountOfContacts = contactsArr.length;
    let contactExistance = false;
    for (let index = 0; index < amountOfContacts; index++) {
        if(contactsArr[index].mail == contactObj.mail){
            clearInputFields();
            contactExistance = true;
            break;
        }
    }
    handleContactExistanceCheck(contactExistance, contactObj);
}

/**
 * This function handles the result of contact check. If the contact already exist
 * the operater will get an information, otherwise the new contact will created
 * 
 * @param {Boolean} isExist - result of contact check 
 * @param {Object} contactObj - includes the new contact data 
 */
async function handleContactExistanceCheck(isExist, contactObj){
    let contactExistance = isExist;
    if(contactExistance == false){
        await postContactInDatabse(contactObj);
        clearInputFields();
    }
    else{
        await openContactMsgDialog('Contact already in list');
    }
}

/**
 * This function creates a new contact in firebase, let an info appear and loads the window new
 * 
 * @param {Object} dataObj - includes the new contact object 
 */
async function postContactInDatabse(dataObj){
    let contactFirebaseObj = createFirebaseObj(dataObj);
    await postData('/contacts', contactFirebaseObj);
    await openContactMsgDialog('Contact succesfully created');
    onloadFuncContact();
}

/**
 * This function creates an object with firebase syntax (including color)
 * 
 * @param {Object} contactObj - includes the contact object in local syntax 
 * @returns - returns an object in firebase syntax
 */
function createFirebaseObj(contactObj){
    let color = getRandomColor();
    let firebaseObj = {
        "name" : contactObj.name,
        "mail" : contactObj.mail,
        "phone" : contactObj.phone,
        "color" : color
    };
    return firebaseObj; 
}

/**
 * This function chooses random a color of defined array
 * 
 * @returns - a color of the defined color array
 */
function getRandomColor(){
    let color = '';
    let randomNumber = Math.floor(Math.random() * 15);
    color = colorContacts[randomNumber];
    return color;
}

/**
 * This function renders contact content if a contact was clicked on contact list
 * 
 * @param {String} mail - incudes the mail address from clicked person 
 */
async function showClickedContact(mail){
    await createArrayOfContacts();
    let amountOfContacts = joinContacts.length;
    let contactObj = {};
    for (let index = 0; index < amountOfContacts; index++) {
        if(mail == joinContacts[index].mail){
            contactObj = joinContacts[index];
            activatedContact = index + 1;
            break;
        }
    }
    displayContact(contactObj, joinContacts);
}

/**
 * This subfunction of showClickedContact() renders the contact on page if the clicked contact wasd found on array
 * 
 * @param {Object} contactObj - includes data of clicked contact 
 * @param {*} joinContacts - array filled with all contacts from firebase
 */
function displayContact(contactObj, joinContacts){
    if(contactObj.mail != ''){
        displayContactsContentContainer();
        renderContact(contactObj);
        showActivatedContactInList(joinContacts, activatedContact);
    }else{
        alert('contact not found');
    }
}

/**
 * This function is used to display the contact content in mobile view 
 * 
 */
function displayContactsContentContainer(){
    let contentContactRef = document.getElementById('contacts_content');
    let contentContactslistRef = document.getElementById('contacts_list');
    let displayValue = window.getComputedStyle(contentContactRef).display;
    if(displayValue == 'none'){
        contentContactslistRef.classList.add('hidden');
        contentContactRef.style = "display:block;"
    }
}

/**
 * This function is used to close the contact view and go back to contact list in mobile view
 * 
 */
function goBackToContactsList(){
    let contentContactRef = document.getElementById('contacts_content');
    let contentContactslistRef = document.getElementById('contacts_list');
    contentContactRef.style = "display:none";
    contentContactslistRef.classList.remove('hidden');
    window.location.reload();
}

/**
 * This subfunction creates initials of clicked contact and renders the data in contact container
 * 
 * @param {Object} contactObj - includes the clicked contact data 
 */
function renderContact(contactObj){
    const contentContactRef = document.getElementById('contact_container');
    let nameInitials = getUserItem(contactObj.name);
    contentContactRef.innerHTML = getTemplateShowContact(contactObj, nameInitials);
}

/**
 * This function changes the img if mouse hover on edit or delete button on contact container
 * 
 * @param {String} id - includes the id of the edit or delete img 
 */
function changeImgHover(id){
    const contentImgRef = document.getElementById(id);
    if(id == 'btn_edit'){
        contentImgRef.src = '../assets/img/edit_contact_hover.svg';
    }else if(id == 'btn_delete'){
        contentImgRef.src = '../assets/img/delete_contact_hover.svg';
    }
}

/**
 * This function changes the img if mouse leaves the edit or delete button on contact container
 * 
 * @param {String} id - includes the id of the edit or delete img 
 */
function changeImgOut(id){
    const contentImgRef = document.getElementById(id);
    if(id == 'btn_edit'){
        contentImgRef.src = '../assets/img/edit_contact.svg';
    }else if(id == 'btn_delete'){
        contentImgRef.src = '../assets/img/delete_contact.svg';
    }
}

/**
 * This function is used to delete a contact in firebase and reload the window
 * 
 * @param {String} mail - includes mail address from contact  
 */
async function deleteContact(mail){
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
        window.location.reload();
    }
}

/**
 * This function renders the edit dialog with contact data
 * 
 * @param {String} mail - includes mail address from edit person 
 * @param {String} initials - includes initial letters of edit person 
 */
function renderEditDialog(mail, initials){
    let obj = joinContacts.find(c => c.mail == mail);
    const contentEditDialogRef = document.getElementById('edit_contact_dialog');
    contentEditDialogRef.innerHTML = getTemplateEditDialog(obj, initials);
    openDialogEditContact();
}

/**
 * This function is used to change the contact data in firebase if a contact has been processed
 * 
 * @param {String} mail - includes the mail address of edited person
 */
async function saveChangedData(mail){
    let contactChanged = false;
    let contactsResponse = await getAllUsers('/contacts');
    let contactsKeysArr = Object.keys(contactsResponse);
    for (let index = 0; index < contactsKeysArr.length; index++) {
        if(contactsResponse[contactsKeysArr[index]].mail == mail){
            let changedObj = getInputFieldsEditDialog();
            changedObj.color = contactsResponse[contactsKeysArr[index]].color;
            await putData(`contacts/${contactsKeysArr[index]}`, changedObj);
            contactChanged = true;
            break;
        }
    }
    closeDialogIfDataChanged(contactChanged);
}

/**
 * This subfunction of saveChangedData() closes the edit dialog and reload the window if the data of contact changed
 * 
 * @param {Boolean} isChanged - result of succesfully contact changes in firebase 
 */
function closeDialogIfDataChanged(isChanged){
    let contactChanged = isChanged;
    if(contactChanged){
        let dialog = document.getElementById('edit_contact_dialog');
        dialog.close();
        dialog.classList.remove('dialogOpened');
        window.location.reload();
    }
}

/**
 * This function changes the background color of container and the color of font if the contact is activated in contact list
 * 
 * @param {Array} contactArr - array of contacts 
 * @param {Number} contactNumber -  number of id from div container of contact person
 */
function showActivatedContactInList(contactArr, contactNumber){
    let id = 0;
    if((contactNumber == 0)){
        for (let index = 0; index < contactArr.length; index++) {
            id = index + 1;
            document.getElementById('id_' + id).classList.remove('contactID-activated');
            document.getElementById('spanId_' + id).classList.remove('contact-name-override');
        }
    }else{
        changeColorOfActivatedContact(contactArr, contactNumber);
    }
}

/**
 * This subfunction of showActivatedContactInList() add and removes the css classes to show the correct background color in contact list
 * 
 * @param {Array} contactArr - array of contacts
 * @param {Number} contactNumber - number of id from div container of contact person 
 */
function changeColorOfActivatedContact(contactArr, contactNumber){
    for (let index = 1; index <= contactArr.length; index++) {
            if(contactNumber == index){
                document.getElementById('id_' + index).classList.remove('contactID-hover');
                document.getElementById('id_' + index).classList.add('contactID-activated');
                document.getElementById('spanId_' + index).classList.add('contact-name-override');
            }else{
                document.getElementById('id_' + index).classList.remove('contactID-activated');
                document.getElementById('spanId_' + index).classList.remove('contact-name-override');
            }
        }
}

/**
 * This function shows the hidden edit container in mobiel view
 * 
 * @param {Event} event - includes the bubble event closeEditContainerMobile()
 */
function showEditContainerMobile(event){
    event.stopPropagation();
    document.getElementById('edit_mobile_container').classList.remove('hidden');
}

/**
 * This function closes the edit container in mobile view
 * 
 */
function closeEditContainerMobile(){
    document.getElementById('edit_mobile_container').classList.add('hidden');
}

/**
 * This function changes the images of of edit or delete button in mobile view if the button is active
 * 
 * @param {String} id - id of img in edit container mobile view 
 */
function changeIconMobile(id){
    if(id == 'img_edit_mobile'){
        document.getElementById(id).src = '../assets/img/edit_contact_hover.svg';
    }else if(id == 'img_delete_mobile'){
        document.getElementById(id).src = '../assets/img/delete_contact_hover.svg';
    }
}

/**
 * This function is used to get the correct contact data of choosed contact and render the edit dialog in mobile view.
 * Also the img of edit button will changed to inactive img
 * 
 */
function showEditDialogMobile(){
    let name = document.getElementById('name_data').innerText;
    let mail = document.getElementById('mail_data').innerText;
    let initials = getUserItem(name);
    document.getElementById('img_edit_mobile').src = '../assets/img/edit_contact.svg';
    renderEditDialog(mail, initials);
}

/**
 * This function changes the delete img in edit container (mobile view) back to inactive and deletes the contact in firebase
 * 
 */
function deleteContactMobileView(){
    let mail = document.getElementById('mail_data').innerText;
    document.getElementById('img_delete_mobile').src = '../assets/img/delete_contact.svg';
    deleteContact(mail);
}