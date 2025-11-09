//  joinUsers

userObj = {
    "name" : "Benjamin",
    "mail" : "benjamin@test.de",
    "password" : "Ben123"
};

function logOut(){
    sessionStorage.clear();
    window.location.href = './login.html'
}
