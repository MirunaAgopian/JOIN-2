let policyAccepted = false;

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