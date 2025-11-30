let userObj = [];

let validEmail = false;
/** const with Link for the Database */
const BASE_URL = 'https://remotestorage-162fc-default-rtdb.europe-west1.firebasedatabase.app/';
/** Object with all html Objects for Login */
let elementLoginRev = {
    email: document.getElementById("txtEMail"),
    password: document.getElementById("txtPassword"),
    loginStatus: document.getElementById("loginStatus"),
    splashLogo: document.querySelector('.logoSplash'),
    pageContent: document.getElementById('pageContent'),
    togglePassword: document.getElementById("togglePassword")
}
// ############################# event Listener for Objects of Login ####################
elementLoginRev.email.addEventListener("change", () => {
    emailCheck();
});

elementLoginRev.password.addEventListener("focus", () => {
    elementLoginRev.password.classList.remove("inputFail");
    elementLoginRev.password.classList.add("inputFocus");
    elementLoginRev.password.classList.remove('formPassIcon');
    elementLoginRev.password.classList.add('formPassHidden');
    elementLoginRev.togglePassword.style.display = "block";
});

elementLoginRev.togglePassword.addEventListener("click", () => {
  const isHidden = elementLoginRev.password.type === "password";
  elementLoginRev.password.type = isHidden ? "text" : "password";
  if (isHidden) {
    elementLoginRev.togglePassword.classList.add("visible");
  } else {
    elementLoginRev.togglePassword.classList.remove("visible");
  }
});

elementLoginRev.password.addEventListener("blur", () => {
    elementLoginRev.password.classList.remove("inputFocus");
});

elementLoginRev.email.addEventListener("focus", () => {
    elementLoginRev.email.classList.remove("inputFail");
    elementLoginRev.email.classList.add("inputFocus");
});

elementLoginRev.email.addEventListener("blur", () => {
    emailCheck();
    elementLoginRev.email.classList.remove("inputFocus");
});

// ########################## functions ####################

/** Start function when the page is loading */
async function onloadFunc() {
    userObj = await getAllUsers("joinUsers");
    animateLogo();
}

function animateLogo() {
    elementLoginRev.splashLogo.classList.add('animate');
    document.body.classList.add("mobileBodyStart");

    elementLoginRev.splashLogo.addEventListener('transitionend', () => {
        setTimeout(() => {
            elementLoginRev.splashLogo.classList.add('d-None');
            elementLoginRev.pageContent.classList.remove('d-None');
            document.body.classList.remove("mobileBodyStart");
        }, 200);
    }, { once: true });
}

/** loaad all useres are storred in Database
 * @param {string} path ky of the first Level of database
 * @returns json of the reqest  */
async function getAllUsers(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();

    return responseToJson;
}

/**  start of Login Seassion  */
function userLogin() {
    if (validEmail == false) { return; };

    let selUser = null;
    selUser = checkUserDatabase(selUser);

    if (selUser) {
        rightUserLogin(selUser);
    } else {
        wrongUserLogin()
    }
}

/** check if User is part of Database
 * @param {Object} selUser selected User  */
function checkUserDatabase(selUser) {
    for (const userId in userObj) {
        const user = userObj[userId];
        if (
            user.mail.toLowerCase() === elementLoginRev.email.value.toLowerCase() &&
            user.password === elementLoginRev.password.value
        ) {
            return user;
        }
    }
}

/** correct User and Password have been entered 
 * @param {Object} selUser selected User */
function rightUserLogin(selUser) {
    const ACTUAL_USER = {
        name: selUser.name,
        mail: selUser.mail
    };

    sessionStorage.setItem("loggedInUser", JSON.stringify(ACTUAL_USER));

    //sessionStorage.setItem("loggedInUser", selUser.name);
    window.location.href = './summary.html';
}

/** wrong User and Passwort have been entered */
function wrongUserLogin() {
    resetLoginElemnts();
    elementLoginRev.loginStatus.innerHTML = "Check your email and password. Please try again.";
    elementLoginRev.email.classList.add("inputFail");
    elementLoginRev.password.classList.add("inputFail");
}

/** Check if email is Valid. If wrong format input of LoginPage and give input */
function emailCheck() {
    validEmail = checkValidEmail(elementLoginRev.email.value);
    if (validEmail == true) {
        elementLoginRev.loginStatus.innerHTML = "";
    } else {
        elementLoginRev.email.classList.add("inputFail");
        elementLoginRev.loginStatus.innerHTML = "Please enter a valid email address";
    }
}

/** Guest User Login  */
function userGuestLogin() {
        const ACTUAL_USER = {
        name: "Guest",
        mail: "guest@test.de"
    };

    sessionStorage.setItem("loggedInUser", JSON.stringify(ACTUAL_USER));
    window.location.href = './summary.html';
}

/** Reset all classes for Status Change */
function resetLoginElemnts() {
    elementLoginRev.email.classList.remove("inputFail");
    elementLoginRev.email.classList.remove("inputFocus");

    elementLoginRev.password.classList.remove("inputFail");
    elementLoginRev.password.classList.remove("inputFocus");
}


