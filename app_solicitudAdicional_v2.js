var id_tab_solicitudAdicional = "tabSolicitudAdicional";
var id_form_solicitudAdicional = "formSolicitudAdicional";
var id_form_solicitud2Adicional = "form2SolicitudAdicional";

var id_ddl_accionSolicitudAdicional = "ddl_accionSolicitudAdicional";

var id_ddl_obraSolicitudAdicional="ddl_obraSolicitudAdicional";
//var id_ddl_solicitudSolicitudAdicional="ddl_solicitudSolicitudAdicional";
var id_solicitudSolicitudAdicional="solicitudSolicitudAdicional";
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
var array_fotosAnexos; //inputs con url
var array_leyendasAnexos;
var indexSolicitudAdicional;
var json_anexos;
var cont_solicitudes;
var colaborador;

var existe_solicitud;

$('#' + id_tab_solicitudAdicional).click(function() {
    arrayAnexos = [];
    array_fotosAnexos=[];
    array_leyendasAnexos=[];
    indexSolicitudAdicional = 0;
    json_anexos={};
    cont_solicitudes = 0;
    colaborador = "";

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

    firebase.database().ref(rama_bd_personal + "/colaboradores/"+uid_usuario_global).on('value',function(snapshot){
        var usuario = snapshot.val();
        colaborador = usuario.nombre + " " +usuario.a_paterno + " " + usuario.a_materno;
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
  //llenaDdlSolicitudSolicitudAdicional(id_ddl_solicitudSolicitudAdicional);
  getContadorSolicitudAdicional(uid_obra);
  llenaDdlAtnSolicitudAdicionall(id_ddl_atnSolicitudAdicional);
});
/*
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
*/
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
    $('#'+id_leyendaSolicitudAdicional).val("");
    cargaImagenDdlSolicitudAdicional();
  }else {
    alert("Ingresa una leyenda para este anexo");
  }
});

$('#' + id_boton_pdfSolicitudAdicional).click(function() {
  if (validateFormSolicitudAdicional()){
    var pdfDocGenerator = generaPDFsolicitudAdicional(true);
    pdfDocGenerator.open()
  }
});

$('#' + id_boton_registrarSolicitudAdicional).click(function(){
  if(validateFormSolicitudAdicional()){
    var obra = $('#'+ id_ddl_obraSolicitudAdicional + ' option:selected').val();
    var solicitud = generaClaveSolicitudAdicional();
    var json_solicitud = solicitudSolicitudAdicional();
    var solicitud_update = {};
    var solicitud_path = rama_bd_obras + "/adicionales/solicitudes/";
    var storageRef = firebase.storage().ref(solicitud_path + obra + "/solicitudes/" + solicitud +".pdf");
    const pdfDocGenerator = generaPDFsolicitudAdicional(false);
    pdfDocGenerator.download(solicitud + '.pdf');
    $(id_boton_registrarSolicitudAdicional).prop('disabled', true);

    pdfDocGenerator.getBase64((data) => {
      var uploadTask = storageRef.putString(data,'base64');
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
          console.log('Error al cargar el pdf');
        }, function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            json_solicitud['url_pdf'] = downloadURL;
            //console.log(json_solicitud);
            solicitud_update[obra + "/solicitudes/" + solicitud] = json_solicitud;
            solicitud_update[obra + "/contador"] = cont_solicitudes+1;
            firebase.database().ref(solicitud_path).update(solicitud_update, function(error) {
              if (error) {
                // The write failed...
                alert("¡Ups, hubo un error!");
              } else {
                // Data saved successfully!
                // PAD
                pda("alta", solicitud_path, "");
                alert("¡Registro de solicitud exitoso!");
                $(id_boton_registrarSolicitudAdicional).prop('disabled', false);
                resetForm1SolicitudAdicional();
              }
            });
          });
        });
    });

  }
});

function solicitudSolicitudAdicional(){
  var fecha_pdf = new Date();
  var atencion = $('#'+ id_ddl_atnSolicitudAdicional + ' option:selected').text();
  var descripcion = $('#'+ id_descripcionSolicitudAdicional).val();
  var anexos_seleccionados = selectAnexos.selected();
  var otros;
  if(anexos_seleccionados.includes("AN-05")){
    otros = $('#'+ id_otroSolicitudAdicional).val();
  } else {
    otros = "";
  }
  var json_anexos_seleccionados = {};
  for(i=0; i<anexos_seleccionados.length;i++){
    json_anexos_seleccionados[anexos_seleccionados[i]] = json_anexos[anexos_seleccionados[i]];
  }
  var json_solicitud = {
    descripcion: descripcion,
    anexos_tipo: json_anexos_seleccionados,
    otros: otros,
    atencion: atencion,
    terminada: false,
  };
  return json_solicitud
}

function generaClaveSolicitudAdicional(){
  var solicitud;
  var clave = cont_solicitudes+1;
  if(clave <10){
    solicitud = "S-0"+ clave;
  }else {
    solicitud = "S-"+ clave;
  }
  return solicitud;
}

function validateFormSolicitudAdicional(){
  if($('#' + id_ddl_obraSolicitudAdicional  + " option:selected").val() == ""){
      alert("Selecciona una obra.");
      highLightColor(id_ddl_obraSolicitudAdicional,"#FF0000");
      return false;
  }  else if($('#' + id_solicitudSolicitudAdicional  + " option:selected").val() === ""){
      alert("Error en la generacion de la clave");
      highLightColor(id_ddl_solicitudSolicitudAdicional,"#FF0000");
      return false;
  } else if($('#' + id_ddl_atnSolicitudAdicional + " option:selected").val() == ""){
      alert("Selecciona una persona de atención");
      highLightColor(id_ddl_atnSolicitudAdicional,"#FF0000");
      return false;
  } else if($('#' + id_descripcionSolicitudAdicional ).val() == ""){
      alert("Agrega una descripción para la solicitud");
      highLightColor(id_descripcionSolicitudAdicional,"#FF0000");
      return false;
  } else if(selectAnexos.selected().length == 0){
      alert("Selecciona el tipo de anexo a agregar");
      highLightColor(id_anexosSolicitudAdicional,"#FF0000");
      return false;
  } else if(selectAnexos.selected().includes("AN-05") && $('#' + id_otroSolicitudAdicional).val() == ""){
      alert("Especifica el tipo de anexo");
      highLightColor(id_otroSolicitudAdicional,"#FF0000");
      return false;
  } else if(selectImagenes.selected().length == 0){
      alert("Agrega una imagen para sustentar la solicitud");
      return false;
  } else {
      return true;
  }
}

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
  $('#'+id_ddl_obraSolicitudAdicional).val("");
  $('#'+id_solicitudSolicitudAdicional).val("");
  $('#'+id_ddl_atnSolicitudAdicional).val("");
  $('#'+id_descripcionSolicitudAdicional).val("");
  selectAnexos.set([]);
  $('#'+id_imagenLabelSolicitudAdicional).val("Seleccionar una imagen");
  $('#' + id_leyendaSolicitudAdicional).val("");
  $('#' + id_imagenesSolicitudAdicional).empty();

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
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = snapshot.key;
      select.appendChild(option);
      cont_solicitudes+=1;
    });
    option = document.createElement('option');
    option.value = "NUEVA";
    option.text = "NUEVA";
    select.appendChild(option);
}

function getContadorSolicitudAdicional(clave_obra){
  firebase.database().ref(rama_bd_obras + "/adicionales/solicitudes/"+ clave_obra + "/contador").on('value',function(snapshot){
      if(snapshot.exists()){
        cont_solicitudes = snapshot.val();
      } else {
        cont_solicitudes = 0;
      }
      $('#'+id_solicitudSolicitudAdicional).val(generaClaveSolicitudAdicional());
  });
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

function generaPDFsolicitudAdicional(vista_previa){
  var fecha_pdf = new Date();
  var obra = $('#'+ id_ddl_obraSolicitudAdicional + ' option:selected').text();
  var solicitud = generaClaveSolicitudAdicional();
  var atencion = $('#'+ id_ddl_atnSolicitudAdicional + ' option:selected').text();
  var descripcion = $('#'+ id_descripcionSolicitudAdicional).val();
  var anexos_seleccionados = selectAnexos.selected();
  var otros;
  if(anexos_seleccionados.includes("AN-05")){
    otros = $('#'+ id_otroSolicitudAdicional).val();
  } else {
    otros = "";
  }
  var indices_seleccionados = selectImagenes.selected();
  var fotos_seleccionadas=[];
  var leyendas_seleccionadas=[];
  for(i=0; i<indices_seleccionados.length; i++){
    fotos_seleccionadas.push(array_fotosAnexos[indices_seleccionados[i]]);
    leyendas_seleccionadas.push(array_leyendasAnexos[indices_seleccionados[i]]);
  }
  var pdfDocGenerator = pdfMake.createPdf(generaSolicitudAdic(vista_previa, obra, solicitud, descripcion, atencion, json_anexos, anexos_seleccionados, otros, fotos_seleccionadas, leyendas_seleccionadas, fecha_pdf , colaborador));
  return pdfDocGenerator;
}

//=============================================================================
//====================== FORM SUMMIT SOLICITUD ================================
//=============================================================================
