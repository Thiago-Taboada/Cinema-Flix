// FIREBASE AND EXTRA VALIDATIONS
document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        const restrictedBodies = document.querySelectorAll('.restricted');
        const loginPage = window.location.href.endsWith('index.html');

        if (user) {
            restrictedBodies.forEach(body => {
                body.style.display = 'block';
            });
        } else {
            restrictedBodies.forEach(body => {
                body.style.display = 'none';
            });
        }

        if (!user && !loginPage) {
            
            window.location.href = "index.html";
        }
    })
});

const firebaseConfig = {
    apiKey: "AIzaSyDrLvy384Zgqli1ru50VuoZhL2qu69GC6g",
    authDomain: "cineflix-4b1aa.firebaseapp.com",
    projectId: "cineflix-4b1aa",
    storageBucket: "cineflix-4b1aa.appspot.com",
    databaseURL: "https://cineflix-4b1aa-default-rtdb.firebaseio.com/",
    messagingSenderId: "542686761142",
    appId: "1:542686761142:web:5cd7a5976705ae594a1617",
    measurementId: "G-FM4XWCE8VE"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()
const errorMessage = document.getElementById("error-message");
const formType = document.querySelectorAll('.form_content_container .change_form');
formType.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.id;
        if (id === 'frm-to-register') {
            var hideElements = document.getElementsByClassName('login');
            var showElements = document.getElementsByClassName('register');
        } else if (id === 'frm-to-login') {
            var hideElements = document.getElementsByClassName('register');
            var showElements = document.getElementsByClassName('login');
        }

        for (var i = 0; i < hideElements.length; i++) {
            hideElements[i].style.display = 'none';
        }
        for (var i = 0; i < showElements.length; i++) {
            showElements[i].style.display = 'block';
        }
    });
});


function register() {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    nome = document.getElementById('nome').value
    user_name = document.getElementById('user_name').value
    dt_nasc = document.getElementById('dt_nasc').value
    errorMessage.style.display = "none"

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log('Email ou senha estão incorretos!!')
        errorMessage.innerHTML = "Email ou senha estão incorretos!!";
        errorMessage.style.display = "block";
        return
    }
    if (validate_name(nome) == false || validate_username(user_name) == false) {
        console.log('Um ou mais campos estão incorretos!!')
        errorMessage.innerHTML = "Um ou mais campos estão incorretos!!";
        errorMessage.style.display = "block";
        return
    }

    if (validate_dt(dt_nasc) == false) {
        console.log('Você precisa ter no minimo 18 anos para poder criar uma conta!!')
        errorMessage.innerHTML = "Você precisa ter no minimo 18 anos para poder criar uma conta!!";
        errorMessage.style.display = "block";
        return
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            var user = auth.currentUser

            var database_ref = database.ref()

            var user_data = {
                email: email,
                nome: nome,
                user_name: user_name,
                dt_nasc: dt_nasc,
                last_login: Date.now()
            }

            database_ref.child('users/' + user.uid).set(user_data)

            alert('Usuario cadastrado!')
        })
        .catch(function (error) {
            getErrorMessage(error)
        })
}

function login() {
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    errorMessage.style.display = "none";

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log('Email ou senha estão incorretos!!')
        errorMessage.innerHTML = "Email ou senha estão incorretos!!";
        errorMessage.style.display = "block";
        return
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            var user = auth.currentUser

            var database_ref = database.ref()

            var user_data = {
                last_login: Date.now()
            }

            database_ref.child('users/' + user.uid).update(user_data)

            alert('Fazendo login!!')

        })
        .then(function () {
            window.location.href = "index.html";
        })
        .catch(function (error) {
            getErrorMessage(error)
        })
}

function logout() {
    auth.signOut()
        .then(function() {
            window.location.href = "login.html";
        })
        .catch(function(error) {
            console.log('Error al desconectar el usuario:', error);
        });
}

function getErrorMessage(error) {
    let msg
    if (error.code == "auth/user-not-found") {
        msg = "Usuário nao encontrado";
    }
    if (error.code == "auth/internal-error") {
        msg = "Verifique os campos e tente novamente!";
    }
    if (error.code == "auth/email-already-in-use") {
        msg = "Este email ja esta em uso!";
    }
    // console.log(error.code)
    // console.log(error.message)

    errorMessage.innerHTML = msg;
    errorMessage.style.display = "block";
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

    if(age >= 18 || age <= 120){   
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