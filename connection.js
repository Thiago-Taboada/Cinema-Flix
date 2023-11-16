// FIREBASE AND EXTRA VALIDATIONS
document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged(function (user) {
        const restrictedBodies = document.querySelectorAll(".restricted");
        const loginPage = window.location.href.endsWith("index.html");
        const favPage = window.location.href.endsWith("fav.html");

        if (user) {
            var fbuser = firebase.auth().currentUser;
            var uid = fbuser.uid;
            restrictedBodies.forEach((body) => {
                body.style.display = "block";
            });
        } else {
            restrictedBodies.forEach((body) => {
                body.style.display = "none";
            });
        }

        if (!user && !loginPage) {
            window.location.href = "index.html";
        }

        if (user && favPage) {
            listarVideosDeUsuario(uid);
        }
    });
});


const firebaseConfig = JSON.parse(process.env.SECRET_FIREBASE_CONFIG);

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
var storage = firebase.storage();
const errorMessage = document.getElementById("error-message");
const formPassword = document.getElementById("password");
var loginElements = document.getElementsByClassName('login');
var recoverElements = document.getElementsByClassName('recover');
var registerElements = document.getElementsByClassName('register');
const formType = document.querySelectorAll(
    ".form_content_container .change_form"
);
formType.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.id;
        if (id === 'frm-to-register') {
            hideElements(loginElements)
            hideElements(recoverElements)
            formPassword.style.display = 'block';
            showElements(registerElements)
        } else if (id === 'frm-to-login') {
            hideElements(recoverElements)
            hideElements(registerElements)
            formPassword.style.display = 'block';
            showElements(loginElements)
        } else if (id === 'frm-to-recover') {
            hideElements(registerElements)
            hideElements(loginElements)
            formPassword.style.display = 'none';
            showElements(recoverElements)
        }

        function hideElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
        }
        function showElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }
        }
    });
});


function toggleForm(formType) {
    const loginElements = document.getElementsByClassName('login');
    const registerElements = document.getElementsByClassName('register');
    const recoverButton = document.getElementById('recover-button');

    for (let i = 0; i < loginElements.length; i++) {
        loginElements[i].style.display = formType === 'login' ? 'block' : 'none';
    }

    for (let i = 0; i < registerElements.length; i++) {
        registerElements[i].style.display = formType === 'register' ? 'block' : 'none';
    }

    recoverButton.style.display = formType === 'recover' ? 'block' : 'none';
}


function register() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var nome = document.getElementById("nome").value;
    var user_name = document.getElementById("user_name").value;
    var dt_nasc = document.getElementById("dt_nasc").value;
    errorMessage.style.display = "none";

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log("Email ou senha estão incorretos!!");
        errorMessage.innerHTML = "Email ou senha estão incorretos!!";
        errorMessage.style.display = "block";
        return;
    }
    if (validate_name(nome) == false || validate_username(user_name) == false) {
        console.log("Um ou mais campos estão incorretos!!");
        errorMessage.innerHTML = "Um ou mais campos estão incorretos!!";
        errorMessage.style.display = "block";
        return;
    }

    if (validate_dt(dt_nasc) == false) {
        errorMessage.innerHTML =
            "Você precisa ter no mínimo 18 anos para poder criar uma conta!!";
        errorMessage.style.display = "block";
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;

            return user.sendEmailVerification();
        })
        .then(function () {
            var user = auth.currentUser;

            var database_ref = database.ref();

            var user_data = {
                email: email,
                nome: nome,
                user_name: user_name,
                dt_nasc: dt_nasc,
                last_login: Date.now(),
            };

            database_ref.child("users/" + user.uid).set(user_data);

            alert("Usuário cadastrado! Verifique seu email para ativar sua conta.");
            location.reload();
        })
        .catch(function (error) {
            getErrorMessage(error);
            console.log(error);
        });
}


function login() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    errorMessage.style.display = "none";

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log("Email ou senha estão incorretos!!");
        errorMessage.innerHTML = "Email ou senha estão incorretos!!";
        errorMessage.style.display = "block";
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;

            if (user && user.emailVerified) {
                var database_ref = database.ref();

                var user_data = {
                    last_login: Date.now(),
                };
                database_ref.child("users/" + user.uid).update(user_data);
                console.log("Fazendo login!!");
                window.location.href = "home.html";
            } else if (user) {
                // Usuario autenticado pero correo electrónico no verificado
                console.log("Por favor, verifique seu email antes de fazer o login.");
                errorMessage.innerHTML = "Por favor, verifique seu email antes de fazer o login.";
                errorMessage.style.display = "block";
                auth.signOut();
            }
        })
        .catch(function (error) {
            getErrorMessage(error);
        });
}


function logout() {
    auth
        .signOut()
        .then(function () {
            window.location.href = "index.html";
        })
        .catch(function (error) {
            console.log("Logout Error:", error);
        });
}

function recover() {
    const email = document.getElementById("email").value;

    if (validate_email(email)) {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("Foi enviado um e-mail de redefinição de senha. Por favor, verifique a sua caixa de entrada.");
                errorMessage.innerHTML = "Foi enviado um e-mail de redefinição de senha. Por favor, verifique a sua caixa de entrada.";
                errorMessage.style.display = "block";
            })
            .catch((error) => {
                getErrorMessage(error)
                alert("Erro ao enviar o email de redefinição.");
            });
    } else {
        alert("Por favor, insira um endereço de e-mail válido.");
        errorMessage.innerHTML = "Insira um endereço de e-mail válido.";
        errorMessage.style.display = "block";
    }
}


const openUpload = document.getElementById("open-upload");
const uploaContainer = document.getElementById("upload-container");

openUpload.addEventListener('click', (e) => {
    e.preventDefault();

    if (uploaContainer.style.display === 'none' || uploaContainer.style.display === '') {
        uploaContainer.style.display = 'flex';
    } else {
        uploaContainer.style.display = 'none';
    }
});


function handleFileChange() {
    var fileInput = document.getElementById("videoInput");
    var titleInput = document.getElementById("titleVideo");
    var uploadButton = document.getElementById("uploadButton");

    var isFileSelected = fileInput.files.length > 0;
    var isTitleEntered = titleInput.value.trim() !== "";

    uploadButton.disabled = !isFileSelected || !isTitleEntered;
}

function uploadVideo() {
    var fileInput = document.getElementById("videoInput");
    var titleInput = document.getElementById("titleVideo");
    var uploadContainer = document.getElementById("upload-container");
    var loadingElement = document.getElementById("loading");

    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var user = firebase.auth().currentUser;
        var uid = user.uid;

        var fileName = titleInput.value.trim() || file.name;

        var storageRef = storage.ref("videos/" + uid + "/" + fileName);
        var task = storageRef.put(file);

        loadingElement.style.display = "block";

        task.on(
            "state_changed",
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                loadingElement.innerText = " " + percentage.toFixed(2) + "%";
            },
            function error(err) {
                console.error("Upload Error: ", err);
            },
            function complete() {

                loadingElement.style.display = "none";
                uploadContainer.style.display = "none";
                location.reload();
            }
        );
    } else {
        alert("Nenhum video foi selecionado.");
    }
}



function listarVideosDeUsuario(uid) {
    var userVideosRef = storage.ref('videos/' + uid);
    userVideosRef.listAll()
        .then(function (result) {
            const videoMain = document.getElementById('video-main');

            result.items.forEach(function (video) {
                video.getDownloadURL().then(function (downloadURL) {
                    const { name } = video;

                    const videoEl = document.createElement('div');
                    videoEl.classList.add('video');
                    videoEl.innerHTML = `
                        <video src="${downloadURL}" class="video-element"></video>
                        <div class="video-info">
                            <h3>${name}</h3>
                            <br/>
                        </div>

                        <div class="resumo" id="resumo-${name}">
                            <h3>Resumo</h3>
                            <p>Vídeo enviado pelo usuário.</p>
                            <br/>
                            <div class="resumo-btn">
                              <button class="know-more" id="more-${name}">Mais Informações</button>
                              <button class="delete" id="delete-${name}">Excluir</button>
                            </div>
                        </div>
                    `;

                    videoMain.appendChild(videoEl);

                    document.getElementById(`more-${name}`).addEventListener('click', (e) => {
                        e.stopPropagation();
                        showVideoDetails(name, uid);
                    });

                    document.getElementById(`delete-${name}`).addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteVideo(name, uid);
                    });

                    document.getElementById(`resumo-${name}`).addEventListener('click', () => {
                        console.log("resumo clicked " + name);
                    });
                }).catch(function (error) {
                    console.error('Error URL video: ', error);
                });
            });
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

function showVideoDetails(name, uid) {
    var userVideoRef = storage.ref('videos/' + uid + '/' + name);

    userVideoRef.getDownloadURL()
        .then(function (downloadURL) {

            const detailsContainer = document.createElement('div');
            detailsContainer.classList.add('details-container');
            detailsContainer.id = "details-container";

            detailsContainer.innerHTML = `
                      <div class="video-details" id="details">
                        <i class="bx bx-x bx-tada" id="close-btn"></i>
                        <video src="${downloadURL}" controls class="video-player"></video>
                        <div class="resumo" id="resumo">
                          <div class="details-info">
                            <h3>${name}</h3>
                          </div>
                          </div>
                      </div>
                  `;
            document.body.appendChild(detailsContainer);
            document.body.classList.add('no-scroll');
            document.getElementById('close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                document.body.classList.remove('no-scroll');
                const element = document.getElementById("details-container");
                element.remove();
            });
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function deleteVideo(videoName, uid) {
    var videoRef = storage.ref('videos/' + uid + '/' + videoName);
    videoRef.delete()
        .then(function () {
            console.log('Deleted:', videoName);
            location.reload();
        })
        .catch(function (error) {
            console.error('Error deleting:', error);
        });
}


function getErrorMessage(error) {
    let msg;
    if (error.code == "auth/user-not-found") {
        msg = "Usuário nao encontrado";
    }
    if (error.code == "auth/internal-error") {
        msg = "Verifique os campos e tente novamente!";
    }
    if (error.code == "auth/email-already-in-use") {
        msg = "Este email ja esta em uso!";
    }
    if (error.code == "auth/too-many-requests") {
        msg = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login mal-sucedidas.";
    }
    console.log(error.code)
    console.log(error.message)

    errorMessage.innerHTML = msg;
    errorMessage.style.display = "block";
}

// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
        return true;
    } else {
        return false;
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
        return false;
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

    if (age >= 18 || age <= 120) {
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
        return false;
    }

    if (/\s/.test(user_name)) {
        return false;
    }

    if (user_name.length < 6) {
        return false;
    }

    return true;
}
