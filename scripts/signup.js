let policyAccepted = false;
let joinUsers = [];

function acceptPolicy(){
    if(policyAccepted == false){
        document.getElementById('checkbox').classList.remove('checkbox-unchecked');
        document.getElementById('checkbox').classList.add('checkbox-checked');
        policyAccepted = true;
    }else{
        document.getElementById('checkbox').classList.remove('checkbox-checked');
        document.getElementById('checkbox').classList.add('checkbox-unchecked');
        policyAccepted = false;
    }
}

async function createUser(){
    let userData = getInput();
    await createArrayOfUsers();
    await checkNewUser(userData, joinUsers);
}

function getInput(){
    let name = document.getElementById('create_name').value;
    let mail = document.getElementById('create_mail').value;
    let passw = document.getElementById('create_pw').value;
    let confirmPassw = document.getElementById('create_confirm_pw').value;
    let userData = createObj(name, mail, passw);
    return userData;
}

function createObj(name, mail, password){
    let userObj = {
        "name" : name,
        "mail" : mail,
        "password" : password
    };
    return userObj;
}

async function createArrayOfUsers(){
    let userResponse = await getAllUsers('/joinUsers');
    let userKeysArr = Object.keys(userResponse);
    fillArrayOfUsers(userKeysArr, userResponse);
}

function fillArrayOfUsers(objKeysArr, usersObj){
    joinUsers = [];
    let keysArr = objKeysArr;
    let amountOfUsers = objKeysArr.length;
    for (let index = 0; index < amountOfUsers; index++) {
        joinUsers.push({
            "name" : `${usersObj[keysArr[index]].name}`,
            "mail" : `${usersObj[keysArr[index]].mail}`,
            "password" : `${usersObj[keysArr[index]].password}`
        });
    }
    console.log(joinUsers);
}

function clearInputs(){
    document.getElementById('create_name').value = '';
    document.getElementById('create_mail').value = '';
    document.getElementById('create_pw').value = '';
    document.getElementById('create_confirm_pw').value = '';
}

async function checkNewUser(userObj, userArr){
    let amountOfUsers = userArr.length;
    let userExistance = false;
    for (let index = 0; index < amountOfUsers; index++) {
        if((userArr[index].name == userObj.name) && (userArr[index].mail == userObj.mail) && (userArr[index].password == userObj.password)){
            alert('Benutzer schon vorhanden');
            clearInputs();
            userExistance = true;
            break;
        }
    }
    if(userExistance == false){
        await postUserInDatabase(userObj);
        clearInputs();
    }
}

async function postUserInDatabase(newUserObj){
    await postData('/joinUsers', newUserObj);
    alert('Du hast dich erfolgreich registriert');
    // window.location.href = '../index.html';
}