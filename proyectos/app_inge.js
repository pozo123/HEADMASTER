// JavaScript source code
var id_nombre_inge = "ingeNombre";
var id_email_inge = "ingeEmail";
var id_password_inge = "ingePwd";
var id_elec_checkbox_inge = "checkboxElectricidad";
var id_plom_checkbox_inge = "checkboxPlomeria";
var id_admin_radio_inge = "inlineRadio1";
var id_nickname_inge = "ingeNickname";
//var id_lider_radio_inge = "inlineRadio2";
var id_proyectista_radio_inge = "inlineRadio3";
//var id_obraAsignada_ddl_inge = "obraAsignada";
var id_registrar_button_inge = "registrarIngeniero";
var id_foto_input_inge = "foto";
var rama_bd_inges = "proyectos/inges";
var rama_bd_obras = "proyectos/obras";
var rama_bd_personal = "personal";
//var id_imprimir_button_inge = "imprimir";
//var id_uid_inge = "uid";

$(document).ready(function(){
    // var select = document.getElementById(id_obraAsignada_ddl_inge);
    // var option = document.createElement('option');
    // option.style = "display:none";
    // option.text = option.value = "";
    // select.appendChild(option);
    
    // firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
    //     var proy = snapshot.val();
    //     var option2 = document.createElement('option');
    //     option2.text = option2.value = proy.nombre; 
    //     select.appendChild(option2);
    // });
});

$('#' + id_registrar_button_inge).click(function () {
    if(!$('#' + id_nombre_inge).val() || !$('#' + id_email_inge).val() || !$('#' + id_password_inge).val()){
        alert("Llena todos los campos requeridos");
    } else {
        secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_inge).val(), $('#' + id_password_inge).val())
            .then(function (result) {
                guardaDatos(result.user);
                guardaDatosPersonalInge(result.user, $('#' + id_nombre_inge).val(), $('#' + id_nickname_inge).val());
                secondaryApp.auth().signOut();
            }, function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use') {
                    firebase.database().ref(rama_bd_personal).orderByChild('email').equalTo($('#' + id_email_inge).val()).once('value').then(function(snapshot){
                        var pers = snapshot.val();
                        guardaDatos(pers.uid);
                        var tru = true;
                        firebase.database().ref(rama_bd_personal + "/" + pers.uid + "/areas/proyectos").set(tru);
                    });
                } else {
                    alert(errorMessage);
                }
            });
        /*Para imprimir errores, .catch en vez de .then
         * .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            });*/
    }
});

function guardaDatosPersonalInge(user, nombre, nickname) {
    var areas = {
        proyectos: true,
        //produccion: false,
        //compras: false,
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

function guardaDatos(user) {
    var espec;
    var creden;
    if(document.getElementById(id_elec_checkbox_inge).checked == true){
        if(document.getElementById(id_plom_checkbox_inge).checked == true){
            espec = 3; //especialidad ambas
        }
        else
            espec = 1; //especialidad elec
    }
    else if(document.getElementById(id_plom_checkbox_inge).checked == true)
        espec = 2; //especialidad plom
    else espec = -1; //no ingresada

    if(document.getElementById(id_admin_radio_inge).checked == true){
        creden = 2;
        var perm = {
            alta_colaborador: true,
            alta_obra: true,
            alta_cliente: true,
            reporte: true,
            perfil: false,
            activar: true,
            alta_exc_reqs: true,
            alta_generos_tipos: true,
        }
    }
    /*else if(document.getElementById(id_lider_radio_inge).checked == true)
        creden = 2;*/
    else if(document.getElementById(id_proyectista_radio_inge).checked == true){
        creden = 3;
        var perm = {
            alta_colaborador: false,
            alta_obra: false,
            alta_cliente: false,
            reporte: true,
            perfil: true,
            activar: false,
            alta_exc_reqs: false,
            alta_generos_tipos: false,
        }
    }
    else {
        creden = 4; //No ingresada
        var perm = {
            alta_colaborador: false,
            alta_obra: false,
            alta_cliente: false,
            reporte: false,
            perfil: false,
            activar: false,
        }
    }
    
    var usuario = {
        uid: user.uid,
        nombre: $('#' + id_nombre_inge).val(),
        email: user.email,
        especialidad: espec,
        //proyecto_asignado: $('#' + id_obraAsignada_ddl_inge + " option:selected").val(),
        credenciales: creden,
        status: false,
        permisos: perm,
        nickname: $('#' + id_nickname_inge).val(),
        //foto: URL.createObjectURL($('#' + id_foto_input_inge).files[0])//A ver si jala...
    }

    firebase.database().ref(rama_bd_inges+"/" + user.uid).set(usuario);
    alert("¡Alta exitosa!")
}