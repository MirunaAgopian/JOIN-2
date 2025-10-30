let userObj = [
    {
        name: "Benjamin",
        mail: "benjamin@test.de",
        password: "test"
    },
    {
        name: "Miruna",
        mail: "miruna@test.de",
        password: "test"
    },
    {
        name: "Patrick",
        mail: "patrick@test.de",
        password: "test"
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
    emailCheck();
});

elementRev.password.addEventListener("focus", () => {
    elementRev.password.classList.remove("inputFail");
    elementRev.password.classList.add("inputFocus");
});

elementRev.password.addEventListener("blur", () => {
    elementRev.password.classList.remove("inputFocus");
});

elementRev.email.addEventListener("focus", () => {
    elementRev.email.classList.remove("inputFail");
    elementRev.email.classList.add("inputFocus");
});

elementRev.email.addEventListener("blur", () => {
    emailCheck();
    elementRev.email.classList.remove("inputFocus");
});
/** 
 * start of Login Seassion
 */

function userLogin() {
    if (validEmail == false) { return; };

    let selUser = userObj.find(user =>
        user.mail.toLowerCase() === elementRev.email.value.toLowerCase() &&
        user.password === elementRev.password.value
    );

    if (selUser && selUser.password === elementRev.password.value) {
        alert(`Willkommen, ${selUser.name}!`);
        localStorage.setItem("loggedInUser", JSON.stringify(selUser));
        sessionStorage.setItem("loggedInUser", JSON.stringify(selUser));
    } else {
        resetLoginElemnts();
        alert("Ungültige E-Mail oder Passwort.");
        elementRev.email.classList.add("inputFail");
        elementRev.password.classList.add("inputFail");
    }
    activeUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

}

function emailCheck() {
    validEmail = checkValidEmail(elementRev.email.value);
    if (validEmail == true) {
        elementRev.loginStatus.innerHTML = "";
    } else {
        elementRev.email.classList.add("inputFail");
        elementRev.loginStatus.innerHTML = "please enter valid Email";
    }
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

/** Reset all classes for Status Change */
function resetLoginElemnts() {
    elementRev.email.classList.remove("inputFail");
    elementRev.email.classList.remove("inputFocus");

    elementRev.password.classList.remove("inputFail");
    elementRev.password.classList.remove("inputFocus");
}