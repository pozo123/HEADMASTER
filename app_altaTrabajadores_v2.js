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

        // llenar arrays de destajistas y no destajistas
        console.log(array_datos_xlsx);
        for(i=0;i<array_datos_xlsx.length;i++){
            if(array_datos_xlsx[i]["¿Es destajista?"] == "Sí"){
                array_destajistas.push(array_datos_xlsx[i]);
            } else {
                array_no_destajistas.push(array_datos_xlsx[i]);
            };
        };
        var validated_data = validateExcelRow(array_destajistas);
        console.log(validated_data)
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

        var id_firebase = id_firebase == undefined ? "" : id_firebase;
        
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
        } 

        json_trabajador = {
            id_head: id_head,
            id_pagadora: id_pagadora,
            nombre: nombre_completo,
            id_especialidad: id_especialidad,
            id_puesto: id_puesto,
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