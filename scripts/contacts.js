let joinContacts = [];
const colorContacts = ['#FF7A00', '#9327FF' , '#FF745E', '#FFC701', '#FFE62B',
    '#FF5EB3', '#00BEE8', '#FFA35E', '#0038FF', '#FF4646',
    '#6E52FF', '#1FD7C1', '#FC71FF', '#C3FF2B', '#FFBB2B'
];

function openDialogAddContact(){
    const contentDialogContactRef = document.getElementById('add_contact_dialog');
    contentDialogContactRef.showModal();
    contentDialogContactRef.classList.add('dialogOpened');
}

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

async function createContact(){
    let contactData = getInputFields();
    await createArrayOfContacts();
    await checkNewContact(contactData, joinContacts);
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
        // alert('Kontakt schon vorhanden');
        await openContactMsgDialog('Contact already in list');
    }
}

function clearInputFields(){
    document.getElementById('add_name').value = '';
    document.getElementById('add_mail').value = '';
    document.getElementById('add_phone').value = '';
}

async function postContactInDatabse(dataObj){
    let contactFirebaseObj = createFirebaseObj(dataObj);
    await postData('/contacts', contactFirebaseObj);
    // alert('Kontakt hinzugefügt');
    await openContactMsgDialog('Contact succesfully created');
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

async function showClickedContact(mail){
    await createArrayOfContacts();
    let amountOfContacts = joinContacts.length;
    let contactObj = {};
    for (let index = 0; index < amountOfContacts; index++) {
        if(mail == joinContacts[index].mail){
            contactObj = joinContacts[index];
            break;
        }
    }
    if(contactObj.mail != ''){
        renderContact(contactObj);
    }else{
        alert('contact not found');
    }
}

function renderContact(contactObj){
    const contentContactRef = document.getElementById('contact_container');
    let nameInitials = getUserItem(contactObj.name);
    contentContactRef.innerHTML = getTemplateShowContact(contactObj, nameInitials);
}