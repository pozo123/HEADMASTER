// id's de los elementos HTML
var id_tab_colaborador = "tabColaboradorHEAD";
var id_form_colaborador = "formColaborador";
var id_dataTable_colaborador = "dataTableColaborador";

var id_email_colaborador = "emailColaborador";
var id_password_colaborador = "pwdColaborador";
var id_nickname_colaborador = "nicknameColaborador";
var id_nombre_colaborador = "nombreColaborador";
var id_paterno_colaborador = "paternoColaborador";
var id_materno_colaborador = "maternoColaborador";
var id_lider_checkbox_colaborador = "liderCheckboxColaborador";
var id_select_areas_colaborador = "colaboradorAreasList";
var id_group_checkbox_ie = "groupIEAdmin";
var id_group_checkbox_ihs = "groupIHSAdmin";
var id_ie_checkbox_colaborador = "colaboradorIE";
var id_ihs_checkbox_colaborador = "colaboradorIHS";


var id_reset_form_colaborador = "borrarButtonColaborador";
var id_agregar_colaborador = "agregarButtonColaborador";

// variables globales
var select;
var existe_colaborador = false;
var uid_existente = "";
var tabla_colaborador;


// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se inicializa el select con librería slim Select
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los colaboradores
$('#' + id_tab_colaborador).click(function() {
    select = new SlimSelect({
        select: '#' + id_select_areas_colaborador,
        placeholder: 'Elige las áreas correspondientes',
    });
    resetFormColaborador(true);  
    actualizarTablaCol();      
});

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_reset_form_colaborador).click(function(){
    resetFormColaborador(true);
});


// al cambiar el valor del campo email se revisan 2 casos
// 1.- si el colaborador ya existe en la base de datos, se ingresa a ella y se llenan los demás campos con los 
//     valores correspondientes y la variable global existe_colaborador toma el valor true
// 2.- si no existe se resetean los demás valores y la variable global existe_colaborador es false

$('#' + id_email_colaborador).change(function(){
    existe_colaborador = false;
    if(!validateEmail($('#' + id_email_colaborador).val())){
        alert("Escribe una dirección electrónica válida.")
        $('#' + id_email_colaborador).val("");
        $('#' + id_email_colaborador).focus();
        return;
    }
    firebase.database().ref(rama_bd_personal + "/colaboradores").once("value").then(function(snapshot){
        var areas;
        var nombre;
        var paterno;
        var materno;
        var nickname;
        var credenciales;
        var especialidad;

        snapshot.forEach(function(child_snap){
            var colaborador = child_snap.val();
            if(colaborador.email == $("#" + id_email_colaborador).val()){
                existe_colaborador = true;
                uid_existente = child_snap.key;
                areas = child_snap.child("areas").val();
                credenciales = colaborador.credenciales;
                nombre = colaborador.nombre;
                paterno = colaborador.a_paterno;
                materno = colaborador.a_materno;
                nickname = colaborador.nickname;
                if(areas.proyectos){
                    especialidad = child_snap.child("especialidad").val();
                }
            }
        });

        if(existe_colaborador){
            highLightAllColaborador();
            $('#' + id_nombre_colaborador).val(nombre);
            $('#' + id_paterno_colaborador).val(paterno);
            $('#' + id_materno_colaborador).val(materno);
            $('#' + id_nickname_colaborador).val(nickname);

            document.getElementById(id_password_colaborador).disabled = true;

            if(credenciales == 2){
                document.getElementById(id_lider_checkbox_colaborador).checked = true;
                document.getElementById(id_lider_checkbox_colaborador).disabled = false;
            } else if(credenciales == 3){
                document.getElementById(id_lider_checkbox_colaborador).checked = false;
                document.getElementById(id_lider_checkbox_colaborador).disabled = false;
            } else {
                document.getElementById(id_lider_checkbox_colaborador).checked = false;
                document.getElementById(id_lider_checkbox_colaborador).disabled = true;
            }

            var areas_array = [];
            for(key in areas){
                areas_array.push(key);
            }
            select.set(areas_array);

            if(areas.proyectos){
                if(especialidad.ie){
                    document.getElementById(id_ie_checkbox_colaborador).checked = true;
                }
                else if(especialidad.ihs) {
                    document.getElementById(id_ihs_checkbox_colaborador).checked = true;
                }
            }
        } else {
            resetFormColaborador(false);
        }
    });
});

// funcion para agregar el colaborador a la base de datos
// si el colaborador ya existe, solo se actualizan los datos en la real time database
// si no existe, además de lo anterior. Se crea su usuario y contraseña para ingresar en el sistema.
// Se utiliza la funcion agregar_colaborador() para obtener los datos a ingresar al database.

$('#' + id_agregar_colaborador).click(function(){
    if(!validateFormCol()){
        return;
    } 
    if (existe_colaborador){
        // actualizar colaborador en db
        firebase.database().ref(rama_bd_personal + "/colaboradores/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            var colaborador = agregar_colaborador(registro_antiguo.habilitado);
            // actualizar registro
            firebase.database().ref(rama_bd_personal + "/colaboradores/" + uid_existente).update(colaborador);

            // eliminar registro antiguo de listas
            var listas_antiguo_path = {}
            listas_antiguo_path["listas/credenciales/" + registro_antiguo.credenciales + "/" + uid_existente] = null;
            for(key in registro_antiguo.areas){
                listas_antiguo_path["listas/areas/" + key + "/" + uid_existente] = null;
            }
            firebase.database().ref(rama_bd_personal).update(listas_antiguo_path);
            

            // actualizar listas
            var listas_path = {}
            listas_path["listas/credenciales/" + colaborador.credenciales + "/" + uid_existente] = true;
            for(key in colaborador.areas){
                listas_path["listas/areas/" + key + "/" + uid_existente] = true;
            }
            firebase.database().ref(rama_bd_personal).update(listas_path);

            // pista de auditoria
            pda("modificacion", rama_bd_personal + "/colaboradores/" + uid_existente, registro_antiguo);

            alert("¡Edición exitosa!");
            resetFormColaborador(true);
        });
    } else {
        secondaryApp.auth().createUserWithEmailAndPassword($('#' + id_email_colaborador).val(), $('#' + id_password_colaborador).val())
        .then(function (result) {
            
            // ----- SUBIR COLABORADOR A REALTIME DATABASE -----------------------------------------
            var user = result.user;
            var colaborador = agregar_colaborador(true);
            firebase.database().ref(rama_bd_personal + "/colaboradores/" + user.uid).set(colaborador);
            
            // actualizar listas
            var listas_path = {}
            listas_path["listas/habilitado/" + user.uid] = true;
            listas_path["listas/credenciales/" + colaborador.credenciales + "/" + user.uid] = true;
            for(key in colaborador.areas){
                listas_path["listas/areas/" + key + "/" + user.uid] = true;
            }
            firebase.database().ref(rama_bd_personal).update(listas_path);

            // pista de auditoría
            pda("alta", rama_bd_personal + "/" + user.uid, "");

            alert("¡Alta exitosa!")
            resetFormColaborador(true);
            // -------------------------------------------------------------------------------------
            secondaryApp.auth().signOut();
        }
    );
    }
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_email_colaborador).change(function(){
    $('#' + id_email_colaborador).val($('#' + id_email_colaborador).val().toLowerCase());
});

$('#' + id_email_colaborador).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_.@0123456789",e)
});

$('#' + id_nickname_colaborador).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});
$('#' + id_nickname_colaborador).change(function(){
    $('#' + id_nickname_colaborador).val($('#' + id_nickname_colaborador).val().toUpperCase());
});

$('#' + id_nombre_colaborador).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});

$('#' + id_nombre_colaborador).change(function(){
    var nombre_array = deleteBlankSpaces(id_nombre_colaborador).split(" ");
    var nombre = "";
    for(var i=0; i<nombre_array.length; i++){
        if(i>0){
            nombre += " ";
        }
        nombre += nombre_array[i].charAt(0).toUpperCase() + nombre_array[i].slice(1).toLowerCase();
    }
    $('#' + id_nombre_colaborador).val(nombre);
});

$('#' + id_paterno_colaborador).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});
$('#' + id_paterno_colaborador).change(function(){
    var paterno_array = deleteBlankSpaces(id_paterno_colaborador).split(" ");
    var paterno = "";
    for(var i=0; i<paterno_array.length; i++){
        if(i>0){
            paterno += " ";
        }
        if(isPrepOrArt(paterno_array[i].toLowerCase())){
            paterno += paterno_array[i].toLowerCase();
        } else {
            paterno += paterno_array[i].charAt(0).toUpperCase() + paterno_array[i].slice(1).toLowerCase();
        }
    }
    $('#' + id_paterno_colaborador).val(paterno);
});

$('#' + id_materno_colaborador).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóú",e);
});
$('#' + id_materno_colaborador).change(function(){
    var materno_array = deleteBlankSpaces(id_materno_colaborador).split(" ");
    var materno = "";
    for(var i=0; i<materno_array.length; i++){
        if(i>0){
            materno += " ";
        }
        if(isPrepOrArt(materno_array[i].toLowerCase())){
            materno += materno_array[i].toLowerCase();
        } else {
            materno += materno_array[i].charAt(0).toUpperCase() + materno_array[i].slice(1).toLowerCase();
        }
    }
    $('#' + id_materno_colaborador).val(materno);
});

$('#' + id_select_areas_colaborador).change(function(){
    if(select.selected().includes("proyectos")){
        $('#' + id_group_checkbox_ie).removeClass("hidden");
        $('#' + id_group_checkbox_ihs).removeClass("hidden");
    } else {
        $('#' + id_group_checkbox_ie).addClass("hidden");
        $('#' + id_group_checkbox_ihs).addClass("hidden");
    }
});

$('#' + id_email_colaborador).on("cut copy paste",function(e) {
    e.preventDefault();
 });
 $('#' + id_password_colaborador).on("cut copy paste",function(e) {
     e.preventDefault();
  });
  $('#' + id_nickname_colaborador).on("cut copy paste",function(e) {
     e.preventDefault();
  });
  $('#' + id_nombre_colaborador).on("cut copy paste",function(e) {
     e.preventDefault();
  });
  $('#' + id_paterno_colaborador).on("cut copy paste",function(e) {
     e.preventDefault();
  });
  $('#' + id_materno_colaborador).on("cut copy paste",function(e) {
     e.preventDefault();
  });

// ----------------------- FUNCIONES NECESARIAS ----------------------------

// función para resetear el formulario
// el parametro es boolean, true si quieres resetear el campo de correo. Esto es ya que cada vez que cambie el 
// valor del campo del correo, el formulario se tiene que resetear.

function resetFormColaborador(emailReset){
    if(emailReset){
        $('#' + id_email_colaborador).val("");
    }
    $('#' + id_password_colaborador).val("");
    $('#' + id_nickname_colaborador).val("");
    $('#' + id_nombre_colaborador).val("");
    $('#' + id_paterno_colaborador).val("");
    $('#' + id_materno_colaborador).val("");

    select.set([]);
    document.getElementById(id_lider_checkbox_colaborador).checked = false;
    document.getElementById(id_password_colaborador).disabled = false;
    document.getElementById(id_ie_checkbox_colaborador).checked = false;
    document.getElementById(id_ihs_checkbox_colaborador).checked = false;

    existe_colaborador = false;
    uid_existente = "";
}


// función para validar el formulario. Si al apretar el botón de agregar hay algún campo obligatorio vacío, esta función
// detecta el error y avisa al usuario la corrección necesaria.

function validateFormCol(){
    if ($('#' + id_email_colaborador).val() == ""){
        alert("Escribe el correo electrónico del colaborador que será dado de alta o será modificado.");
        return false;
    } else if($('#' + id_password_colaborador).val() == "" && !existe_colaborador){
        alert("Escribe una contraseña sencilla para el colaborador que estás por dar de alta. Sólamente él podrá editar dicha contraseña.");
        return false;
    } else if($('#' + id_nickname_colaborador).val() == ""){
        alert("Escribe el nickname (nombre corto) del colaborador.");
        return false;
    } else if($('#' + id_nombre_colaborador).val() == ""){
        alert("Escribe el nombre de pila del colaborador.");
        return false;
    } else if($('#' + id_paterno_colaborador).val() == ""){
        alert("Escribe el apellido paterno del colaborador.");
        return false;
    }  else if(select.selected().length == 0){
        alert("Ningún área fue seleccionada");
        return false;
    } else if (select.selected().includes("proyectos") && !document.getElementById(id_ie_checkbox_colaborador).checked && !document.getElementById(id_ihs_checkbox_colaborador).checked){
        alert("Si el usuario tiene el área proyectos, se debe indicar su especialidad");
        return false;
    } else {
        return true;
    }
}

// función para obtener datos a ingresar del usuario
// el objeto JSON "persona" es el objeto que se ingresa al database (revisar UML_v2 para ver estructura)
function agregar_colaborador(habilitado){
    var areas = {};
    var especialidad = {};
    
    for(var i=0; i<select.selected().length; i++){
        areas[select.selected()[i]] = true;
    }
    

    if(select.selected().includes("proyectos")){
        if(document.getElementById(id_ie_checkbox_colaborador).checked) {
            especialidad["ie"] = true;
        }
        if (document.getElementById(id_ihs_checkbox_colaborador).checked) {
            especialidad ["ihs"] = true;
        }
    } 

    var persona = {
        email: $('#' + id_email_colaborador).val(),
        nombre: $('#' + id_nombre_colaborador).val(),
        a_paterno: $('#' + id_paterno_colaborador).val(),
        a_materno: $('#' + id_materno_colaborador).val(),
        nickname: $('#' + id_nickname_colaborador).val(),
        areas: areas,
        especialidad: especialidad,
        credenciales: $('#' + id_lider_checkbox_colaborador).prop('checked') ? 2:3,
        habilitado: habilitado,
    }
    return persona;
};


// función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
// se utiliza on "value" para que en cada movimiento en la base de datos "colaboradores", la tabla se actualize
// automáticamente.
function actualizarTablaCol(){
    firebase.database().ref(rama_bd_personal + "/colaboradores").on("value",function(snapshot){
        var datos_colaborador = [];
        snapshot.forEach(function(colSnap){
            var colaborador = colSnap.val();
            var nickname = colaborador.nickname;
            var nombre = colaborador.nombre + " " + colaborador.a_paterno + " " + colaborador.a_materno;
            var nombre_text = colaborador.nombre + "_" + colaborador.a_paterno + "_" + colaborador.a_materno;
            var email = colaborador.email;
            var areas = colSnap.child("areas").val();
            var credenciales = colaborador.credenciales;
            var especialidad = colSnap.child("especialidad").val();
            var habilitado = colaborador.habilitado;
            var uid = colSnap.key;

            var areas_text = "";
            for (key in areas){
                areas_text += key + "\n";
            }
            var especialidad_text = "";
            for(key in especialidad){
                especialidad_text += key + "\n";
            }
            areas_text = areas_text.substring(0, areas_text.length - 1);
            especialidad_text = especialidad_text.substring(0, especialidad_text.length - 1)

            credenciales_text = "";
            if(credenciales == 0){
                credenciales_text = "Administrador del sistema";
            } else if (credenciales == 1){
                credenciales_text = "Director General";
            } else if (credenciales == 2){
                credenciales_text = "Líder de área";
            } else if (credenciales == 3){
                credenciales_text = "Colaborador HEAD";
            };

            var icon_class = "";
            if(habilitado) {
                icon_class = "'icono_verde fas fa-check-circle'";
            } else {
                icon_class = "'icono_rojo fas fa-times-circle'"
            }

            datos_colaborador.push([
                nombre,
                nombre_text,
                uid,
                nickname,
                email,
                areas_text,
                especialidad_text.toUpperCase(),
                credenciales_text,
                credenciales,
                "<button type='button' class='btn btn-transparente' onclick='habilitarColaborador(" + habilitado + "," + "\`"  + uid  + "\`" + ")'><i class=" + icon_class + "></i></button>",
            ]);
        });
        
        tabla_colaborador = $('#'+ id_dataTable_colaborador).DataTable({
            destroy: true,
            data: datos_colaborador,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "150px", "targets": 0 },
                { "width": "100px", "targets": 5 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 1 },
                { "visible": false, "targets": 2 },
                { "visible": false, "targets": -3 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                }
              ]
        });

        $('#' + id_dataTable_colaborador + ' tbody').on( 'click', '.editar', function () {
            highLightAllColaborador();
            var data = tabla_colaborador.row( $(this).parents('tr') ).data();
            resetFormColaborador(true);
            existe_colaborador = true;
            var nombre = data[1].split("_");
            uid_existente = data[2];
                 
            $('#' + id_nombre_colaborador).val(nombre[0]);
            $('#' + id_paterno_colaborador).val(nombre[1]);
            $('#' + id_materno_colaborador).val(nombre[2]);
            $('#' + id_nickname_colaborador).val(data[3]);
            $('#' + id_email_colaborador).val(data[4]);
        
            document.getElementById(id_password_colaborador).disabled = true;
            
            if(data[8] == 2){
                document.getElementById(id_lider_checkbox_colaborador).checked = true;
                document.getElementById(id_lider_checkbox_colaborador).disabled = false;
            } else if(data[8]  == 3){
                document.getElementById(id_lider_checkbox_colaborador).checked = false;
                document.getElementById(id_lider_checkbox_colaborador).disabled = false;
            } else {
                document.getElementById(id_lider_checkbox_colaborador).checked = false;
                document.getElementById(id_lider_checkbox_colaborador).disabled = true;
            }
        
            var areas_array = data[5].split("\n");
            select.set(areas_array);
            
            var especialidad_array = data[6].toLowerCase().split("\n");
            for(i=0;i<areas_array.length;i++){
                if(especialidad_array[i] == "ie"){
                    document.getElementById(id_ie_checkbox_colaborador).checked = true;
                }
                else if(especialidad_array[i] == "ihs"){
                    document.getElementById(id_ihs_checkbox_colaborador).checked = true;
                }
            }
        } );
    });
}

// función para actualizar el valor "habilitado:boolean" en la database. 
function  habilitarColaborador(habilitado, uid){
    var aux = {"habilitado": !habilitado};

    firebase.database().ref(rama_bd_personal + "/colaboradores/" + uid).once("value").then(function(snapshot){
        var registro_antiguo = snapshot.val();

        // actualizar registro
        firebase.database().ref(rama_bd_personal + "/colaboradores/" + uid).update(aux);

        // actualizar listas
        if(habilitado){
            firebase.database().ref(rama_bd_personal + "/listas/habilitado/" + uid).remove();
            firebase.database().ref(rama_bd_personal + "/listas/deshabilitado/" + uid).set(true);
        } else {
            firebase.database().ref(rama_bd_personal + "/listas/habilitado/" + uid).set(true)
            firebase.database().ref(rama_bd_personal + "/listas/deshabilitado/" + uid).remove();
        }
        // pda
        pda("modificacion", rama_bd_personal + "/colaboradores/" + uid, registro_antiguo)
    });
}

//función estética que hace uso de la función highLight
function highLightAllColaborador(){
    highLight(id_email_colaborador);
    highLight(id_nickname_colaborador);
    highLight(id_nombre_colaborador);
    highLight(id_paterno_colaborador);
    highLight(id_materno_colaborador);
};