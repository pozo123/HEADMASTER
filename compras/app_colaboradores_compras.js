// JavaScript source code
var id_nombre_colaborador_compras = "colaboradorNombreCompras";
var id_nickname_colaborador_compras = "colaboradorNicknameCompras";
var id_email_colaborador_compras = "colaboradorEmailCompras";
var id_password_colaborador_compras = "colaboradorPwdCompras";

var id_registrar_button_colaborador_compras = "registrarColaboradorCompras";

var rama_bd_colaboradores_compras = "compras/colaboradores";
var rama_bd_personal = "personal";

$(document).ready(function(){
});

var existe = false;
$("#" + id_email_colaborador_compras).change(function(){
    existe = false;
    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        var nombre = "";
        var nickname = "";
        snapshot.forEach(function(child_snap){
            var pers = child_snap.val();
            if(pers.email == $("#" + id_email_colaborador_compras).val()){
                existe = true;
                nombre = pers.nombre;
                nickname = pers.nickname;
            }
        });
        if(existe){
            $('#' + id_nombre_colaborador_compras).val(nombre);
            $('#' + id_nickname_colaborador_compras).val(nickname);
            document.getElementById(id_nombre_colaborador_compras).disabled = true;
            document.getElementById(id_nickname_colaborador_compras).disabled = true;
            document.getElementById(id_password_colaborador_compras).disabled = true;
        } else {
            if(document.getElementById(id_nombre_colaborador_compras).disabled == true){
                $('#' + id_nombre_colaborador_compras).val("");
                $('#' + id_nickname_colaborador_compras).val("");
            }
            document.getElementById(id_nombre_colaborador_compras).disabled = false;
            document.getElementById(id_nickname_colaborador_compras).disabled = false;
            document.getElementById(id_password_colaborador_compras).disabled = false;
        }
    });
});

$('#' + id_registrar_button_colaborador_compras).click(function () {
    if(!$('#' + id_nombre_colaborador_compras).val() || !$('#' + id_email_colaborador_compras).val() || (document.getElementById(id_password_colaborador_compras).disabled == false && !$('#' + id_password_colaborador_compras).val()) || !$('#' + id_nickname_colaborador_compras).val()){
        alert("Llena todos los campos requeridos");
    } else {
        if(existe){
            firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_colaborador_compras).val()).once('child_added').then(function(snapshot){
                var pers = snapshot.val();
                guardaDatosColCompras(pers);
                var tru = true;
                firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/compras").set(tru);
            });
        } else {
            secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador_compras).val(), $('#' + id_password_colaborador_compras).val())
                .then(function (result) {
                    guardaDatosColCompras(result.user);
                    guardaDatosPersonalCompras(result.user, $('#' + id_nombre_colaborador_compras).val(), $('#' + id_nickname_colaborador_compras).val());
                    secondaryApp.auth().signOut();
                }
            );
        }
    }
});

function guardaDatosPersonalCompras(user, nombre, nickname) {
    var areas = {
        //proyectos: true,
        //produccion: true,
        compras: true,
        //administracion: false,
    }

    var persona = {
        uid: user.uid,
        nombre: nombre,
        email: user.email,
        nickname: nickname,
        areas: areas,
    }

    firebase.database().ref(rama_bd_personal + "/" + user.uid).update(persona);
    alert("¡Alta exitosa!")
}

function guardaDatosColCompras(user) {
    var colaborador = {
        uid: user.uid,
        nombre: $('#' + id_nombre_colaborador_compras).val(),
        email: user.email,
        nickname: $('#' + id_nickname_colaborador_compras).val(),
    }

    firebase.database().ref(rama_bd_colaboradores_compras + "/" + user.uid).set(colaborador);
    alert("¡Alta exitosa!")
}