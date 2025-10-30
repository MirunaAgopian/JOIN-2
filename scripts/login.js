let userObj = [
    {
        name: "Benjamin",
        mail: "benjamin@test.de",
        password: "Ben123"
    },
    {
        name: "Anna",
        mail: "anna@example.com",
        password: "Anna456"
    },
    {
        name: "Max",
        mail: "max@web.de",
        password: "Max789"
    }
];

let activeUser;
let validEmail = false;

let elementRev = {
    email: document.getElementById("txtEMail"),
    password: document.getElementById("txtPassword"),
    loginStatus: document.getElementById("loginStatus")
}

elementRev.email.addEventListener("change", () => {
    validEmail = checkValidEmail(elementRev.email.value);
    if (validEmail == true){
        elementRev.loginStatus.innerHTML="";
    } else {
        elementRev.loginStatus.innerHTML="please enter valid Email";
    }
});


/** 
 * start of Login Seassion
 */

function userLogin() {
    if (validEmail == false) {return;};

    let selUser = userObj.find(user =>
        user.mail.toLowerCase() === elementRev.email.value.toLowerCase() &&
        user.password === elementRev.password.value
    );

    if (selUser && selUser.password === elementRev.password.value) {
        alert(`Willkommen, ${selUser.name}!`);
        localStorage.setItem("loggedInUser", JSON.stringify(selUser));
        sessionStorage.setItem("loggedInUser", JSON.stringify(selUser));
    } else {
        alert("Ungültige E-Mail oder Passwort.");
    }
    activeUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

}

/**
 * Check if the email is valid
 * @param {string} email - Email address
 * @returns {boolean} - True if valid, false otherwise
 */
function checkValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Guest User Login
 */
function userGuestLogin() {
    alert("Guest Login");
}