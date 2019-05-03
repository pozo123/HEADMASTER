// JavaScript source code
var id_nombre_colaborador_rrhh = "colaboradorNombreRRHH";
var id_nickname_colaborador_rrhh = "colaboradorNicknameRRHH";
var id_email_colaborador_rrhh = "colaboradorEmailRRHH";
var id_password_colaborador_rrhh = "colaboradorPwdRRHH";

var id_registrar_button_colaborador_rrhh = "registrarColaboradorRRHH";

var rama_bd_colaboradores_rrhh = "rrhh/colaboradores";
var rama_bd_personal = "personal";

$(document).ready(function(){
});

var existe = false;
$("#" + id_email_colaborador_rrhh).change(function(){
    existe = false;
    firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
        var nombre = "";
        var nickname = "";
        snapshot.forEach(function(child_snap){
            var pers = child_snap.val();
            if(pers.email == $("#" + id_email_colaborador_rrhh).val()){
                existe = true;
                nombre = pers.nombre;
                nickname = pers.nickname;
            }
        });
        if(existe){
            $('#' + id_nombre_colaborador_rrhh).val(nombre);
            $('#' + id_nickname_colaborador_rrhh).val(nickname);
            document.getElementById(id_nombre_colaborador_rrhh).disabled = true;
            document.getElementById(id_nickname_colaborador_rrhh).disabled = true;
            document.getElementById(id_password_colaborador_rrhh).disabled = true;
        } else {
            if(document.getElementById(id_nombre_colaborador_rrhh).disabled == true){
                $('#' + id_nombre_colaborador_rrhh).val("");
                $('#' + id_nickname_colaborador_rrhh).val("");
            }
            document.getElementById(id_nombre_colaborador_rrhh).disabled = false;
            document.getElementById(id_nickname_colaborador_rrhh).disabled = false;
            document.getElementById(id_password_colaborador_rrhh).disabled = false;
        }
    });
});

$('#' + id_registrar_button_colaborador_rrhh).click(function () {
    if(!$('#' + id_nombre_colaborador_rrhh).val() || !$('#' + id_email_colaborador_rrhh).val() || (document.getElementById(id_password_colaborador_rrhh).disabled == false && !$('#' + id_password_colaborador_rrhh).val()) || !$('#' + id_nickname_colaborador_rrhh).val()){
        alert("Llena todos los campos requeridos");
    } else {
        if(existe){
            firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_colaborador_rrhh).val()).once('child_added').then(function(snapshot){
                var pers = snapshot.val();
                guardaDatosColRRHH(pers);
                var tru = true;
                firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/rrhh").set(tru);
            });
        } else {
            secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador_rrhh).val(), $('#' + id_password_colaborador_rrhh).val())
                .then(function (result) {
                    guardaDatosColRRHH(result.user);
                    guardaDatosPersonalRRHH(result.user, $('#' + id_nombre_colaborador_rrhh).val(), $('#' + id_nickname_colaborador_rrhh).val());
                    secondaryApp.auth().signOut();
                }
            );
        }
    }
});

function guardaDatosPersonalRRHH(user, nombre, nickname) {
    var areas = {
        //proyectos: true,
        //produccion: true,
        rrhh: true,
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

function guardaDatosColRRHH(user) {
    var colaborador = {
        uid: user.uid,
        nombre: $('#' + id_nombre_colaborador_rrhh).val(),
        email: user.email,
        nickname: $('#' + id_nickname_colaborador_rrhh).val(),
    }

    firebase.database().ref(rama_bd_colaboradores_rrhh + "/" + user.uid).set(colaborador);
    alert("¡Alta exitosa!")
}
