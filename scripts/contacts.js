let joinContacts = [];

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
        alert('Kontakt schon vorhanden');
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
    alert('Kontakt hinzugefügt');
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
    let hexDigits = '0123456789ABCDEF';
    let color = '#';
    for (let index = 0; index < 6; index++) {
        color += hexDigits[Math.floor(Math.random() * 16)];
    }
    return color;
}