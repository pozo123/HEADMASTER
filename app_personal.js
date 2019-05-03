
// JavaScript source code
var id_nombre_personal = "personalNombre";
var id_email_personal = "personalEmail";
var id_password_personal = "personalPwd";
var id_nickname_personal = "personalNickname";
var id_registrar_button_personal = "registrarPersonal";

var rama_bd_personal = "personal";


$(document).ready(function(){

});

$('#' + id_registrar_button_personal).click(function () {
    if(!$('#' + id_nombre_personal).val() || !$('#' + id_email_personal).val() || !$('#' + id_password_personal).val()){
        alert("Llena todos los campos requeridos");
    } else {
        registrarPersonal($('#' + id_email_personal).val(), $('#' + id_password_personal).val(), $('#' + id_nombre_inge).val(), $('#' + id_nickname_inge).val());
    }
});

function registrarPersonal(email, password, nombre, nickname){
    secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(function (result) {
        guardaDatosPersonal(result.user, nombre, nickname);
        secondaryApp.auth().signOut();
    });
}

function guardaDatosPersonal(user, nombre, nickname) {
    var areas = {
        proyectos: false,
        produccion: false,
        compras: false,
        administracion: false,
    }
    
    var persona = {
        uid: user.uid,
        nombre: nombre,
        email: user.email,
        nickname: nickname,
        areas: areas,
    }

    firebase.database().ref(rama_bd_personal + "/" + user.uid).set(persona);
    alert("¡Alta exitosa!")
}
