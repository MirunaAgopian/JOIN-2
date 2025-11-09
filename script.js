//  joinUsers

userObj = {
    "name" : "Benjamin",
    "mail" : "benjamin@test.de",
    "password" : "Ben123"
};

/** Logot the current USer from seassion and fowerd to the login Page */
function logOut(){
    sessionStorage.clear();
    window.location.href = './login.html'
}

/**
 * Generates an abbreviated identifier from a user's name.
 *
 * If the name contains two or more words, the function returns the uppercase initials
 * of the first two words. If the name contains only one word, it returns the uppercase
 * initial of that word. Leading and trailing whitespace is trimmed before processing.
 *
 * @param {string} name - The full name of the user.
 * @returns {string} The generated initials based on the user's name.
 */

function getUserItem(name) {
    let output = "";
    let parts = name.trim().split(" ");

    if (parts.length >= 2) {
        output = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    } else if (parts.length === 1) {
        output = parts[0].charAt(0).toUpperCase();
    }

    return output;
}

/** Check if the email Regex is valid
 * @param {string} email - Email address
 * @returns {boolean} - True if valid, false otherwise  */
function checkValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}