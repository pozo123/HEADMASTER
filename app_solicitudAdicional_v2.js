var id_tab_solicitudAdicional = "tabSolicitudAdicional";
var id_form_solicitudAdicional = "formSolicitudAdicional";
var id_form_solicitud2Adicional = "form2SolicitudAdicional";

var id_ddl_accionSolicitudAdicional = "ddl_accionSolicitudAdicional";

var id_ddl_obraSolicitudAdicional="ddl_obraSolicitudAdicional";
var id_ddl_solicitudSolicitudAdicional="ddl_solicitudSolicitudAdicional";
var id_ddl_atnSolicitudAdicional="ddl_atnSolicitudAdicional";
var id_descripcionSolicitudAdicional="descripcionSolicitudAdicional";
var id_anexosSolicitudAdicional="anexosSolicitudAdicional";
var id_div_otroSolicitudAdicional = "div_otroSolicitudAdicional";
var id_otroSolicitudAdicional = "otroSolicitudAdicional";
var id_fotoInputSolicitudAdicional="fotoInputSolicitudAdicional";
var id_imagenLabelSolicitudAdicional="imagenLabelSolicitudAdicional";
var id_leyendaSolicitudAdicional = "leyendaSolicitudAdicional";
var id_boton_cargaFotoSolicitudAdicional = "botonCargaFotoSolicitudAdicional";
var id_imagenesSolicitudAdicional="imagenesSolicitudAdicional";
var id_boton_pdfSolicitudAdicional="botonPDFSolicitudAdicional";
var id_boton_registrarSolicitudAdicional="botonRegistrarSolicitudAdicional";

var id_ddl_obra2SolicitudAdicional="ddl_obra2SolicitudAdicional";
var id_ddl_solicitud2SolicitudAdicional="ddl_solicitud2SolicitudAdicional";
var id_evidenciaInputSolicitudAdicional="evidenciaInputSolicitudAdicional";
var id_boton_copeoSolicitudAdicional="botonCopeoSolicitudAdicional";
var id_boton_cuantSolicitudAdicional="botonCuantSolicitudAdicional";
var id_boton_terminarSolicitudAdicional="botonTerminarSolicitudAdicional";

var selectAnexos;
var selectImagenes;

var fotoSeleccionada; //input
var array_fotosSeleccionadas; //inputs
var array_fotosAnexos; //inputs como url
var array_leyendasAnexos;
var indexSolicitudAdicional;
var json_anexos;

var existe_solicitud;

$('#' + id_tab_solicitudAdicional).click(function() {
    arrayAnexos = [];
    array_fotosSeleccionadas=[];
    array_fotosAnexos=[];
    array_leyendasAnexos=[];
    indexSolicitudAdicional = 0;
    json_anexos={};

    //resetFormSolicitudAdicional();
    $('#' + id_ddl_accionSolicitudAdicional).empty();
    var select = document.getElementById(id_ddl_accionSolicitudAdicional);
    var option = document.createElement('option');
    option.value = 0;
    option.text = "DAR DE ALTA";
    select.appendChild(option);
    option = document.createElement('option');
    option.value = 1;
    option.text = "COMPLETAR SOLICITUD";
    select.appendChild(option);
    $('#' + id_ddl_accionSolicitudAdicional).val(0);
    $('#' + id_form_solicitud2Adicional).addClass("hidden");

    // Llenado del ddl de obra.
    ddlObrasActivasGeneric(id_ddl_obraSolicitudAdicional);
    ddlObrasActivasGeneric(id_ddl_obra2SolicitudAdicional);

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
          json_anexos[snapChild.key]=anexo;
        })
        //Llenado de la lista de puestos
        selectAnexos = new SlimSelect({
            select: '#' + id_anexosSolicitudAdicional,
            placeholder: 'Elige el tipo de anexo proporcionado',
        });
    });

    $('#' + id_imagenesSolicitudAdicional).empty();
    selectImagenes = new SlimSelect({
        select: '#' + id_imagenesSolicitudAdicional,
        placeholder: 'Imagenes seleccionadas',
    });
});

$('#' + id_ddl_accionSolicitudAdicional).change(function(){
  var opcion = $('#' + id_ddl_accionSolicitudAdicional+' option:selected').val();
  if(opcion == 0){
    $('#' + id_form_solicitud2Adicional).addClass("hidden");
    $('#' + id_form_solicitudAdicional).removeClass("hidden");
  }else{
    $('#' + id_form_solicitud2Adicional).removeClass("hidden");
    $('#' + id_form_solicitudAdicional).addClass("hidden");
  }
});

//=========================FUNCIONES EN COMUN =================================
function ddlObrasActivasGeneric (id_objeto){
  $('#' + id_objeto).empty();
  var select = document.getElementById(id_objeto);
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
}

//=============================================================================
//========================== FORM DAR DE ALTA =================================
//=============================================================================
$('#' + id_ddl_obraSolicitudAdicional).change(function(){
  uid_obra = $('#' + id_ddl_obraSolicitudAdicional+' option:selected').val();
  resetForm1SolicitudAdicional();
  llenaDdlSolicitudSolicitudAdicional(id_ddl_solicitudSolicitudAdicional);
  llenaDdlAtnSolicitudAdicionall(id_ddl_atnSolicitudAdicional);
});

$('#' + id_ddl_solicitudSolicitudAdicional).change(function(){
  var solicitud_id = $('#' + id_ddl_solicitudSolicitudAdicional+' option:selected').val();
  if(solicitud_id == "NUEVA"){
    $('#'+id_descripcionSolicitudAdicional).val("");
    selectAnexos.set([]);
    $('#'+id_fotoInputSolicitudAdicional).val("");
  }else{
    llenaFormSolicitudSolicitudAdicional(solicitud_id);
  }
});

$('#' + id_anexosSolicitudAdicional).change(function(){
    var array_anexos = selectAnexos.selected();
    var item;
    if(array_anexos.includes("AN-05")){
      $('#'+id_div_otroSolicitudAdicional).removeClass("hidden");
    } else {
      $('#'+id_div_otroSolicitudAdicional).addClass("hidden");
    }
});

$('#' + id_leyendaSolicitudAdicional).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú,.-",e);
});

$('#' + id_fotoInputSolicitudAdicional).on("change", function(event){
    fotoSeleccionada = event.target.files[0];
    $('#' + id_imagenLabelSolicitudAdicional).text(fotoSeleccionada.name);
    $('#' + id_boton_cargaFotoSolicitudAdicional).prop("disabled", false);
    $('#' + id_boton_cargaFotoSolicitudAdicional).removeClass('btn-outline-dark');
    $('#' + id_boton_cargaFotoSolicitudAdicional).addClass('btn-outline-success');
});

$('#' + id_boton_cargaFotoSolicitudAdicional).click(function() {
  var leyenda = $('#'+id_leyendaSolicitudAdicional).val();
  if(leyenda !== "" ){
    array_fotosSeleccionadas.push(fotoSeleccionada);
    $('#' + id_imagenLabelSolicitudAdicional).text("Seleccionar una imagen");
    $('#' + id_boton_cargaFotoSolicitudAdicional).prop("disabled", true);
    $('#' + id_boton_cargaFotoSolicitudAdicional).removeClass('btn-outline-success');
    $('#' + id_boton_cargaFotoSolicitudAdicional).addClass('btn-outline-dark');
    var reader = new FileReader();
    reader.readAsDataURL(fotoSeleccionada);
    reader.onloadend = function () {
        array_fotosAnexos.push({url: reader.result, file: fotoSeleccionada});
        //console.log(imagenes_anexos);
    }
    array_leyendasAnexos.push(leyenda);
    cargaImagenDdlSolicitudAdicional();
  }else {
    alert("Ingresa una leyenda para este anexo");
  }
});

$('#' + id_boton_pdfSolicitudAdicional).click(function() {
  var fecha_pdf = new Date();
  var obra = $('#'+ id_ddl_obraSolicitudAdicional).text();
  var solicitud = $('#'+ id_ddl_solicitudSolicitudAdicional).val();
  var atencion = $('#'+ id_ddl_atnSolicitudAdicional).text();
  var descripcion = $('#'+ id_descripcionSolicitudAdicional).val();
  var anexos_seleccionados = selectAnexos.selected();
  var otros;
  if(anexos_seleccionados.includes("AN-05")){
    otros = $('#'+ id_otroSolicitudAdicional).val();
  } else {
    otros = "";
  }
  //FALTA DISCRIMINAR LAS IMAGENES Y LEYENDAS QUE SI ENTRAN EN LA SOLICITUD
  //FATA OBTENER EL NOMBRE DEL COLABORADOR HEAD
  //FALTA HACER LA VALIDACION DE LOS DATOS
  //FALTA FUNCIONALIDAD DEL BOTON REGISTRAR
  const pdfDocGenerator = pdfMake.createPdf(generaSolicitudAdic(false, obra, solicitud, descripcion, atencion, json_anexos, anexos_seleccionados, otro, array_fotosAnexos, array_leyendasAnexos, fecha_pdf , "NOMBRE DE SUPERVISOR"));
  pdfDocGenerator.open()
});

async function cargaImagenDdlSolicitudAdicional(){
  try {
    var select2 = document.getElementById(id_imagenesSolicitudAdicional);
    var option = document.createElement('option');
    option.value = indexSolicitudAdicional;
    option.text = fotoSeleccionada.name;
    if (await select2.appendChild(option)){
      var seleccionadas = selectImagenes.selected().concat([indexSolicitudAdicional]);
      selectImagenes.set(seleccionadas);
      //console.log("Termino");
    }else{
      console.log("Chale");
    }
    indexSolicitudAdicional+=1;
  } catch (error){
    console.log(error);
  }
}

function resetForm1SolicitudAdicional(){
  $('#'+id_ddl_solicitudSolicitudAdicional).val("");
  $('#'+id_ddl_atnSolicitudAdicional).val("");
  $('#'+id_descripcionSolicitudAdicional).val("");
  selectAnexos.set([]);
  $('#'+id_fotoInputSolicitudAdicional).val("");
}

function llenaDdlSolicitudSolicitudAdicional(id_objeto){
    $('#' + id_objeto).empty();
    var select = document.getElementById(id_objeto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var solicitud;
    firebase.database().ref(rama_bd_obras + "/adicionales/solicitudes/"+ uid_obra).on('child_added',function(snapshot){
      solicitud = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = solicitud.nombre;
      select.appendChild(option);
    });
    option = document.createElement('option');
    option.value = "NUEVA";
    option.text = "NUEVA";
    select.appendChild(option);
}

function llenaDdlAtnSolicitudAdicionall(id_objeto){
  firebase.database().ref(rama_bd_obras + "/obras/" + uid_obra +"/id_cliente").on('value',function(snapshot){
    var cliente_id = snapshot.val();
    $('#' + id_objeto).empty();
    var select = document.getElementById(id_objeto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var atencion;
    firebase.database().ref(rama_bd_clientes + "/contactos/"+ cliente_id).on('child_added',function(snapshot){
      atencion = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = atencion.prefijo + " " + atencion.nombre_completo;
      select.appendChild(option);
    });
  });
}

function llenaFormSolicitudSolicitudAdicional(solicitud_id){
  firebase.database().ref(rama_bd_obras + "/adicionales/solicitudes/"+ uid_obra +"/"+ solicitud_id).on('value',function(snapshot){
    if(snapshot.exists()){
      var solicitud = snapshot.val();
      var anexos_aux = [];
      $('#'+id_descripcionSolicitudAdicional).val(solicitud.descripcion);

      for(key in solicitud.anexos_tipo){
        anexos_aux.push(key);
      }
      selectAnexos.set(anexos_aux);

      $('#' + id_imagenesSolicitudAdicional).empty();
      var select = document.getElementById(id_imagenesSolicitudAdicional);
      var option;
      for(key in solicitud.anexos_imag){
        option = document.createElement('option');
        option.value = snapChild.key;
        option.text = snapChild.key;
        select.appendChild(option);
      }
    }
  });
}


//=============================================================================
//====================== FORM SUMMIT SOLICITUD ================================
//=============================================================================
