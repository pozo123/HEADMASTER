var rama_bd_personal = "personal";
var rama_bd_personal_v2 = "version2/personal/colaboradores"
var id_loginEmail = "loginEmail";
var id_password = "loginPassowrd";

var btn_forgot_password = "btn_forgot_password";
var btn_iniciar_sesion = "iniciarSesion";

var areas_array = [];

$(document).ready(function() {
    areas_array = [];
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            firebase.database().ref(rama_bd_personal_v2 + "/" + user.uid + "/areas").once('value').then(function(snapshot_v2){
                if(snapshot_v2.exists()){
                    var areas = snapshot_v2.val();
                    if(areas.produccion || areas.compras || areas.rrhh){
                        window.location.assign("headmaster.html");
                    } else if(areas.proyectos){
                        window.location.assign("proyectos.html");
                    } else {
                        window.location.assign("administracion.html");
                    };
                } else {
                    firebase.database().ref(rama_bd_personal + "/" + user.uid + "/areas").once('value').then(function(snapshot){
                        snapshot.forEach(function(childSnapshot){
                            if(childSnapshot.val()){
                                areas_array[areas_array.length] = childSnapshot.key;
                            }
                        });
                        if(areas_array.length > 0){              
                            window.location.assign(areas_array[0] + ".html");
                        } else {
                            alert("No tienes área asignada, contacta a un administrador de sistema.")
                        };
                    });
                };
            });
        } 
    }); 
});

$('#' + btn_iniciar_sesion).click(function () { 
    var userEmail = document.getElementById(id_loginEmail).value;
    var userPass = document.getElementById(id_password).value;
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage);
    }); 
});

$('#' + btn_forgot_password).click(function () { 
    var emailAddress = document.getElementById("loginEmail").value;
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      alert("Se ha enviado un correo (al email registrado) para que puedas cambiar la contraseña.");
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
});