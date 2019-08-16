// id's de los elementos HTML
var id_tab_trabajador = "tabTrabajadores";
var id_form_trabajador = "formAltaTrabajadores";
var id_form_trabajador = "formAltaTrabajadores";
var id_dataTable_trabajador = "dataTableCliente";

// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los clientes

var id_file_label_formato_excel_trabajador = "fileLabelImportarTrabajador";
var id_file_input_formato_excel_trabajador = "fileInputImportarTrabajador";

var id_descargar_formato_button_trabajador = "descargarFormatoButtonTrabajador";

var id_hide_opcionales_button_trabajador = "hideOpcionalesButtonTrabajador";
var id_hide_opcionales_icon_trabajador = "hideOpcionalesIconTrabajador";
var id_container_opcionales_trabajador = "opcionalesContainer";

// variables globales

var formato_importar_fileSelected = "";

$('#' + id_tab_trabajador).click(function() {
    resetFormImportar()
   // resetFormTrabajador();
   // actualizarTrabajador();   

   var prueba = firebase.database().ref(rama_bd_trabajadores + "prueba").push().getKey();
   console.log(prueba);
});

// ---------------------------  IMPORTAR TRABAJADORES ----------------------------------------------

$('#' + id_file_input_formato_excel_trabajador).on("change", function(event){
    formato_importar_fileSelected = event.target.files[0];
    console.log(formato_importar_fileSelected);
    $('#' + id_file_label_formato_excel_trabajador).text(formato_importar_fileSelected.name);
    $('#' + id_file_label_formato_excel_trabajador).attr("style", "color: #00C851");

    var reader = new FileReader();
    var array_trabajadores = [];

    reader.onload = function (e) {
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
        array_trabajadores = XLSX.utils.sheet_to_json(worksheet, {
            dateNF: "YYYY-MM-DD"
        });
        console.log(array_trabajadores)
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
