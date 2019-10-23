var id_tab_solicitudAdicional = "tabSolicitudAdicional";
var id_form_solicitudAdicional = "formSolicitudAdicional";

var id_ddl_obraSolicitudAdicional="ddl_obraSolicitudAdicional";
var id_dd_atnSolicitudAdicional="ddl_atnSolicitudAdicional";
var id_descripcionSolicitudAdicional="descripcionSolicitudAdicional";
var id_anexosSolicitudAdicional="anexosSolicitudAdicional";
var id_fotoInputSolicitudAdicional="fotoInputSolicitudAdicional";
var id_imagenLabelSolicitudAdicional="imagenLabelSolicitudAdicional";
var id_boton_pdfSolicitudAdicional="botonPDFSolicitudAdicional";
var id_boton_registrarSolicitudAdicional="botonRegistrarSolicitudAdicional";

$('#' + id_tab_solicitudAdicional).click(function() {
    //resetFormSolicitudAdicional();

    // Llenado del ddl de obra.
    $('#' + id_ddl_obraSolicitudAdicional).empty();
    var select = document.getElementById(id_ddl_obraSolicitudAdicional);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var obra;
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        obra = snapshot.val();
        option = document.createElement('option');
        option.value = snapshot.key;
        option.text = obra.nombre;
        select.appendChild(option);
    });
    $('#' + id_anexosSolicitudAdicional).empty();
    var anexo;
    var select2 = document.getElementById(id_anexosSolicitudAdicional);
    firebase.database().ref(rama_bd_datos_referencia + "/anexos").on('value',function(snapshot){
        snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
          anexo = snapChild.val();
          option = document.createElement('option');
          option.value = snapChild.key;
          option.text = anexo;
          select2.appendChild(option);
        })
        //Llenado de la lista de puestos
        selectTrabajadores = new SlimSelect({
            select: '#' + id_anexosSolicitudAdicional,
            placeholder: 'Elige el tipo de anexo proporcionado',
        });
    });
});
