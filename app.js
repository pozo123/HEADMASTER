var rama_bd_personal = "personal";
var id_loginEmail = "loginEmail";
var id_password = "loginPassowrd";

var btn_forgot_password = "btn_forgot_password";
var btn_iniciar_sesion = "iniciarSesion";

var areas_array = [];

$(document).ready(function() {
    areas_array = [];
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            console.log(user);
            firebase.database().ref(rama_bd_personal + "/" + user.uid + "/areas").once('value').then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    if(childSnapshot.val()){
                        areas_array[areas_array.length] = childSnapshot.key;
                    }
                });
                console.log(areas_array);
                if(areas_array.length > 0){              
                    window.location.assign(areas_array[0] + ".html");
                } else {
                    alert("No tienes área asignada, contacta a un administrador de sistema.")
                }
            });


        } 
    }); 
});

$('#' + btn_iniciar_sesion).click(function () { 


    var userEmail = document.getElementById(id_loginEmail).value;
    var userPass = document.getElementById(id_password).value;

    console.log(userPass);
    
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
            firebase.database().ref(rama_bd_personal + "/" + user.uid + "/areas").once('value').then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    if(childSnapshot.val()){
                        areas_array[areas_array.length] = childSnapshot.key;
                    }
                });
                console.log(areas_array);
                if(areas_array.length > 0){               
                    //window.location.assign(areas_array[0] + ".html");
                } else {
                    alert("No tienes área asignada, contacta a un administrador de sistema.")
                }
            });


        } 
    }); 
});

$('#' + btn_forgot_password).click(function () { 
    var auth = firebase.auth();
    firebase.auth().useDeviceLanguage();
    var emailAddress = document.getElementById("loginEmail").value;
    
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      alert("Email enviado!");
    }).catch(function(error) {
      // An error happened.
    });
});