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

var version = "test";

var rama_bd_personal = version + "/personal";
var rama_bd_obras = version + "/obras";
var rama_bd_clientes = version + "/clientes";
var rama_bd_pda = version + "/pda";
var rama_bd_datos_referencia = version + "/datos_referencia";
var rama_bd_mano_obra= version + "/rrhh/mano_obra"
var rama_bd_nomina = version + "/rrhh/nomina"
var rama_bd_info_web = "info_web";
var rama_bd_insumos = version + "/insumos";

var options_semanas = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric'};
var options_nomina = { weekday: 'short',day: 'numeric'};


var starting_year = 2018;
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

/* 
    firebase.database().ref("rrhh/trabajadores").once("value").then(function(snapshot){

        var datos = {
            "ACANTO": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "AVERANDA T-A": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "AVERANDA T-ByC": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "CENTRAL PARK BOSQUE REAL": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "COSMOCRAT INTERLOMAS": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "ENTTORNO T-F": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "EPIC COYOACAN": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "FANTASMA REFORMA 4107": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "FOR US": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "HAUS LEON": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "ICON": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "IQONO MEXICO": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "LA CITÉ TORRE D": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "LAS VENTANAS": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "MINAS 71": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "NEO": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "PROYECTO ZENTRAL ": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "SAN ANTONIO 88": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "SAN ANTONIO 95": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "UNICO": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "VIA515": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "WEST PARK T-C": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },
            "NA": {
                horas_extra: 0,
                total_horas_extra: 0,
                diversos: 0,
                total_asistencias: 0,
                total_pago: 0,
            },

        };
        var pago_ejemplo = 0;
        snapshot.forEach(function(subSnap){
            var semana = subSnap.child("nomina/2019/39").val();
            if(semana != null){
                if(semana.total){
                    pago_ejemplo += parseFloat(semana.total);
                };
            };
            if(semana){
                var proporcion = 0;
                if(semana.jueves != undefined){
                    if(semana.jueves.asistencia){
                        proporcion += 0.2;
                    };
                }
                if(semana.viernes != undefined){
                    if(semana.viernes.asistencia){
                        proporcion += 0.2;
                    };
                }

                if(semana.lunes != undefined){
                    if(semana.lunes.asistencia){
                        proporcion += 0.2;
                    };
                }
                if(semana.martes != undefined){
                    if(semana.martes.asistencia){
                        proporcion += 0.2;
                    };
                }
                if(semana.miercoles != undefined){
                    if(semana.miercoles.asistencia){
                        proporcion += 0.2;
                    };

                }
                var sueldo = parseFloat( parseFloat(semana.total_asistencia) / proporcion );

                // Asistencias y pagos totales;

                var aux = proporcion * 5;
                if(aux == 0 && semana.total != undefined){
                    console.log(semana);
                }
                aux = 1 / aux;
                //console.log(subSnap.key);
                if(semana.jueves != undefined){
                    if(semana.jueves.asistencia){
                        datos[semana.jueves.obra].total_asistencias += parseFloat(sueldo * 0.2);
                        datos[semana.jueves.obra].total_pago += parseFloat(semana.total * aux);
                    };
                }
                if(semana.viernes != undefined){
                    if(semana.viernes.asistencia){
                        datos[semana.viernes.obra].total_asistencias += parseFloat(sueldo * 0.2)
                        datos[semana.viernes.obra].total_pago += parseFloat(semana.total * aux);
                    };
                }
                if(semana.lunes != undefined){
                    if(semana.lunes.asistencia){
                        datos[semana.lunes.obra].total_asistencias += parseFloat(sueldo * 0.2)
                        datos[semana.lunes.obra].total_pago += parseFloat(semana.total * aux);
                    };
                }
                if(semana.martes != undefined){
                    if(semana.martes.asistencia){
                        datos[semana.martes.obra].total_asistencias += parseFloat(sueldo * 0.2)
                        datos[semana.martes.obra].total_pago += parseFloat(semana.total * aux);
                    };
                }
                if(semana.miercoles != undefined){
                    if(semana.miercoles.asistencia){
                        datos[semana.miercoles.obra].total_asistencias += parseFloat(sueldo * 0.2)
                        datos[semana.miercoles.obra].total_pago += parseFloat(semana.total * aux);
                    };
                }

                // horas extra
                if(semana.horas_extra != undefined){
                    for(key in semana.horas_extra){
                        datos[semana.horas_extra[key].obra].horas_extra += parseFloat(semana.horas_extra[key].horas);
                        datos[semana.horas_extra[key].obra].total_horas_extra += parseFloat(parseFloat(semana.horas_extra[key].horas) * (sueldo / 24 ).toFixed(2));
                    };
                };

                // Diversos
                //console.log(subSnap.key);
                if(semana.diversos != undefined){
                    for(key in semana.diversos){
                        datos[semana.diversos[key].obra].diversos += parseFloat(semana.diversos[key].cantidad);
                    };
                };
            };
        });

        var datos_tabla = [];

        for(key in datos){
            datos_tabla.push([
                key,
                datos[key].total_asistencias,
                0,
                datos[key].horas_extra,
                datos[key].total_horas_extra,
                0,
                datos[key].diversos,
                0,
                0,
                0,
                0,
                datos[key].total_pago
            ]);
        }

        tabla_reporte_global_nomina = $('#dataTableNomina').DataTable({
            destroy: true,
            data: datos_tabla,
            language: idioma_espanol,
            "autoWidth": false,
            dom: 'Bfrtip',
            "columnDefs": [
                {
                    targets: [-1],
                    className: 'bolded'
                },
                { targets: "_all", className: 'dt-body-center'},
            ],
            buttons: [
                {extend: 'excelHtml5',
                title: "Reporte_global_nomina",
                exportOptions: {
                    columns: [':visible']
                }},
            ],
        });
    }); */
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        $('body').removeClass("hidden");
        uid_usuario_global = user.uid;
        userUID = user.uid;
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
