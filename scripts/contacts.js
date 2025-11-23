let joinContacts = [];
const colorContacts = ['#FF7A00', '#9327FF' , '#FF745E', '#FFC701', '#FFE62B',
    '#FF5EB3', '#00BEE8', '#FFA35E', '#0038FF', '#FF4646',
    '#6E52FF', '#1FD7C1', '#FC71FF', '#C3FF2B', '#FFBB2B'
];
let activatedContact = 0;

async function createContact(){
    let contactData = getInputFields();
    await createArrayOfContacts();
    await checkNewContact(contactData, joinContacts);
}

async function createArrayOfContacts(){
    let userResponse = await getAllUsers('/contacts');
    let userKeysArr = Object.keys(userResponse);
    fillArrayOfContacts(userKeysArr, userResponse);
}

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
    if(contactExistance == false){
        await postContactInDatabse(contactObj);
        clearInputFields();
    }
    else{
        await openContactMsgDialog('Contact already in list');
    }
}

async function postContactInDatabse(dataObj){
    let contactFirebaseObj = createFirebaseObj(dataObj);
    await postData('/contacts', contactFirebaseObj);
    // alert('Kontakt hinzugefügt');
    await openContactMsgDialog('Contact succesfully created');
    onloadFuncContact();
}

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

function getRandomColor(){
    let color = '';
    let randomNumber = Math.floor(Math.random() * 15);
    color = colorContacts[randomNumber];
    return color;
}

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
    if(contactObj.mail != ''){
        displayContactsContentContainer();
        renderContact(contactObj);
        showActivatedContactInList(joinContacts, activatedContact);
    }else{
        alert('contact not found');
    }
}

function displayContactsContentContainer(){
    let contentContactRef = document.getElementById('contacts_content');
    let contentContactslistRef = document.getElementById('contacts_list');
    let displayValue = window.getComputedStyle(contentContactRef).display;
    if(displayValue == 'none'){
        contentContactslistRef.classList.add('hidden');
        contentContactRef.style = "display:block;"
    }
}

function goBackToContactsList(){
    let contentContactRef = document.getElementById('contacts_content');
    let contentContactslistRef = document.getElementById('contacts_list');
    contentContactRef.style = "display:none";
    contentContactslistRef.classList.remove('hidden');
    window.location.reload();
}

function renderContact(contactObj){
    const contentContactRef = document.getElementById('contact_container');
    let nameInitials = getUserItem(contactObj.name);
    contentContactRef.innerHTML = getTemplateShowContact(contactObj, nameInitials);
}

function changeImgHover(id){
    const contentImgRef = document.getElementById(id);
    if(id == 'btn_edit'){
        contentImgRef.src = '../assets/img/edit_contact_hover.svg';
    }else if(id == 'btn_delete'){
        contentImgRef.src = '../assets/img/delete_contact_hover.svg';
    }
}

function changeImgOut(id){
    const contentImgRef = document.getElementById(id);
    if(id == 'btn_edit'){
        contentImgRef.src = '../assets/img/edit_contact.svg';
    }else if(id == 'btn_delete'){
        contentImgRef.src = '../assets/img/delete_contact.svg';
    }
}

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

function renderEditDialog(mail, initials){
    let obj = joinContacts.find(c => c.mail == mail);
    const contentEditDialogRef = document.getElementById('edit_contact_dialog');
    contentEditDialogRef.innerHTML = getTemplateEditDialog(obj, initials);
    openDialogEditContact();
}

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
    if(contactChanged){
        let dialog = document.getElementById('edit_contact_dialog');
        dialog.close();
        dialog.classList.remove('dialogOpened');
        window.location.reload();
    }
}

function showActivatedContactInList(contactArr, contactNumber){
    let id = 0;
    if((contactNumber == 0)){
        for (let index = 0; index < contactArr.length; index++) {
            id = index + 1;
            document.getElementById('id_' + id).classList.remove('contactID-activated');
            document.getElementById('spanId_' + id).classList.remove('contact-name-override');
        }
    }else{
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
}

function changeBackgroundIfNotActivated(id){
    if(id != activatedContact){
        document.getElementById('id_' + id).classList.add('contactID-hover');
    }
}

function changeBackgroundOut(id){
    if(id != activatedContact){
        document.getElementById('id_' + id).classList.remove('contactID-hover');
    }
}

function showEditContainerMobile(event){
    event.stopPropagation();
    document.getElementById('edit_mobile_container').classList.remove('hidden');
}

function closeEditContainerMobile(){
    document.getElementById('edit_mobile_container').classList.add('hidden');
}

function changeIconMobile(id){
    if(id == 'img_edit_mobile'){
        document.getElementById(id).src = '../assets/img/edit_contact_hover.svg';
    }else if(id == 'img_delete_mobile'){
        document.getElementById(id).src = '../assets/img/delete_contact_hover.svg';
    }
}

function showEditDialogMobile(){
    let name = document.getElementById('name_data').innerText;
    let mail = document.getElementById('mail_data').innerText;
    let initials = getUserItem(name);
    document.getElementById('img_edit_mobile').src = '../assets/img/edit_contact.svg';
    renderEditDialog(mail, initials);
}

function deleteContactMobileView(){
    let mail = document.getElementById('mail_data').innerText;
    document.getElementById('img_delete_mobile').src = '../assets/img/delete_contact.svg';
    deleteContact(mail);
}