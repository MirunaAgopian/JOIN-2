let users = [];

async function onloadFunc(){
    console.log('test');
    // loadData('/name/type');
    // postData('/name',{"type" : "strawberry", "eatable" : "yes"});
    // deleteData('/name/-OZDY6sjSSy--kHVzl9s');
    // putData('/name',{"type" : "strawberry", "eatable" : "yes"});
    // addEditSingleUser();

    let userResponse = await getAllUsers('/namen');
    let userKeysArr = Object.keys(userResponse);
    for (let index = 0; index < userKeysArr.length; index++) {
        users.push(
            {
                id : userKeysArr[index],
                user : userResponse[userKeysArr[index]] 
            }
        );

        
    }

    await addEditSingleUser(users[1].id, {"name":"Henri"});
    //await addEditSingleUser(id=55, {"name" : "Batzolein"});

    console.log(users);
    
}

const BASE_URL = 'https://remotestorage-162fc-default-rtdb.europe-west1.firebasedatabase.app/';

async function loadData(path = ''){
    let response = await fetch(BASE_URL + path + '.json');
    let responseAtJson = await response.json();
    console.log(responseAtJson);
}

async function postData(path='', data={}){
    let response = await fetch(BASE_URL + path + '.json', {
        method : "POST",
        header : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    });
    // return resonseToJson = await response.json();
}

async function deleteData(path=''){
    let response = await fetch(BASE_URL + path + '.json', {
        method : "DELETE"
    });
    return resonseToJson = await response.json();
}

async function putData(path='', data = {}){
    await fetch(BASE_URL + path + '.json', {
        method : "PUT",
        header : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    });
}

async function addEditSingleUser(id=44, user={"name" : "Herbert"}){
    putData(`/namen/${id}`, user);
}

async function getAllUsers(path=''){
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();

    return responseToJson;
}