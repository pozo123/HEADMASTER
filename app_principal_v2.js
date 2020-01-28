var version;
var fotoSeleccionada = ""
var id_newpassword_perfil = "newpass";
var id_confirmpass_perfil = "confirm";
var id_cambiarpassword_button_perfil = "button_cambio_contraseña";
var id_week_label = "weekLabel";

var areas_usuario_global;
var creden_usuario_global;
var uid_usuario_global;

var nombre_obras = {};
var json_personal = {};

var id_div_dropdown_areas = "dropdown_areas";

var version = "version2";

var rama_bd_personal = version + "/personal";
var rama_bd_obras = version + "/obras";
var rama_bd_clientes = version + "/clientes";
var rama_bd_pda = version + "/pda";
var rama_bd_datos_referencia = version + "/datos_referencia";
var rama_bd_mano_obra= version + "/rrhh/mano_obra"
var rama_bd_nomina = version + "/rrhh/nomina"
var rama_bd_pagos = version + "/administracion/pagos"
var rama_bd_info_web = "info_web";
var rama_bd_insumos = version + "/insumos";

var rama_storage_personal = version + "/personal";

var options_semanas = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric'};
var options_nomina = { weekday: 'short',day: 'numeric'};


var starting_year = 2019;
var actual_week = getWeek(new Date())[0];
var actual_year = getWeek(new Date())[1];

$(document).ready(function() {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    $(function () {
        $('[data-toggle="popover"]').popover()
    });

    firebase.database().ref("info_web").once('value',function(snapshot){
        version = snapshot.child("version").val();
        verifyVersion();
    });

    document.getElementById(id_week_label).innerHTML = "Semana " + getWeek(new Date().getTime())[0];
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        $('body').removeClass("hidden");
        uid_usuario_global = user.uid;
        firebase.database().ref(rama_bd_personal + "/colaboradores").on('value', function (snapshot) {
            var user_personal = snapshot.child(user.uid).val();

            areas_usuario_global = user_personal.areas;
            creden_usuario_global = user_personal.credenciales;

            // activar pestañas
            for(key in areas_usuario_global){
                if(areas_usuario_global[key] == true){
                    $("." + key).removeClass("hidden");
                } else {
                    $("." + key).addClass("hidden");
                }
            };

            if(creden_usuario_global == 3){
                $(".creden-3").removeClass("hidden");
                $(".creden-2").addClass("hidden");
                $(".creden-1").addClass("hidden");
                $(".creden-0").addClass("hidden");
            } else if(creden_usuario_global == 2){
                $(".creden-3").removeClass("hidden");
                $(".creden-2").removeClass("hidden");
                $(".creden-1").addClass("hidden");
                $(".creden-0").addClass("hidden");
            } else if(creden_usuario_global == 1) {
                $(".creden-3").removeClass("hidden");
                $(".creden-2").removeClass("hidden");
                $(".creden-1").removeClass("hidden");
                $(".creden-0").addClass("hidden");
            } else {
                $(".creden-3").removeClass("hidden");
                $(".creden-2").removeClass("hidden");
                $(".creden-1").removeClass("hidden");
                $(".creden-0").removeClass("hidden");
            }

            if(user_personal.foto_url){
                var imagen = document.getElementById("img_foto");
                imagen.src = user_personal.foto_url;
            }
            var usuarioNombre = document.getElementById('usuarioConectado');
            usuarioNombre.innerHTML = user_personal.nickname;

            $('.loader').removeClass("hidden");
        });
    } else {
        window.location.assign("index.html");
    }
});

function verifyVersion() {
    firebase.database().ref("info_web").on('value',function(snapshot){
        var info = snapshot;
        var ver = info.child("version").val();
        if(ver !== version){
            location.reload();
        }
    });
}

function openTabs(tabLink, tabName) {
    var i;
    var tabContent;
    var tabLinks;
    tabContent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabContent.length; i++) {
        $(tabContent[i]).addClass('hidden');
    }

    tabLinks = document.getElementsByClassName("tab");

    for (i = 0; i < tabLinks.length; i++) {
        $(tabLinks[i]).removeClass('active');
    }

    $("#"+tabName).removeClass('hidden');
    $("#"+tabLink).addClass('active');
};

$('#fotoPersonal_input').on("change", function(event){
    fotoSeleccionada = event.target.files[0];
    $('#seleccionarFotoPersonal').addClass("hidden");
    $('#subirFotoPersonal').removeClass("hidden");
});

function subirFotoPersonal(){
    var fileName = fotoSeleccionada.name;
    var storageRef = firebase.storage().ref(rama_storage_personal + "/colaboradores/" + uid_usuario_global + "/" + fileName);

    var uploadTask = storageRef.put(fotoSeleccionada);

    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
    }, function(error) {
        // Handle unsuccessful uploads
        console.log(error);
    }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            var updates = {}

            updates[rama_bd_personal + "/colaboradores/" + uid_usuario_global + "/foto_url"] = downloadURL;
            firebase.database().ref().update(updates);
        });
    });
}

$('#' + id_cambiarpassword_button_perfil).click(function () {
    if($('#' + id_newpassword_perfil).val() != $('#' + id_confirmpass_perfil).val())
        alert("No coinciden las nuevas contraseñas");
    else{
        var newPassword = $('#' + id_newpassword_perfil).val();
        var user = firebase.auth().currentUser;
        user.updatePassword(newPassword).then(function(){
            //firebase.database().ref(rama_bd_inges + "/" + username + "/password").set(newPassword);
            $('#contraseñaModal').modal('toggle');
            $('#' + id_newpassword_perfil).val("");
            $('#' + id_newpassword_perfil).val("");
            alert("Se realizó el cambio de contraseña de manera satisfactoria.");
        }).catch(function(error){
            alert(error);
        });
    };
});

$("#show_hide_password button").on('click', function(event) {
    event.preventDefault();
    if($('#show_hide_password input').attr("type") == "text"){
        $('#show_hide_password input').attr('type', 'password');
        $('#show_hide_password i').addClass( "fa-eye-slash" );
        $('#show_hide_password i').removeClass( "fa-eye" );
    }else if($('#show_hide_password input').attr("type") == "password"){
        $('#show_hide_password input').attr('type', 'text');
        $('#show_hide_password i').removeClass( "fa-eye-slash" );
        $('#show_hide_password i').addClass( "fa-eye" );
    }
});

$("#show_hide_password1 button").on('click', function(event) {
    event.preventDefault();
    if($('#show_hide_password1 input').attr("type") == "text"){
        $('#show_hide_password1 input').attr('type', 'password');
        $('#show_hide_password1 i').addClass( "fa-eye-slash" );
        $('#show_hide_password1 i').removeClass( "fa-eye" );
    }else if($('#show_hide_password1 input').attr("type") == "password"){
        $('#show_hide_password1 input').attr('type', 'text');
        $('#show_hide_password1 i').removeClass( "fa-eye-slash" );
        $('#show_hide_password1 i').addClass( "fa-eye" );
    }
});

$("#cerrarSesion").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
        console.log("Sucedió un error al cerrar sesión")
    });
    alert("Inicia sesión para entrar a comunidad");
}));

var idioma_espanol = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
}
