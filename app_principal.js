var version;
// Necesitamos cambiar a rama personal
var rama_bd_personal = "personal";
var userPro = ""
var fotoSeleccionada = ""
var rama_storage_personal  = "personal"
var id_newpassword_perfil = "newpass";
var id_confirmpass_perfil = "confirm";
var id_cambiarpassword_button_perfil = "button_cambio_contraseña";

var areas_usuario_global;
var creden_usuario_global;

$(document).ready(function() {    
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
    firebase.database().ref("info_web").once('value',function(snapshot){
        version = snapshot.child("version").val();
        verifyVersion();
    });
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        userUID = user.uid;
        if(user.uid == "sD2NRaTu4Ug4e0gqluYaHpxNZbP2" || user.uid == "WCpLarWgMKfwGsvAdrqlqjQxy243"){
            //$("#tabRegistrosAdmon").removeClass('hidden');AQUI descomentar
        } else {
            $("#tabRegistrosAdmon").addClass('hidden');
        }

        firebase.database().ref(rama_bd_personal).orderByChild('uid').equalTo(user.uid).once("child_added", function (snapshot) {
            var user_personal = snapshot.val();
            areas_usuario_global = user_personal.areas;
            creden_usuario_global = user_personal.credenciales;
            if(user_personal.foto){
                var imagen = document.getElementById("img_foto");
                imagen.src = user_personal.foto.url;
            }
            console.log(areas_usuario_global);

            /*if(Object.keys(areas_usuario_global).length > 1){
                areas_usuario_global.forEach(function(childSnapshot){
                    if(childSnapshot.val()){
                        console.log(childSnapshot.key);
                    }
                });
            }*/

            // Revisar esto
            var usuarioNombre = document.getElementById('usuarioConectado');
            usuarioNombre.innerHTML = user_personal.nickname;



        });
        $('body').removeClass("hidden");

    } else {
        alert("Inicia sesión para entrar a comunidad");
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

$('body').removeClass("hidden");

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
    
    location.reload();
}));