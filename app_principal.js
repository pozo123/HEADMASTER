var version;
// Necesitamos cambiar a rama personal
var rama_bd_personal = "personal";
var rama_bd_obras = "obras";
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
    /*firebase.database().ref("obras").once('value').then(function(snapshot){
        var obras_json = snapshot.val();
        snapshot.forEach(function(obraSnap){
            obraSnap.child("procesos").forEach(function(procSnap){
                if(procSnap.child("num_subprocesos").val() == 0){
                    //es hoja
                    var preco = parseFloat(procSnap.child("kaizen/PRODUCCION/COPEO/PREC").val());
                    var copeo = parseFloat(procSnap.child("kaizen/PRODUCCION/COPEO/COPEO").val());
                    var copeo_rama = {
                        total: copeo == 0 ? preco : copeo,
                        subtotal: copeo == 0 ? preco / 1.34 : copeo / 1.34,
                        impuestos: 34,
                        num_entradas: 1,
                        entradas: {
                            1: {
                                nombre: "Previo",
                                alcance: "Datos previos a la calculadora",
                                pad: pistaDeAuditoria(),
                                total: copeo == 0 ? preco / 1.34 : copeo / 1.34,
                                cuadrilla: {
                                    ofi: 0,
                                    mof: 0,
                                    ayu: 0,
                                    enc: 0,
                                    sup: 0,
                                },
                                multiplicadores: {
                                    dias: 0,
                                    unidades: 0,
                                }
                            }
                        }
                    };
                    obras_json[obraSnap.key]["procesos"][procSnap.key]["copeo"] = copeo_rama;
                    if(copeo == 0){
                        obras_json[obraSnap.key]["procesos"][procSnap.key]["kaizen"]["PRODUCCION"]["COPEO"]["COPEO"] = preco;
                    }
                } else {
                    procSnap.child("subprocesos").forEach(function(subpSnap){
                        //es hoja
                        var preco = parseFloat(subpSnap.child("kaizen/PRODUCCION/COPEO/PREC").val());
                        var copeo = parseFloat(subpSnap.child("kaizen/PRODUCCION/COPEO/COPEO").val());
                        var copeo_rama = {
                            total: copeo == 0 ? preco : copeo,
                            subtotal: copeo == 0 ? preco / 1.34 : copeo / 1.34,
                            impuestos: 34,
                            num_entradas: 1,
                            entradas: {
                                1: {
                                    nombre: "Previo",
                                    alcance: "Datos previos a la calculadora",
                                    pad: pistaDeAuditoria(),
                                    total: copeo == 0 ? preco / 1.34 : copeo / 1.34,
                                    cuadrilla: {
                                        ofi: 0,
                                        mof: 0,
                                        ayu: 0,
                                        enc: 0,
                                        sup: 0,
                                    },
                                    multiplicadores: {
                                        dias: 0,
                                        unidades: 0,
                                    }
                                }
                            }
                        };
                        obras_json[obraSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["copeo"] = copeo_rama;
                        if(copeo == 0){
                            obras_json[obraSnap.key]["procesos"][procSnap.key]["subprocesos"][subpSnap.key]["kaizen"]["PRODUCCION"]["COPEO"]["COPEO"] = preco;
                        }
                    });
                }
            });
        });
        console.log(obras_json);
        firebase.database().ref("obras").update(obras_json);
    });*/
});

firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if(user) {
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
        firebase.database().ref(rama_bd_personal).once('value').then(function (snapshot) {
            snapshot.forEach(function(persSnap){
                var pers = persSnap.val();
                json_personal[persSnap.key] = {nombre: pers.nombre, nickname: pers.nickname, areas: pers.areas, activo: pers.activo};
            });
            var user_personal = snapshot.child(user.uid).val();
            console.log(user_personal);
            areas_usuario_global = user_personal.areas;
            console.log(areas_usuario_global);
            creden_usuario_global = user_personal.credenciales;
            if(user.uid == "sD2NRaTu4Ug4e0gqluYaHpxNZbP2" || user.uid == "w5LvF3uFl5g0qEAKvmKCQferLQJ3"){
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

            $('#loader').addClass("hidden");
            $('.loader').removeClass("hidden");
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