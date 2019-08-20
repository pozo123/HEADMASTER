// id's de los elementos HTML
var id_tab_trabajador = "tabTrabajadores";
var id_form_importar_trabajador = "formImportarTrabajadores";
var id_form__alta_trabajador = "formAltaTrabajadores";
var id_dataTable_trabajador = "dataTableCliente";

// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los clientes

var id_file_label_formato_excel_trabajador = "fileLabelImportarTrabajador";
var id_file_input_formato_excel_trabajador = "fileInputImportarTrabajador";
var id_span_correctos_trabajador = "spanCorrectosTrabajador";
var id_span_incorrectos_trabajador = "spanIncorrectosTrabajador";
var id_class_correctos_trabajador = "classCorrectosTrabajador";
var id_class_incorrectos_trabajador = "classIncorrectosTrabajador";
var id_body_modal_correctos_trabajador = "bodyModalCorrectos";
var id_body_modal_incorrectos_trabajador = "bodyModalIncorrectos"

var id_descargar_formato_button_trabajador = "descargarFormatoButtonTrabajador";

var id_hide_opcionales_button_trabajador = "hideOpcionalesButtonTrabajador";
var id_hide_opcionales_icon_trabajador = "hideOpcionalesIconTrabajador";
var id_container_opcionales_trabajador = "opcionalesContainer";

var id_button_reset_file_trabajador = "resetFileButtonTrabajador";
var id_button_desargar_file_trabajador = "descargarFormatoButtonTrabajador";
var id_button_importar_file_trabajador = "importarButtonTrabajador";

var id_nombre_trabajador = "nombreTrabajador";
var id_apellido_paterno = "paternoTrabajador";
var id_apellido_materno = "maternoTrabajador";

var id_ddl_especialidad_trabajador = "especialidadDdlrabajador";
var id_ddl_puesto_trabajador = "puestoDdlrabajador";
// variables globales

var formato_importar_fileSelected = "";
var array_destajistas = [];
var array_no_destajistas = [];
var corrupted_rows = 0;

$('#' + id_tab_trabajador).click(function() {
    resetFormImportar()
    resetFormTrabajador();
   // actualizarTrabajador();   

   // load data firebase
   // --- ESPECIALIDAD -----
   var select_esp = document.getElementById(id_ddl_especialidad_trabajador);
   var option_esp = document.createElement('option');
   option_esp.style = "display:none";
   option_esp.text = option_esp.value = "";
   select_esp.appendChild(option_esp);
   firebase.database().ref(rama_bd_datos_referencia + "/especialidades").orderByChild('clave').on('child_added',function(snapshot){
       var especialidad = snapshot.val();
       option_esp = document.createElement('option');
       option_esp.value = snapshot.key;
       option_esp.text = especialidad.clave;
       select_esp.appendChild(option_esp);
   });

      // --- PUESTO -----
    var select_puesto = document.getElementById(id_ddl_puesto_trabajador);
    var option_puesto = document.createElement('option');
    option_puesto.style = "display:none";
    option_puesto.text = option_puesto.value = "";
    select_puesto.appendChild(option_puesto);
    firebase.database().ref(rama_bd_datos_referencia + "/puestos").orderByChild('clave').on('child_added',function(snapshot){
        var puesto = snapshot.val();
        option_puesto = document.createElement('option');
        option_puesto.value = snapshot.key;
        option_puesto.text = puesto.puesto;
        select_puesto.appendChild(option_puesto);
    });
});

// ---------------------------  IMPORTAR TRABAJADORES ----------------------------------------------

$('#' + id_file_input_formato_excel_trabajador).on("change", function(event){
    formato_importar_fileSelected = event.target.files[0];
    $('#' + id_file_label_formato_excel_trabajador).text(formato_importar_fileSelected.name);
    $('#' + id_file_label_formato_excel_trabajador).attr("style", "color: #A7C5A1");
    array_destajistas = [];
    array_no_destajistas = [];

    var reader = new FileReader();
    reader.onload = function (e) {
        var array_datos_xlsx = [];
        corrupted_rows = 0;

        var data = e.target.result;
        data = new Uint8Array(data);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");

        /* Call XLSX */
        var workbook = XLSX.read(bstr, {
            type: "binary",
            cellDates: true,
            cellNF: false,
            cellText:false,
        });

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        array_datos_xlsx = XLSX.utils.sheet_to_json(worksheet, {
            dateNF: "YYYY-MM-DD"
        });

        if(array_datos_xlsx.length == 0){
            alert("No se importaron datos")
            resetFormImportar();
            return;
        }
        var validated_data = validateExcelRow(array_datos_xlsx);
        firebase.database().ref(rama_bd_mano_obra + "/trabajadores").once("value").then(function(snapshot){

            for(i=0;i<validated_data.length;i++){
                if(validated_data[i][0] == ""){
                    snapshot.forEach(function(trabSnap){
                        var trabajador = trabSnap.val();
                        if(trabajador["id_head"] == validated_data[i][1]["id_head"]){
                            validated_data[i][2] = true;
                            validated_data[i][3] = "El ID HEAD ya existe en el sistema/" + validated_data[i][3];
                        };
                    });

                    for(j=0;j<validated_data.length;j++){
                        if(validated_data[i][1]["id_head"] == validated_data[j][1]["id_head"] && i != j){
                            validated_data[i][2] = true;
                            validated_data[i][3] = "Existen dos registros con el mismo ID HEAD/" + validated_data[i][3];
                        };
                    };
                }
            }

            for(i=0;i<validated_data.length;i++){
                if(validated_data[i][0] != ""){
                    if(!snapshot.child(validated_data[i][0]).exists()){
                        validated_data[i][2] = true;
                        validated_data[i][3] = "El ID Firebase ingresado no se encuentra en la base de datos/" + validated_data[i][3];
                    }
                } else {
                    validated_data[i][0] = firebase.database().ref(rama_bd_mano_obra + "/trabajadores").push().key;
                }
            };

            // actualizar id_jefe con su firebase_id;
            for(i=0;i<validated_data.length;i++){
                if(validated_data[i][1]["id_jefe"] != ""){
                    var id_jefe_correcto = true;
                    // Reviso en el snapshot de la db
                    snapshot.forEach(function(trabSnap){
                        var trabajador = trabSnap.val();
                        if(trabajador["id_head"] == validated_data[i][1]["id_jefe"]){
                            validated_data[i][1]["id_jefe"] = trabSnap.key;
                            id_jefe_correcto = true;
                        };
                    });
                    // Reviso en los datos que vienen del excel ya que tengo el key con el que voy a pushearlos;
                    for(j=0;j<validated_data.length;j++){
                        if(validated_data[i][1]["id_jefe"] == validated_data[j][1]["id_head"]){
                            validated_data[i][1]["id_jefe"] = validated_data[j][0];
                            id_jefe_correcto = true;
                        };
                    };
                    if(!id_jefe_correcto){
                        validated_data[i][2] = true;
                        validated_data[i][3] = "El Id del destajista no es correcto/" + validated_data[i][3];
                    }
                };
            };
            // Método para llenar las tablas con info de usuarios correctos e incorrectos
            var corrupted_data = [];
            var ok_data = [];

            for(i=0;i <validated_data.length;i++){
                if(validated_data[i][2]){
                    corrupted_rows += 1;
                    corrupted_data.push(validated_data[i]);                
                } else {
                    ok_data.push(validated_data[i])
                }

                if(validated_data[i][1]["destajista"]){
                    array_destajistas.push(validated_data[i]);
                } else {
                    array_no_destajistas.push(validated_data[i]);
                };
            }
            
            if(corrupted_rows > 0){
                $('#' + id_span_incorrectos_trabajador).text(corrupted_rows)
                $('#' + id_class_incorrectos_trabajador).removeClass("hidden");
                modalIncorrectos(corrupted_data);
            } else {
                alert("¡Todos los datos son correctos!")
                $('#' + id_button_importar_file_trabajador).attr("disabled", false);
            }

            $('#' + id_span_correctos_trabajador).text(validated_data.length - corrupted_rows);
            $('#' + id_class_correctos_trabajador).removeClass("hidden");

            modalCorrectos(ok_data)
            // --------------------------------------------------------------------------- 
        });
    };
    reader.readAsArrayBuffer(formato_importar_fileSelected);
});

$('#' + id_descargar_formato_button_trabajador).click(function(){
    firebase.database().ref(rama_bd_info_web + "/formatos/importar_trabajadores/url").once("value", function(snapshot){
        var url = snapshot.val();
        window.open(url, '_blank');
    });
});

$('#' + id_button_reset_file_trabajador).click(function(){
    resetFormImportar();
});

$('#' + id_button_importar_file_trabajador).click(function(){

    if(corrupted_rows > 0){
        alert("¡Existen renglones con información incorrecta!")
        return;
    }
    
    var destajistas_path = {};
    var no_destajistas_path = {};
    
    // generar rutas donde se actualiza datos, listas y pista de auditoria
    
    
    firebase.database().ref(rama_bd_mano_obra + "/listas/").once("value").then(function(snapshot){
        for(var i=0;i<array_destajistas.length;i++){       
            destajistas_path[rama_bd_mano_obra + "/trabajadores/" + array_destajistas[i][0]] = array_destajistas[i][1];

            snapshot.child("destajistas").forEach(function(destSnap){
                destajistas_path[rama_bd_mano_obra + "/listas/destajistas/" + destSnap.key + "/" + array_destajistas[i][0]] = null;
            });
            snapshot.child("puesto").forEach(function(puestoSnap){
                destajistas_path[rama_bd_mano_obra + "/listas/puesto/" + puestoSnap.key + "/" + array_destajistas[i][0]] = null;
            });
            snapshot.child("especialidad").forEach(function(espSnap){
                destajistas_path[rama_bd_mano_obra + "/listas/especialidad/" + espSnap.key + "/" + array_destajistas[i][0]] = null;
            });

            destajistas_path[rama_bd_mano_obra + "/listas/no_activos/" + array_destajistas[i][0]] = null;
            destajistas_path[rama_bd_mano_obra + "/listas/activos/" + array_destajistas[i][0]] = true;
            destajistas_path[rama_bd_mano_obra + "/listas/destajistas/" + array_destajistas[i][0] + "/" + array_destajistas[i][0]] = true;
            destajistas_path[rama_bd_mano_obra + "/listas/puesto/" + array_destajistas[i][1]["id_puesto"] + "/" + array_destajistas[i][0]] = true;
            destajistas_path[rama_bd_mano_obra + "/listas/especialidad/" + array_destajistas[i][1]["id_especialidad"] + "/" + array_destajistas[i][0]] = true;
        };

        firebase.database().ref().update(destajistas_path).then(function(){
            firebase.database().ref(rama_bd_mano_obra + "/listas/").once("value").then(function(otroSnap){
                for(var k=0;k<array_no_destajistas.length;k++){
                    no_destajistas_path[rama_bd_mano_obra + "/trabajadores/" + array_no_destajistas[k][0]] = array_no_destajistas[k][1];
                    // necesito checar si el trabajador era destajista, si sí para a sus trabajadores actualizarlos en HEAD;
                    otroSnap.child("destajistas").forEach(function(destSnap){
                        no_destajistas_path[rama_bd_mano_obra + "/listas/destajistas/" + destSnap.key + "/" + array_no_destajistas[k][0]] = null;
                        if(array_no_destajistas[k][0] == destSnap.key){
                            destSnap.forEach(function(subDestSnap){
                                no_destajistas_path[rama_bd_mano_obra + "/listas/destajistas/HEAD/" + subDestSnap.key] = true;
                            });
                        }
                    });

                    otroSnap.child("puesto").forEach(function(puestoSnap){
                        no_destajistas_path[rama_bd_mano_obra + "/listas/puesto/" + puestoSnap.key + "/" + array_no_destajistas[k][0]] = null;
                    });
                    otroSnap.child("especialidad").forEach(function(espSnap){
                        no_destajistas_path[rama_bd_mano_obra + "/listas/especialidad/" + espSnap.key + "/" + array_no_destajistas[k][0]] = null;
                    });

                    no_destajistas_path[rama_bd_mano_obra + "/listas/no_activos/" + array_no_destajistas[k][0]] = null;
                    no_destajistas_path[rama_bd_mano_obra + "/listas/activos/" + array_no_destajistas[k][0]] = true;
                    no_destajistas_path[rama_bd_mano_obra + "/listas/puesto/" + array_no_destajistas[k][1]["id_puesto"] + "/" + array_no_destajistas[k][0]] = true;
                    no_destajistas_path[rama_bd_mano_obra + "/listas/especialidad/" + array_no_destajistas[k][1]["id_especialidad"] + "/" + array_no_destajistas[k][0]] = true;

                    if(array_no_destajistas[k][1]["id_jefe"] == ""){
                        no_destajistas_path[rama_bd_mano_obra + "/listas/destajistas/HEAD/" + array_no_destajistas[k][0]] = true;
                        no_destajistas_path[rama_bd_mano_obra + "/listas/destajistas/" + array_no_destajistas[k][1]["id_jefe"] + "/" + array_no_destajistas[k][0]] = null;
                    } else {
                        no_destajistas_path[rama_bd_mano_obra + "/listas/destajistas/HEAD/" + array_no_destajistas[k][0]] = null;
                        no_destajistas_path[rama_bd_mano_obra + "/listas/destajistas/" + array_no_destajistas[k][1]["id_jefe"] + "/" + array_no_destajistas[k][0]] = true;
                    }

                }

                firebase.database().ref().update(no_destajistas_path).then(function(){
                    alert("¡Importación Exitosa!");
                    var registro = {};

                    for(var i=0;i<array_destajistas.length;i++){
                        registro[array_destajistas[i][0]] = array_destajistas[i][1];
                    }

                    for(var i=0;i<array_no_destajistas.length;i++){
                        registro[array_no_destajistas[i][0]] = array_no_destajistas[i][1];
                    }

                    pda("modificacion", rama_bd_mano_obra, "no aplica ya que fue importación de trabajadores.");
                    resetFormImportar();
                }).catch(function(er){
                    alert("Error: " + er + " . Contacta al administrador del sistema");
                    resetFormImportar();
                });
            });
        }).catch(function(error){
            alert("Error: " + error + " . Contacta al administrador del sistema");
            resetFormImportar();
        });


    });
});
// ----------------------- FUNCIONES NECESARIAS ----------------------------

function resetFormImportar(){
    formato_importar_fileSelected = "";
    array_destajistas = [];
    array_no_destajistas = [];
    corrupted_rows = 0;
    $('#' + id_file_label_formato_excel_trabajador).text("Archivo no seleccionado");
    $('#' + id_file_input_formato_excel_trabajador).val("");
    $('#' + id_file_label_formato_excel_trabajador).attr("style", "color: black");
    $('#' + id_class_correctos_trabajador).addClass("hidden");
    $('#' + id_class_incorrectos_trabajador).addClass("hidden");
    $('#' + id_button_importar_file_trabajador).attr("disabled", true);

}

function deleteBlankSpacesString(string){
    while(string.charAt(0) == " "){
        string = string.slice(1);
    }
    while(string.charAt(string.length-1) == " "){
        string = string.slice(0,-1);
    }
    for(var i=0; i<string.length;i++){
        if(string.charAt(i) == " " && string.charAt(i+1) == " "){
            string = string.slice(0,i) + string.slice(i+1);
            i = i-1;
        }
    }
    return string;
}

function validateExcelRow(array){
    var new_array = [];
    for(i=0;i<array.length;i++){
        var json_trabajador = {};
        var is_corrupted = false;
        var razon = "";

        var id_firebase = array[i]["ID FIREBASE (Necesario si deseas editar)"];
        id_firebase = id_firebase == undefined ? "" : deleteBlankSpacesString(id_firebase);
        
        // Validación ID_head
        var id_head = array[i]["ID HEAD"];
        id_head = id_head == undefined ? "" : deleteBlankSpacesString(id_head);

        if(id_head != ""){
            id_head = deleteBlankSpacesString(id_head);
            if(isNaN(id_head)){
                razon += "El ID HEAD debe ser un número sin decimales"
                is_corrupted = true;
            }
        } else {
            razon += "Hace falta el ID HEAD del trabajador ingresado".
            is_corrupted = true;
        }
         // Formato ID Pagadora
        var id_pagadora = array[i]["ID Pagadora"];
        id_pagadora = id_pagadora == undefined ? "" : deleteBlankSpacesString(id_pagadora).toUpperCase()
        if(id_pagadora == ""){
            razon += "/Hace falta el ID de la pagadora del trabajador ingresado";
            is_corrupted = true;
        } 
        // Formato nombre
        var nombre = array[i]["Nombre(s)"];
        nombre = nombre == undefined ? "" : deleteBlankSpacesString(nombre);
        if(nombre == ""){
            razon += "/Hace falta el nombre del trabajador ingresado";
            is_corrupted = true;
        } else {
            var nombre_array = nombre.split(" ");
            var nombre = "";
            for(var j=0; j<nombre_array.length; j++){
                if(j>0){
                    nombre += " ";
                }
                nombre += nombre_array[j].charAt(0).toUpperCase() + nombre_array[j].slice(1).toLowerCase();
            }
        }

        var a_paterno = array[i]["Apellido Paterno"];
        a_paterno = a_paterno == undefined ? "": deleteBlankSpacesString(a_paterno);
        if(a_paterno == ""){
            razon += "/Hace falta el apellido paterno del trabajador ingresado";
            is_corrupted = true;
        } else {
            var paterno_array = a_paterno.split(" ");
            var a_paterno = "";
            for(var j=0; j<paterno_array.length; j++){
                if(j>0){
                    a_paterno += " ";
                }
                if(isPrepOrArt(paterno_array[j].toLowerCase())){
                    a_paterno += paterno_array[j].toLowerCase();
                } else {
                    a_paterno += paterno_array[j].charAt(0).toUpperCase() + paterno_array[j].slice(1).toLowerCase();
                }
            }
        }
        
        var a_materno = array[i]["Apellido Materno"];
        a_materno = a_materno == undefined ? "": deleteBlankSpacesString(a_materno);
        if(a_materno != ""){
            var materno_array = a_materno.split(" ");
            var a_materno = "";
            for(var j=0; j<materno_array.length; j++){
                if(j>0){
                    a_materno += " ";
                }
                if(isPrepOrArt(materno_array[j].toLowerCase())){
                    a_materno += materno_array[j].toLowerCase();
                } else {
                    a_materno += materno_array[j].charAt(0).toUpperCase() + materno_array[j].slice(1).toLowerCase();
                }
            }
        }
        var nombre_completo = nombre + " " + a_paterno + " " + a_materno;


        // validación Especialidad y Puesto

        var especialidad = array[i]["Especialidad"];
        especialidad = especialidad == undefined ? "": deleteBlankSpacesString(especialidad).toUpperCase();
        var id_especialidad = "";
        if(especialidad == ""){
            razon += "/La especialidad del trabajador es necesaria para su ingreso al sistema.";
            is_corrupted = true;
        } else {
            var exists = false;
            $('#' + id_ddl_especialidad_trabajador + ' option').each(function(){
                if (this.text == especialidad) {
                    exists = true;
                    id_especialidad = this.value;
                    return false;
                }
            });
            if(!exists){
                is_corrupted = true;
                razon += "/La especialidad ingresada no coincide con las especialidades dadas de alta en el sistema"
            }
        }

        var puesto = array[i]["Puesto"];
        puesto = puesto == undefined ? "": deleteBlankSpacesString(puesto);
        var id_puesto = "";

        if(puesto == ""){
            razon  += "/El puesto del trabajador es necesaria para su ingreso al sistema.";
            is_corrupted = true;
        } else {
            var puesto_array = puesto.split(" ");
            var puesto = "";
            for(var j=0; j<puesto_array.length; j++){
                if(j>0){
                    puesto += " ";
                }
                puesto += puesto_array[j].charAt(0).toUpperCase() + puesto_array[j].slice(1).toLowerCase();
            }
            
            var exists = false;
            $('#' + id_ddl_puesto_trabajador + ' option').each(function(){
                if (this.text == puesto) {
                    exists = true;
                    id_puesto = this.value;
                    return false;
                }
            });
            if(!exists){
                is_corrupted = true;
                razon += "/El puesto ingresado no coincide con los puestos dados de alta en el sistema"
            }
        }

        // Validación Sueldo
        var sueldo = array[i]["Sueldo Base"];
        sueldo = sueldo == undefined ? "": deleteBlankSpacesString(sueldo);

        if(sueldo == ""){
            razon += "/Hace falta el sueldo base del trabajador ingresado";
            is_corrupted = true;
        } else {
            sueldo = deformatMoney(sueldo).toFixed(2);
            if(isNaN(sueldo)){
                razon += "/El sueldo base se ingresó incorrectamente"
                is_corrupted = true;
            }
        }

        // Validación id_jefe / ¿es destajista?
        var destajista = array[i]["¿Es destajista?"];
        destajista = destajista == undefined ? "": destajista;
        var is_destajista;
        var id_jefe;
        if(destajista == ""){
            razon += "/Hace falta indicar si el trabajador es destajista."
            is_corrupted = true;
        } else {
            destajista = destajista.charAt(0).toUpperCase() + destajista.slice(1).toLowerCase();
        }
        if(destajista == "Sí"){
            id_jefe = "";
            is_destajista = true;
        } else {
            id_jefe = array[i]["ID HEAD de su jefe (en caso de ser trabajador de un destajista)"];
            id_jefe = id_jefe == undefined ? "": id_jefe;
            is_destajista = false;
        }

        // Validación fecha de antiguedad

        var fecha_antiguedad = array[i]["Fecha de Ingreso a HEAD"];
        fecha_antiguedad = fecha_antiguedad == undefined ? "" : fecha_antiguedad;
        var fecha_antiguedad_timestamps = "";

        if(fecha_antiguedad == ""){
            razon += "/Hace falta indicar la fecha en la que el trabajador ingresó a HEAD";
            is_corrupted = true;
        } else {
            antiguedad_array = fecha_antiguedad.split("-");
            if(antiguedad_array.length != 3){
                razon += "/El formato de fecha es incorrecto";
                is_corrupted = true;
            } else {
                fecha_antiguedad_timestamps = new Date(antiguedad_array[0], antiguedad_array[1] - 1, antiguedad_array[2])
                if(isNaN(fecha_antiguedad_timestamps.getTime())){
                    razon += "/El formato de fecha es incorrecto";
                    is_corrupted = true;
                } else {
                    fecha_antiguedad_timestamps = fecha_antiguedad_timestamps.getTime();
                };
            };
        };

        // Validación fecha de nacimiento
        var fecha_nacimiento = array[i]["Fecha de Nacimiento"];
        fecha_nacimiento = fecha_nacimiento == undefined ? "" : fecha_nacimiento;
        var fecha_nacimiento_timestamps = "";

        if(fecha_nacimiento != ""){
            nacimiento_array = fecha_nacimiento.split("-");
            if(nacimiento_array.length != 3){
                razon += "/El formato de fecha es incorrecto";
                is_corrupted = true;
            } else {
                fecha_nacimiento_timestamps = new Date(nacimiento_array[0], nacimiento_array[1] - 1, nacimiento_array[2])
                if(isNaN(fecha_nacimiento_timestamps.getTime())){
                    razon += "/El formato de fecha es incorrecto";
                    is_corrupted = true;
                } else {
                    fecha_nacimiento_timestamps = fecha_nacimiento_timestamps.getTime();
                };
            };
        }

        // Validación estado civil

        var estado_civil = array[i]["Estado Civil"];
        estado_civil = estado_civil == undefined ? "": deleteBlankSpacesString(estado_civil)

        if(estado_civil != ""){
            var estado_civil_array = estado_civil.split(" ");
            var estado_civil = "";
            for(var j=0; j<estado_civil_array.length; j++){
                if(j>0){
                    estado_civil += " ";
                }
                estado_civil += estado_civil_array[j].charAt(0).toUpperCase() + estado_civil_array[j].slice(1).toLowerCase();
            }
        }

        // Validación sexo. Ya viene semi validado desde el Excel
        var sexo = array[i]["Sexo"];
        sexo = sexo == undefined ? "": deleteBlankSpacesString(sexo)

        if(sexo != ""){
            sexo = sexo.charAt(0).toUpperCase() + sexo.slice(1).toLowerCase();
        }

        // Validación direccion

        var domicilio = array[i]["Domicilio"];
        domicilio = domicilio == undefined ? "": deleteBlankSpacesString(domicilio)

        // Validación código postal

        var codigo_postal = array[i]["Codigo Postal"];
        codigo_postal = codigo_postal == undefined ? "": deleteBlankSpacesString(codigo_postal)

        if(codigo_postal != ""){
            if(isNaN(codigo_postal) || codigo_postal.length != 5){
                razon += "/El código postal debe ser un número de 5 dígitos";
                is_corrupted = true;
            }
        }

        // Validación claves

        var rfc = array[i]["RFC"];
        rfc = rfc == undefined ? "": deleteBlankSpacesString(rfc).toUpperCase();

        var imss= array[i]["IMSS"];
        imss =imss == undefined ? "": deleteBlankSpacesString(imss).toUpperCase();

        var curp = array[i]["CURP"];
        curp = curp == undefined ? "": deleteBlankSpacesString(curp).toUpperCase();

        // validacion datos bancarios

        var banco= array[i]["Banco"];
         banco =  banco == undefined ? "" : deleteBlankSpacesString(banco);
        if(banco != ""){
            var banco_array = banco.split(" ");
            var banco = "";
            for(var j=0; j<banco_array.length; j++){
                if(j>0){
                    banco += " ";
                }
                if(isPrepOrArt(banco_array[j].toLowerCase())){
                    banco += banco_array[j].toLowerCase();
                } else {
                    banco += banco_array[j].charAt(0).toUpperCase() + banco_array[j].slice(1).toLowerCase();
                }
            }
        }

        var cuenta = array[i]["Cuenta"];
        cuenta = cuenta == undefined ? "": deleteBlankSpacesString(cuenta).toUpperCase();

        var clabe = array[i]["CLABE Interbancaria"];
        clabe = clabe == undefined ? "": deleteBlankSpacesString(clabe).toUpperCase();

        // validación tallas

        var camisa = array[i]["Talla Camisa"];
        camisa = camisa == undefined ? "": deleteBlankSpacesString(camisa).toUpperCase();

        var cintura = array[i]["Talla Pantalón (Cintura)"];
        cintura = cintura == undefined ? "": deleteBlankSpacesString(cintura).toUpperCase();

        var largo = array[i]["Talla Pantalón (Largo)"];
        largo = largo == undefined ? "": deleteBlankSpacesString(largo).toUpperCase();

        var zapatos = array[i]["Talla Zapatos"];
        zapatos = zapatos == undefined ? "": deleteBlankSpacesString(zapatos).toUpperCase();

        json_trabajador = {
            id_head: id_head,
            id_pagadora: id_pagadora,
            nombre: nombre_completo,
            id_especialidad: id_especialidad,
            id_puesto: id_puesto,
            sueldo_base: parseFloat(sueldo),
            id_jefe: id_jefe,
            activo: true,
            destajista: is_destajista,
            fecha_antiguedad: fecha_antiguedad_timestamps,
            info_personal:{
                fecha_nacimiento: fecha_nacimiento_timestamps,
                estado_civil: estado_civil,
                sexo: sexo,
                domicilio: domicilio,
                codigo_postal: codigo_postal
            },
            claves: {
                rfc: rfc,
                imss: imss,
                curp: curp
            },
            datos_bancarios: {
                banco: banco,
                cuenta: cuenta,
                clabe: clabe
            },
            tallas: {
                camisa: camisa,
                pantalon: cintura + "x" + largo,
                zapatos: zapatos,
            }
        };
        new_array.push([
            id_firebase,
            json_trabajador,
            is_corrupted,
            razon,
        ])
    };
    return  new_array;
}

function modalCorrectos(array){
    $('#' + id_body_modal_correctos_trabajador).html('');
    var body = document.getElementById(id_body_modal_correctos_trabajador);
    for(i=0;i<array.length;i++){
        var row = document.createElement('tr');

        var id_head = document.createElement('th');
        id_head.setAttribute("scope", "row");
        id_head.textContent = array[i][1]["id_head"];
        var nombre = document.createElement('td');
        nombre.textContent= array[i][1]["nombre"];

        row.appendChild(id_head);
        row.appendChild(nombre);
        body.appendChild(row);
    }
}

function modalIncorrectos(array){
    $('#' + id_body_modal_incorrectos_trabajador).html('');
    var body = document.getElementById(id_body_modal_incorrectos_trabajador);
    for(i=0;i<array.length;i++){
        var row = document.createElement('tr');

        var id_head = document.createElement('th');
        id_head.setAttribute("scope", "row");
        id_head.textContent = array[i][1]["id_head"];

        var nombre = document.createElement('td');
        nombre.textContent = array[i][1]["nombre"];
           
        var razones = document.createElement('td');
        var ul = document.createElement('ul');
        
        var razones_array = array[i][3].split("/");
        
        for(var j=0; j<razones_array.length; j++){
            if(razones_array[j] != ""){
                var li = document.createElement('li')
                li.textContent = razones_array[j];
                ul.appendChild(li);
            }
        }
        row.appendChild(id_head);
        row.appendChild(nombre);
        razones.appendChild(ul);        
        row.appendChild(razones);
        body.appendChild(row);
    }
}
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------


// ---------------------------  ALTA/EDICIÓN UN TRABAJADOR ----------------------------------------

$('#' + id_hide_opcionales_button_trabajador).click(function(){
    $('#' + id_hide_opcionales_icon_trabajador).toggleClass("fa-eye");
    $('#' + id_hide_opcionales_icon_trabajador).toggleClass("fa-eye-slash");
    $('#' + id_container_opcionales_trabajador).toggleClass("hidden");
});

// ----------------------- FUNCIONES NECESARIAS ----------------------------

function resetFormTrabajador(){
    $('#' + id_form__alta_trabajador).trigger("reset");
}