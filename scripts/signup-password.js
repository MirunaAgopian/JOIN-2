/**
 * HTML DOM definition for signup elements
 */
let elementSignupRev = {
    password: document.getElementById("create_pw"),
    togglePassword: document.getElementById("togglePassword"),
    confirmPassword: document.getElementById("create_confirm_pw"),
    toggleConfirmPassword: document.getElementById("toggleConfirmPassword")
}

/**
 * Toggle the visibility of a password input field between "password" and "text".
 *
 * @param {HTMLInputElement} element - The input field whose type should be toggled.
 */
function togglePasswordInput(element) {
    const isHidden = element.type === "password";
    element.type = isHidden ? "text" : "password";
    element.classList.remove("bg-img-lock");
    if (isHidden) {
        element.classList.remove("bg-img-invisible");
        element.classList.add("bg-img-visible");
    } else {
        element.classList.remove("bg-img-visible");
        element.classList.add("bg-img-invisible");
    }
}

/**
 * Reset the given input field back to type "password" and update its icon classes.
 *
 * @param {HTMLInputElement} element - The input field to reset.
 */
function resetInputToPassword(element) {
    element.type = "password";
    element.classList.remove("bg-img-visible");
    element.classList.add("bg-img-invisible");
}

/**
 * EventListener for toggle icon of password field
 */
elementSignupRev.togglePassword.addEventListener("click", () => {
    togglePasswordInput(elementSignupRev.password);
});

/**
 * EventListener for toggle icon of confirm password field
 */
elementSignupRev.toggleConfirmPassword.addEventListener("click", () => {
    togglePasswordInput(elementSignupRev.confirmPassword);
});

/**
 * EventListener: reset password field when focus is lost
 */
elementSignupRev.password.addEventListener("blur", () => {
    resetInputToPassword(elementSignupRev.password);
});

/**
 * EventListener: reset confirm password field when focus is lost
 */
elementSignupRev.confirmPassword.addEventListener("blur", () => {
    resetInputToPassword(elementSignupRev.confirmPassword);
});
