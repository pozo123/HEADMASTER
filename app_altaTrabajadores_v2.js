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
var id_ddl_especialidad_trabajador = "especialidadDdlrabajador";
var id_ddl_puesto_trabajador = "puestoDdlrabajador";
var id_span_correctos_trabajador = "spanCorrectosTrabajador";
var id_span_incorrectos_trabajador = "spanIncorrectosTrabajador";

var id_descargar_formato_button_trabajador = "descargarFormatoButtonTrabajador";

var id_hide_opcionales_button_trabajador = "hideOpcionalesButtonTrabajador";
var id_hide_opcionales_icon_trabajador = "hideOpcionalesIconTrabajador";
var id_container_opcionales_trabajador = "opcionalesContainer";

// variables globales

var formato_importar_fileSelected = "";

$('#' + id_tab_trabajador).click(function() {
    resetFormImportar()
    resetFormTrabajador();
   // actualizarTrabajador();   

   //var prueba = firebase.database().ref(rama_bd_mano_obra + "/prueba").push().getKey();
   //console.log(prueba);

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
    $('#' + id_file_label_formato_excel_trabajador).attr("style", "color: #00C851");

    var reader = new FileReader();
    reader.onload = function (e) {
        var array_datos_xlsx = [];
        var array_destajistas = [];
        var array_no_destajistas = [];
        var corrupted_rows = 0;

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
        var validated_data = validateExcelRow(array_datos_xlsx)
        firebase.database().ref(rama_bd_mano_obra + "/trabajadores").once("value").then(function(snapshot){
            for(i=0;i<validated_data.length;i++){
                if(validated_data[i][0] != ""){
                    if(!snapshot.child(validated_data[i][0]).exists()){
                        validated_data[i][2] = true;
                        validated_data[i][3] = "El ID Firebase ingresado no se encuentra en la base de datos";
                    }
                } else {
                    validated_data[i][0] = firebase.database().ref(rama_bd_mano_obra + "/trabajadores").push().key;
                }

            };

            // Método para llenar las tablas con info de usuarios correctos e incorrectos

            for(i=0;i <validated_data.length;i++){
                corrupted_rows = validated_data[i][2] ? corrupted_rows: corrupted_rows + 1;

                if(validated_data[i][1]["destajista"]){
                    array_destajistas.push(validated_data[i]);
                } else {
                    array_no_destajistas.push(validated_data[i]);
                };
            }

            $('#' + id_span_incorrectos_trabajador).text(corrupted_rows)
            $('#' + id_span_correctos_trabajador).text(validated_data.length - corrupted_rows)
            // --------------------------------------------------------------------------- 
            console.log(validated_data);
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


// ----------------------- FUNCIONES NECESARIAS ----------------------------

function resetFormImportar(){
    formato_importar_fileSelected = "";
    $('#' + id_file_label_formato_excel_trabajador).text("Archivo no seleccionado")
    $('#' + id_file_label_formato_excel_trabajador).attr("style", "color: black");
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
            if(isNaN(parseInt(id_head,10))){
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
            id_jefe = id_head;
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
            if(isNaN(parseInt(codigo_postal)) || codigo_postal.length != 5){
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
            sueldo_base: sueldo,
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