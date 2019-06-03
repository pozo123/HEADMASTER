var rama_bd_personal = "personal";
var id_loginEmail = "loginEmail";
var id_password = "loginPassowrd";

var btn_forgot_password = "btn_forgot_password";
var btn_iniciar_sesion = "iniciarSesion";


$(document).ready(function() {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            firebase.database().ref(rama_bd_personal + "/" + user.uid + "/areas").once('value').then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    if(childSnapshot.val()){
                        var area = childSnapshot.key;
                        console.log(area);
                    }
                });
            });

        } else {
        }
    }); 
});

$('#' + btn_iniciar_sesion).click(function () { 
    var userEmail = document.getElementById(id_loginEmail).value;
    var userPass = document.getElementById(id_password).value;
    
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        //Abre modal con reset password
        window.alert("Error: " + errorMessage);
    });
    
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            // aquí escribir código
            
        } else {
            alert("No se pudo entrar al sistema. Contacta a algún administrador")
        }
    }); 
});

$('#' + btn_forgot_password).click(function () { 
    var auth = firebase.auth();
    firebase.auth().useDeviceLanguage();
    var emailAddress = document.getElementById("loginEmail").value;
    
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
});