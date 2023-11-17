
function onChangeName() {

    const valid = toggleNameErrors();
    toggleButtonsDisable(valid);
}

function onChangeEmail() {
    const valid = toggleEmailErrors();
    toggleButtonsDisable(valid);
}

function onChangePassword() {
    const valid = togglePasswordErrors();
    toggleButtonsDisable(valid);
}

function onChangeUserName() {
    const valid = toggleUsernameErrors();
    toggleButtonsDisable(valid);
}

function onChangeDate() {
    const valid = toggleDateErrors();
    toggleButtonsDisable(valid);
}

function toggleButtonsDisable(valid) {
    form.loginButton().disabled = !valid;
    form.registerButton().disabled = !valid;
}

const form = {
    name: () => document.getElementById("nome"),
    nameRequiredError: () => document.getElementById("name-required-error"),
    nameInvalidError: () => document.getElementById("name-invalid-error"),
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    passwordInvalidError: () => document.getElementById("password-invalid-error"),
    userName: () => document.getElementById("user_name"),
    usernameRequiredError: () => document.getElementById("username-required-error"),
    usernameInvalidError: () => document.getElementById("username-invalid-error"),
    dtNasc: () => document.getElementById("dt_nasc"),
    dtRequiredError: () => document.getElementById("dt-required-error"),
    dtInvalidError: () => document.getElementById("dt-invalid-error"),
    loginButton: () => document.getElementById("login-button"),
    registerButton: () => document.getElementById("register-button"),
};

function toggleNameErrors() {
    const name = form.name().value;

    if (!name) {
        form.nameRequiredError().style.display = "block";
        form.nameInvalidError().style.display = "none";
        return false;
    }

    form.nameRequiredError().style.display = "none";
    form.nameInvalidError().style.display = validate_name(name) ? "none" : "block";
    return validate_name(name);
}


function toggleEmailErrors() {
    const email = form.email().value;

    if (!email) {
        form.emailRequiredError().style.display = "block";
        form.emailInvalidError().style.display = "none";
        return false;
    }

    form.emailRequiredError().style.display = "none";
    form.emailInvalidError().style.display = validate_email(email) ? "none" : "block";
    return validate_email(email);
}

function togglePasswordErrors() {
    const password = form.password().value;

    if (!password) {
        form.passwordRequiredError().style.display = "block";
        form.passwordInvalidError().style.display = "none";
        return false;
    }

    form.passwordRequiredError().style.display = "none";
    form.passwordInvalidError().style.display = validate_password(password) ? "none" : "block";
    return validate_password(password);
}

function toggleUsernameErrors() {
    const userName = form.userName().value;

    if (!userName) {
        form.usernameRequiredError().style.display = "block";
        form.usernameInvalidError().style.display = "none";
        return false;
    }

    form.usernameRequiredError().style.display = "none";
    form.usernameInvalidError().style.display = validate_username(userName) ? "none" : "block";
    return validate_username(userName);
}

function toggleDateErrors() {
    const dtNasc = form.dtNasc().value;
    if (!dtNasc) {
        form.dtRequiredError().style.display = "block";
        form.dtInvalidError().style.display = "none";
        return false;
    }

    form.dtRequiredError().style.display = "none";
    form.dtInvalidError().style.display = validate_dt(dtNasc) ? "none" : "block";
    return validate_dt(dtNasc);
}
// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        return true
    } else {
        return false
    }
}

function validate_password(password) {
    if (password == null) {
        return false;
    }

    if (password.length < 6) {
        return false;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return false;
    }

    if (!/\d/.test(password)) {
        return false;
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
        return false;
    }

    if (/\s/.test(password)) {
        return false;
    }

    return true;
}


function validate_dt(dateOfBirth) {

    if (dateOfBirth == null) {
        return false
    }

    var dob = new Date(dateOfBirth);

    var currentDate = new Date();

    var age = currentDate.getFullYear() - dob.getFullYear();

    if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() &&
            currentDate.getDate() < dob.getDate())
    ) {
        age--;
    }

    if (age >= 18 && age <= 120) {
        return true;
    }
    return false;
}

function validate_name(name) {
    if (name.length < 6) {
        return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return false;
    }
    return true;
}

function validate_username(user_name) {
    if (user_name == null) {
        return false
    }

    if (/\s/.test(user_name)) {
        return false;
    }

    if (user_name.length < 6) {
        return false;
    }
    return true;
}  