/**
 * html DOM definition
 */
let elementSignupRev = {
    password: document.getElementById("create_pw"),
    togglePassword: document.getElementById("togglePassword"),
    confirmPassword: document.getElementById("create_confirm_pw"),
    toggleConfirmPassword: document.getElementById("toggleConfirmPassword")
}

/**
 * EventListener for toggle icon of password
 */
elementSignupRev.togglePassword.addEventListener("click", () => {
    const isHidden = elementSignupRev.password.type === "password";
    elementSignupRev.password.type = isHidden ? "text" : "password";
    elementSignupRev.password.classList.remove("bg-img-lock");
    if (isHidden) {
        elementSignupRev.password.classList.remove("bg-img-invisible");
        elementSignupRev.password.classList.add("bg-img-visible");
    } else {
        elementSignupRev.password.classList.remove("bg-img-visible");
        elementSignupRev.password.classList.add("bg-img-invisible");
    }
});

/**
 * EventListener for toggle icon of confirm password
 */
elementSignupRev.toggleConfirmPassword.addEventListener("click", () => {
    const isHidden = elementSignupRev.confirmPassword.type === "password";
    elementSignupRev.confirmPassword.type = isHidden ? "text" : "password";
    elementSignupRev.confirmPassword.classList.remove("bg-img-lock");
    if (isHidden) {
        elementSignupRev.confirmPassword.classList.remove("bg-img-invisible");
        elementSignupRev.confirmPassword.classList.add("bg-img-visible");
    } else {
        elementSignupRev.confirmPassword.classList.remove("bg-img-visible");
        elementSignupRev.confirmPassword.classList.add("bg-img-invisible");
    }
});
