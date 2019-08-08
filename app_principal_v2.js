var version;
var userPro = ""
var fotoSeleccionada = ""
var rama_storage_personal  = "personal"
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


var rama_bd_personal = "test/personal";
var rama_bd_obras = "test/obras";
var rama_bd_clientes = "test/clientes";

$(document).ready(function() {    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
    firebase.database().ref("info_web").once('value',function(snapshot){
        version = snapshot.child("version").val();
        verifyVersion();
    });
    document.getElementById(id_week_label).innerHTML = "Semana " + getWeek(new Date().getTime())[0];
});

$('#botonMagico').click(function(){
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        $('body').removeClass("hidden");
        uid_usuario_global = user.uid;
        userUID = user.uid;
        firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
            snapshot.forEach(function(obraSnap){
                var obra = obraSnap.val();
                nombre_obras[obraSnap.key] = {
                    procesos: {},
                    hojas: {},
                    num_procesos: obra.num_procesos,
                    supervisor: obra.supervisor,
                    terminada: obra.terminada,
                }
                obraSnap.child("procesos").forEach(function(procSnap){
                    var proc = procSnap.val();
                    nombre_obras[obraSnap.key]["procesos"][procSnap.key] = {nombre: proc.nombre, subprocesos: {}, num_subprocesos: proc.num_subprocesos};
                    if(procSnap.child("num_subprocesos").val() == 0 && procSnap.key != "ADIC" && procSnap.key != "PC00"){
                        nombre_obras[obraSnap.key]["hojas"][procSnap.key] = {nombre: proc.nombre};
                    }
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        var subp = subpSnap.val();
                        nombre_obras[obraSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key] = {nombre: subp.nombre};
                        nombre_obras[obraSnap.key]["hojas"][subpSnap.key] = {nombre: subp.nombre};
                    });
                });
            });
        });
        firebase.database().ref("personal").once('value').then(function (snapshot) {
            snapshot.forEach(function(persSnap){
                var pers = persSnap.val();
                json_personal[persSnap.key] = {nombre: pers.nombre, nickname: pers.nickname, areas: pers.areas, activo: pers.activo};
            });
            var user_personal = snapshot.child(user.uid).val();
            areas_usuario_global = user_personal.areas;
            creden_usuario_global = user_personal.credenciales;

            if(creden_usuario_global == 0){
                $("#tabReporteInvestime").removeClass('hidden');
                $('#botonMagicoAdmon').removeClass('hidden');
            } else {
                $("#tabReporteInvestime").addClass('hidden');
                $('#botonMagicoAdmon').addClass('hidden');
            }
            if(user_personal.foto){
                var imagen = document.getElementById("img_foto");
                imagen.src = user_personal.foto.url;
            }
            var usuarioNombre = document.getElementById('usuarioConectado');
            usuarioNombre.innerHTML = user_personal.nickname;
            
            $('.loader').removeClass("hidden");
        });
    } else {
        window.location.reload("index.html");
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
    var storageRef = firebase.storage().ref(rama_storage_personal + "/" + userUID + "/" + fileName);
    
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
    }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            var updates = {}
            var data = {
                url: downloadURL,
            }
            updates["/" + rama_bd_personal + "/" + userUID + "/foto"] = data;
            firebase.database().ref().update(updates);
            
            setTimeout(() => {
                location.reload();
            }, 3000);
        });
    });
}

$('#' + id_cambiarpassword_button_perfil).click(function () {
    if($('#' + id_newpassword_perfil).val() != $('#' + id_confirmpass_perfil).val())
        alert("Password doesn't match");
    else{
        var user = firebase.auth().currentUser;
        //var username = user.uid;
        var newPassword = $('#' + id_newpassword_perfil).val();
        user.updatePassword(newPassword).then(function(){
            //firebase.database().ref(rama_bd_inges + "/" + username + "/password").set(newPassword);
            alert("Cambio exitoso");
        }).catch(function(error){
            alert(error);
        });
    }

});

$("#cerrarSesion").click((function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
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