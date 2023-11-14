// FIREBASE AND VALIDATIONS
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
//const app = initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()

const navLinks = document.querySelectorAll('.form_content_container .change_form');
navLinks.forEach(link => {
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
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    nome = document.getElementById('nome').value
    user_name = document.getElementById('user_name').value
    dt_nasc = document.getElementById('dt_nasc').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email ou senha estão incorretos!!')
        return
        // Don't continue running the code
    }
    if (validate_name(nome) == false || validate_username(user_name) == false) {
        alert('Um ou mais campos estão incorretos!!')
        return
    }

    if (validate_dt(dt_nasc) == false) {
        alert('Você precisa ter no minimo 18 anos para poder criar uma conta!!')
        return
    }

    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            var user = auth.currentUser

            // Add this user to Firebase Database
            var database_ref = database.ref()

            // Create User data
            var user_data = {
                email: email,
                nome: nome,
                user_name: user_name,
                dt_nasc: dt_nasc,
                last_login: Date.now()
            }

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data)

            // DOne
            alert('Usuario cadastrado!')
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })
}

// Set up our login function
function login() {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email ou senha estão incorretos!!')
        return
        // Don't continue running the code
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            var user = auth.currentUser

            // Add this user to Firebase Database
            var database_ref = database.ref()

            // Create User data
            var user_data = {
                last_login: Date.now()
            }

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).update(user_data)

            // DOne
            alert('Fazendo login!!')

        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })
}




// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        // Email is good
        return true
    } else {
        // Email is not good
        return false
    }
}

function validate_password(password) {
    if (password == null) {
        return false
    }

    if (password.length < 6) {
        return false;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
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