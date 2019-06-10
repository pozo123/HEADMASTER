var version;
// Necesitamos cambiar a rama personal
var rama_bd_personal = "personal";
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

var id_div_dropdown_areas = "dropdown_areas";

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
    /*var rama_bd_pagos_nomina = "rrhh/pagos_nomina";
    var year = "2019";
    var week = "22";
    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week).once('value').then(function(snapshot){
        var total_week = 0;
        snapshot.forEach(function(childSnap){
            if(childSnap.key != "terminada" && childSnap.key != "total" && childSnap.key != "diversos_terminados" && childSnap.key != "horas_extra_terminadas" && childSnap.key != "asistencias_terminadas"){
                var total_obra = 0;
                childSnap.child("trabajadores").forEach(function(trabSnap){
                    var trab = trabSnap.val();
                    console.log("trab: " + trabSnap.key);
                    var tot_HE = isNaN(parseFloat(trab.total_horas_extra)) ? 0 : parseFloat(trab.total_horas_extra);
                    console.log("tot_HE: " + tot_HE);
                    var tot_as = isNaN(parseFloat(trab.total_asistencia)) ? 0 :  parseFloat(trab.total_asistencia);
                    console.log("tot_as: " + tot_as);
                    var tot_div = isNaN(parseFloat(trab.total_diversos)) ? 0 : parseFloat(trab.total_diversos);
                    console.log("tot_div: " + tot_div);
                    var imp_as = trab.impuestos == undefined ? 0 : (isNaN(parseFloat(trab.impuestos.impuestos_asistencia)) ? 0 : parseFloat(trab.impuestos.impuestos_asistencia));
                    console.log("imp_as: " + imp_as);
                    var imp_div = trab.impuestos == undefined ? 0 : (isNaN(parseFloat(trab.impuestos.impuestos_diversos)) ? 0 : parseFloat(trab.impuestos.impuestos_diversos));
                    console.log("imp_div: " + imp_div);
                    var imp_HE = trab.impuestos == undefined ? 0 : (isNaN(parseFloat(trab.impuestos.impuestos_horas_extra)) ? 0 : parseFloat(trab.impuestos.impuestos_horas_extra));
                    console.log("imp_HE: " + imp_HE);

                    var total_trab = tot_HE + tot_as + tot_div + imp_as + imp_div + imp_HE;
                    console.log("total_trab: " + total_trab);
                    total_obra = total_obra + total_trab;
                    firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/trabajadores/" + trabSnap.key + "/total").set(total_trab);
                    console.log(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/trabajadores/" + trabSnap.key + "/total");
                    console.log(total_trab);

                });
                firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/total").set(total_obra);
                console.log(rama_bd_pagos_nomina + "/" + year + "/" + week + "/" + childSnap.key + "/total");
                console.log(total_obra);

                total_week = total_week + total_obra;
            }
        });
        firebase.database().ref(rama_bd_pagos_nomina + "/" + year + "/" + week + "/total").set(total_week);
        console.log(rama_bd_pagos_nomina + "/" + year + "/" + week + "/total");
        console.log(total_week);
    });*/

    /*var sem = "23";
    firebase.database().ref("rrhh/trabajadores").once('value').then(function(snapshot){
        var updates = snapshot.val();
        snapshot.forEach(function(trabSnap){
            if(trabSnap.child("nomina/2019/" + sem + "/diversos").exists()){
                updates[trabSnap.key]["nomina"]["2019"][sem]["diversos"] = null;
            }
            if(trabSnap.child("nomina/2019/" + sem + "/total_diversos").exists()){
                updates[trabSnap.key]["nomina"]["2019"][sem]["total_diversos"] = null;
            }
            if(trabSnap.child("nomina/2019/" + sem + "/impuestos/impuestos_diversos").exists()){
                updates[trabSnap.key]["nomina"]["2019"][sem]["impuestos"]["impuestos_diversos"] = null;
            }
            if(trabSnap.child("nomina/2019/" + sem + "/impuestos/impuestos_asistencia").exists()){
                updates[trabSnap.key]["nomina"]["2019"][sem]["impuestos"]["impuestos_asistencia"] = null;
            }
            if(trabSnap.child("nomina/2019/" + sem + "/total_asistencia").exists()){
                updates[trabSnap.key]["nomina"]["2019"][sem]["total_asistencia"] = null;
            }
            if(trabSnap.child("nomina/2019/" + sem + "/total").exists()){
                updates[trabSnap.key]["nomina"]["2019"][sem]["total"] = null;
            }
        });
        console.log(updates);
        firebase.database().ref("rrhh/trabajadores").update(updates);
    });
                
    firebase.database().ref("rrhh/pagos_nomina/2019/" + sem).once('value').then(function(snapshot){
        var updates = snapshot.val();
        snapshot.forEach(function(obraSnap){
            if(obraSnap.key != "terminada" && obraSnap.key != "asistencias_terminadas" && obraSnap.key != "horas_extra_terminadas" && obraSnap.key != "diversos_terminados" && obraSnap.key != "total"){
                obraSnap.child("trabajadores").forEach(function(trabSnap){
                    if(trabSnap.child("diversos").exists()){
                        updates[obraSnap.key][trabSnap.key]["diversos"] = null;
                    }
                    if(trabSnap.child("diversos").exists()){
                        updates[obraSnap.key][trabSnap.key]["total_diversos"] = null;
                    }
                    if(trabSnap.child("impuestos/impuestos_diversos").exists()){
                        updates[obraSnap.key][trabSnap.key]["impuestos_diversos"] = null;
                    }
                    if(trabSnap.child("impuestos/impuestos_asistencia").exists()){
                        updates[obraSnap.key][trabSnap.key]["impuestos_asistencia"] = null;
                    }
                    if(trabSnap.child("total_asistencia").exists()){
                        updates[obraSnap.key][trabSnap.key]["total_asistencia"] = null;
                    }
                    if(trabSnap.child("total").exists()){
                        updates[obraSnap.key][trabSnap.key]["total"] = null;
                    }
                });
            }
        });
        console.log(updates);
        firebase.database().ref("rrhh/pagos_nomina/2019/" + sem).update(updates);
    });*/
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        uid_usuario_global = user.uid;
        userUID = user.uid;
        firebase.database().ref(rama_bd_personal).orderByChild('uid').equalTo(user.uid).once("child_added", function (snapshot) {
            var user_personal = snapshot.val();
            areas_usuario_global = user_personal.areas;
            creden_usuario_global = user_personal.credenciales;
            if(user.uid == "sD2NRaTu4Ug4e0gqluYaHpxNZbP2" || user.uid == "WCpLarWgMKfwGsvAdrqlqjQxy243"){
                $("#tabRegistrosAdmon").removeClass('hidden');
                $("#tabReporteInvestime").removeClass('hidden');
            } else {
                $("#tabRegistrosAdmon").addClass('hidden');
                $("#tabReporteInvestime").addClass('hidden');
            }

            if(creden_usuario_global == 0){
                $("#tabReporteInvestime").removeClass('hidden');
                $('#botonMagicoAdmon').removeClass('hidden');
            } else {
                $('#botonMagicoAdmon').addClass('hidden');
            }
            if(user_personal.foto){
                var imagen = document.getElementById("img_foto");
                imagen.src = user_personal.foto.url;
            }
            // Método para revisar que puedes entrar al html correspondiente, si no te regresa al index
            var area_bool = false;
            var url = document.URL.split("/");
            for(key in areas_usuario_global){
                if(areas_usuario_global[key] && ((url[url.length - 1] == key + ".html") || (url[url.length - 1] == key + ".html#"))){
                    area_bool = true;
                }
            }
            if(!area_bool){
                alert("es con refresh?")
                window.location.reload("index.html");
                window.location.assign("index.html");
            }
            // Dropdown Menu para cambiar entre áreas

            if(Object.keys(areas_usuario_global).length > 1){
                $('#' + id_div_dropdown_areas).removeClass('hidden');
                var div_dropdown_areas = document.getElementById(id_div_dropdown_areas);

                var button = document.createElement('button');
                var caret = document.createElement('span');
                var div = document.createElement('div');

                button.className = 'btn btn-primary dropdown-toggle';
                button.setAttribute("type", "button");
                button.setAttribute("data-toggle", "dropdown");
                button.innerHTML = "Cambiar de área";
                
                caret.className = 'caret';

                div.className = 'dropdown-menu';

                button.appendChild(caret);

                div_dropdown_areas.appendChild(button);
                var cant_areas = 0;
                for(key in areas_usuario_global){
                    if(areas_usuario_global[key]){
                        cant_areas++;
                        var link = document.createElement('a');
                        link.setAttribute('href', key + '.html');
                        link.innerHTML = key;
                        link.className = "dropdown-item"
                        div.append(link);
                    }
                }

                div_dropdown_areas.appendChild(div);
            } else {
                $('#' + id_div_dropdown_areas).addClass('hidden');
            }
            if(cant_areas <= 1){
                $('#' + id_div_dropdown_areas).addClass('hidden');
            }
/* 
                        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
            <span class="caret"></span></button>
            <ul class="dropdown-menu">
                <li><a href="#">HTML</a></li>
                <li><a href="#">CSS</a></li>
                <li><a href="#">JavaScript</a></li>
            </ul>
            </div>
 */
            // Revisar esto
            var usuarioNombre = document.getElementById('usuarioConectado');
            usuarioNombre.innerHTML = user_personal.nickname;



        });

        $('body').removeClass("hidden");

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
    alert("Inicia sesión para entrar a comunidad");
}));