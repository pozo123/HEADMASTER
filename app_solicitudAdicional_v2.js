// elementos generales de la pagina
var id_tab_solicitudAdicional = "tabSolicitudAdicional";
var id_form_solicitudAdicional = "formSolicitudAdicional";
var id_form_solicitud2Adicional = "form2SolicitudAdicional";
var id_ddl_accionSolicitudAdicional = "ddl_accionSolicitudAdicional"; //ddl para elegir acción
//elementos del primer form
var id_ddl_obraSolicitudAdicional="ddl_obraSolicitudAdicional";
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
//elementos del segundo form
var id_ddl_obra2SolicitudAdicional="ddl_obra2SolicitudAdicional";
var id_ddl_solicitud2SolicitudAdicional="ddl_solicitud2SolicitudAdicional";
var id_boton_descargarPDFSolicitudAdicional = "botonDescargarPDFSolicitudAdicional";
var id_evidenciaInputSolicitudAdicional ="evidenciaInputSolicitudAdicional";
var id_evidenciaLabelSolicitudAdicional = "evidenciaLabelSolicitudAdicional";
var id_boton_carga2FotoSolicitudAdicional = "botonCarga2FotoSolicitudAdicional";
var id_imagenes2SolicitudAdicional="imagenes2SolicitudAdicional";
var id_notasSolicitudAdicional = "notasSolicitudAdicional";
var id_boton_copeoSolicitudAdicional="botonCopeoSolicitudAdicional";
var id_boton_cuantSolicitudAdicional="botonCuantSolicitudAdicional";
var id_boton_terminarSolicitudAdicional="botonTerminarSolicitudAdicional";
//variables auxiliares
var selectAnexos; // almacena los tipos de anexos elegidos
var selectImagenes; // almacena las imagenes seleccionadas
var fotoSeleccionada; // foto seleccionada para ser cargada
var array_fotosAnexos; // arreglo de fotos como url
var array_leyendasAnexos; // arreglo de las leyendas en paralelo
var array_fotosEvidencias; // arreglo de fotos como url
var indexSolicitudAdicional; // variable de control para los array de fotos
var json_anexos; // json de los anexos disponibles
var cont_solicitudes; // total de solicitudes de la obra
var colaborador; // nombre del colaborador que hace la solicitud

// Metodo ejecutado al cargar la pagina
$('#' + id_tab_solicitudAdicional).click(function() {
    //Inicializacion de las variables auxiliares
    arrayAnexos = [];
    array_fotosAnexos=[];
    array_leyendasAnexos=[];
    array_fotosEvidencias=[];
    indexSolicitudAdicional = 0;
    json_anexos={};
    cont_solicitudes = 0;
    colaborador = "";
    registro_antiguo={};

    // Cargar las 2 acciones
    cargarDdlAccionSolicitudAdicional();

    // Llenado del ddl de obra forms 1 y 2
    ddlObrasActivasGeneric(id_ddl_obraSolicitudAdicional);
    ddlObrasActivasGeneric(id_ddl_obra2SolicitudAdicional);

    // Llenado del ddl de anexos form 1
    cargarDllAnexosSolicitudAdicional()

    // Inicializacion del ddl de imagnenes form 2
    $('#' + id_imagenesSolicitudAdicional).empty();
    selectImagenes = new SlimSelect({
        select: '#' + id_imagenesSolicitudAdicional,
        placeholder: 'Imagenes seleccionadas',
    });
    // Inicializaciopn del ddl de imagenes form 2
    $('#' + id_imagenes2SolicitudAdicional).empty();
    selectImagenes2 = new SlimSelect({
        select: '#' + id_imagenes2SolicitudAdicional,
        placeholder: 'Imagenes seleccionadas',
    });
    // Recuperacion del nombre del colaborador
    firebase.database().ref(rama_bd_personal + "/colaboradores/"+uid_usuario_global).on('value',function(snapshot){
        var usuario = snapshot.val();
        colaborador = usuario.nombre + " " +usuario.a_paterno + " " + usuario.a_materno;
    });
    //Establecer la primera pestana como default
    $('#' + id_form_solicitud2Adicional).addClass("hidden");
    $('#' + id_form_solicitudAdicional).removeClass("hidden");
    $('#' + id_ddl_obraSolicitudAdicional).val(0);
});
// Metodo para configurar la pagina cuando se selecciona una accion
$('#' + id_ddl_accionSolicitudAdicional).change(function(){
  var opcion = $('#' + id_ddl_accionSolicitudAdicional+' option:selected').val();
  arrayAnexos = [];
  array_fotosAnexos=[];
  array_leyendasAnexos=[];
  array_fotosEvidencias=[];
  indexSolicitudAdicional = 0;
  json_anexos={};
  cont_solicitudes = 0;
  colaborador = "";
  if(opcion == 0){
    $('#' + id_form_solicitud2Adicional).addClass("hidden");
    $('#' + id_form_solicitudAdicional).removeClass("hidden");
    $('#'+id_ddl_obraSolicitudAdicional).val("");
    resetForm1SolicitudAdicional();
  }else{
    $('#' + id_form_solicitud2Adicional).removeClass("hidden");
    $('#' + id_form_solicitudAdicional).addClass("hidden");
    $('#'+id_ddl_obra2SolicitudAdicional).val("");
    resetForm2SolicitudAdicional();
  }
});

//=========================FUNCIONES EN COMUN =================================
// Metodo para cargar las acciones en el ddl
function cargarDdlAccionSolicitudAdicional(){
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
}
// Metodo para cargar los anexos en el ddl
function cargarDllAnexosSolicitudAdicional(){
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
}

// Metodo para cargar las obras en un ddl generico
// id_objeto = ddl de la obra
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

// Metodo para cargar las imagenes al ddl despues de ser cargadas a la memoria local
// id_ddl = ddl de las imagenes
// id_slim_select = slim_select asociado a ese ddl
async function cargaImagenDdlSolicitudAdicional(id_ddl, id_slim_select){
  try {
    var select2 = document.getElementById(id_ddl);
    var option = document.createElement('option');
    option.value = indexSolicitudAdicional;
    option.text = fotoSeleccionada.name;
    if (await select2.appendChild(option)){
      var seleccionadas = id_slim_select.selected().concat([indexSolicitudAdicional]);
      id_slim_select.set(seleccionadas);
      //console.log("Termino");
    }else{
      console.log("Chale");
    }
    indexSolicitudAdicional+=1;
  } catch (error){
    console.log(error);
  }
}

//=============================================================================
//========================== FORM DAR DE ALTA =================================
//=============================================================================
// Metodo accionado cuando se selecciona una obra en form 1
$('#' + id_ddl_obraSolicitudAdicional).change(function(){
  uid_obra = $('#' + id_ddl_obraSolicitudAdicional+' option:selected').val();
  resetForm1SolicitudAdicional();
  //llenaDdlSolicitudSolicitudAdicional(id_ddl_solicitudSolicitudAdicional);
  getContadorSolicitudAdicional(uid_obra);
  llenaDdlAtnSolicitudAdicionall(id_ddl_atnSolicitudAdicional);
});

// Metodo para mostrar el input OTROS en caso de ser seleccionado ese anexo
$('#' + id_anexosSolicitudAdicional).change(function(){
    var array_anexos = selectAnexos.selected();
    var item;
    if(array_anexos.includes("AN-05")){
      $('#'+id_div_otroSolicitudAdicional).removeClass("hidden");
    } else {
      $('#'+id_div_otroSolicitudAdicional).addClass("hidden");
    }
});

// Metodo para restringir caracteres en el input leyenda
$('#' + id_leyendaSolicitudAdicional).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú,.-",e);
});

// Metodo para cargar una imagen cuando se selecciona
$('#' + id_fotoInputSolicitudAdicional).on("change", function(event){
    fotoSeleccionada = event.target.files[0];
    $('#' + id_imagenLabelSolicitudAdicional).text(fotoSeleccionada.name);
    $('#' + id_boton_cargaFotoSolicitudAdicional).prop("disabled", false);
    $('#' + id_boton_cargaFotoSolicitudAdicional).removeClass('btn-outline-dark');
    $('#' + id_boton_cargaFotoSolicitudAdicional).addClass('btn-outline-success');
});

// Metodo para cargar una imagen y su leyenda en el ddl.
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
    cargaImagenDdlSolicitudAdicional(id_imagenesSolicitudAdicional, selectImagenes);
    $('#'+id_fotoInputSolicitudAdicional).val("");
  }else {
    alert("Ingresa una leyenda para este anexo");
  }
});

// Metodo del boton para generar el pdf
$('#' + id_boton_pdfSolicitudAdicional).click(function() {
  if (validateForm1SolicitudAdicional()){
    var pdfDocGenerator = generaPDFsolicitudAdicional(true);
    pdfDocGenerator.open()
  }
});

// Metodo del boton para registrar una solicitud adicional
$('#' + id_boton_registrarSolicitudAdicional).click(function(){
  if(validateForm1SolicitudAdicional()){
    var obra = $('#'+ id_ddl_obraSolicitudAdicional + ' option:selected').val();
    var solicitud = generaClaveSolicitudAdicional();
    var json_solicitud = solicitudSolicitudAdicional();
    var solicitud_update = {};
    var solicitud_path = rama_bd_obras + "/adicionales/solicitudes/";
    var storageRef = firebase.storage().ref(solicitud_path + obra + "/solicitudes/" + solicitud +".pdf");
    const pdfDocGenerator = generaPDFsolicitudAdicional(false);
    pdfDocGenerator.download(solicitud + '.pdf');
    $('#' + id_boton_registrarSolicitudAdicional).prop('disabled', true);

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
            solicitud_update[obra + "/listas/pendientes/" + solicitud] = true;
            firebase.database().ref(solicitud_path).update(solicitud_update, function(error) {
              if (error) {
                // The write failed...
                alert("¡Ups, hubo un error!");
              } else {
                // Data saved successfully!
                // PAD
                pda("alta", solicitud_path, "");
                alert("¡Registro de solicitud exitoso!");
                $('#' + id_boton_registrarSolicitudAdicional).prop('disabled', false);
                resetForm1SolicitudAdicional();
                $('#' + id_ddl_obraSolicitudAdicional).val("");
              }
            });
          });
        });
    });
  }
});

// ----------------------- FUNCIONES NECESARIAS -------------------------------
// Metodo para generar el json de registro de la solicitud
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

// Metodo para generar la clave de una solicitud nueva
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

// Metodo para validar todos los campos del form 1
function validateForm1SolicitudAdicional(){
  if($('#' + id_ddl_obraSolicitudAdicional  + " option:selected").val() == ""){
      alert("Selecciona una obra.");
      highLightColor(id_ddl_obraSolicitudAdicional,"#FF0000");
      return false;
  }  else if($('#' + id_solicitudSolicitudAdicional).val() === ""){
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

// Metodo para resetear el form 1
function resetForm1SolicitudAdicional(){
  //$('#'+id_ddl_obraSolicitudAdicional).val("");
  $('#'+id_solicitudSolicitudAdicional).val("");
  $('#'+id_ddl_atnSolicitudAdicional).val("");
  $('#'+id_descripcionSolicitudAdicional).val("");
  selectAnexos.set([]);
  $('#' + id_imagenLabelSolicitudAdicional).text("Seleccionar una imagen");
  $('#' + id_leyendaSolicitudAdicional).val("");
  $('#' + id_imagenesSolicitudAdicional).empty();
}

// Metodo para recuperar el numero de solicitudes registradas de un obra
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

// Metodo para llenar ddl de atenciones de una obra (depende del cliente registrado)
// id_objeto = ddl de las atenciones
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

// Metodo para generar el pdf de una solicitud
// vista_previa = boolean (true: no parece logo, false: aparece logo)
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
// Metodo accionado cuando se selecciona una obra en form 2
$('#' + id_ddl_obra2SolicitudAdicional).change(function(){
  uid_obra = $('#' + id_ddl_obra2SolicitudAdicional+' option:selected').val();
  resetForm2SolicitudAdicional();
  llenaDdlSolicitudSolicitudAdicional(id_ddl_solicitud2SolicitudAdicional);
});

// Metodo accionado cuando se selecciona una solicitud en form 2
$('#' + id_ddl_solicitud2SolicitudAdicional).change(function(){
  firebase.database().ref( rama_bd_obras + "/adicionales/solicitudes/"+ uid_obra+"/solicitudes/" +  $('#' + id_ddl_solicitud2SolicitudAdicional+' option:selected').val()).on('value',function(snapshot){
    if(snapshot.exists()){
      registro_antiguo = snapshot.val();
    }else {
      registro_antiguo = {};
    }
  });
  json_modalCopeo = {};
  json_modalSuministros = {};
});

// Metodo del boton para descargar el pdf de una solicitud registrada
$('#' + id_boton_descargarPDFSolicitudAdicional).click(function() {
  if($('#' + id_ddl_obra2SolicitudAdicional).val() !== "" && $('#' + id_ddl_solicitud2SolicitudAdicional).val() !== ""){
    var solicitud_path = rama_bd_obras + "/adicionales/solicitudes/";
    // Create a reference to the file we want to download
    var storageRef = firebase.storage().ref(solicitud_path + uid_obra + "/solicitudes/" + $('#' + id_ddl_solicitud2SolicitudAdicional).val() +".pdf");
    // Get the download URL
    storageRef.getDownloadURL().then(function(url) {
    //console.log(url);
    window.open(url);

    }).catch(function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          console.log("El archivo no existe");
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          console.log("Acceso denegado");
          break;

        case 'storage/canceled':
          // User canceled the upload
          console.log("Descarga cancelada");
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          console.log("Error desconocido");
          break;

        default:
          console.log("Hubo error");
      }
});
  }else {
    alert("Selecciona una obra y una solicitud");
  }
});

// Metodo para cargar una foto de evidencia seleccionada
$('#' + id_evidenciaInputSolicitudAdicional).on("change", function(event){
    fotoSeleccionada = event.target.files[0];
    $('#' + id_evidenciaLabelSolicitudAdicional).text(fotoSeleccionada.name);
    $('#' + id_boton_carga2FotoSolicitudAdicional).prop("disabled", false);
    $('#' + id_boton_carga2FotoSolicitudAdicional).removeClass('btn-outline-dark');
    $('#' + id_boton_carga2FotoSolicitudAdicional).addClass('btn-outline-success');
});

// Metodo del boton para cargar una imagen evidencia en el ddl.
$('#' + id_boton_carga2FotoSolicitudAdicional).click(function() {
  $('#' + id_evidenciaLabelSolicitudAdicional).text("Seleccionar una imagen");
  $('#' + id_boton_carga2FotoSolicitudAdicional).prop("disabled", true);
  $('#' + id_boton_carga2FotoSolicitudAdicional).removeClass('btn-outline-success');
  $('#' + id_boton_carga2FotoSolicitudAdicional).addClass('btn-outline-dark');
  var reader = new FileReader();
  reader.readAsDataURL(fotoSeleccionada);
  reader.onloadend = function () {
      array_fotosEvidencias.push({url: reader.result, file: fotoSeleccionada});
      //console.log(imagenes_anexos);
  }
  cargaImagenDdlSolicitudAdicional(id_imagenes2SolicitudAdicional, selectImagenes2);
});

/*
var json_prueba = {
  '-LqvvP8fTtFc90YpVAFy':{
    cantidad: 1,
    descripcion: "EHE",
    desplegar: true,
    precio_cliente: 55,
    precio_lista: 50,
    unidad: "Kg",
  }
};
*/
// Metodo del boton para abrir el modal de cuantificacion
$('#' + id_boton_cuantSolicitudAdicional).click(function() {
  var json_insumosRegistrados = {};
  var pathInsumos = rama_bd_obras+"/adicionales/solicitudes/" + uid_obra + "/solicitudes/" + $('#' + id_ddl_solicitud2SolicitudAdicional).val() + "/cuantificacion";
  if(jQuery.isEmptyObject(json_modalSuministros)){
    firebase.database().ref(pathInsumos).once('value',function(snapshot){
      if(snapshot.exists()){
        json_insumosRegistrados = snapshot.val();
      }
      modalSuministros(0, true, json_insumosRegistrados); // resultado en json_modalSuministros
    });
  }else{
    modalSuministros(0, true, json_modalSuministros);
  }

});

// Metodo del boton para abrir el modal de copeo
$('#' + id_boton_copeoSolicitudAdicional).click(function() {
  var json_copeoRegistrado = {};
  var pathCopeo = rama_bd_obras+"/adicionales/solicitudes/" + uid_obra + "/solicitudes/" + $('#' + id_ddl_solicitud2SolicitudAdicional).val() + "/copeo";
  if(jQuery.isEmptyObject(json_modalCopeo)){
    firebase.database().ref(pathCopeo).once('value',function(snapshot){
      if(snapshot.exists()){
        json_copeoRegistrado = snapshot.val();
      }
      modalCopeo(json_copeoRegistrado, true); // resultado en json_modalCopeo
    });
  }else{
    modalCopeo(json_modalCopeo, true); // resultado en json_modalCopeo
  }
});

// Metodo del boton para terminar una solicitud adicional
$('#' + id_boton_terminarSolicitudAdicional).click(function() {
  if(validateForm2SolicitudAdicional()){
    var obra = $('#'+ id_ddl_obra2SolicitudAdicional + ' option:selected').val();
    var solicitud = $('#'+ id_ddl_solicitud2SolicitudAdicional + ' option:selected').val();
    var solicitud_update = {};
    var solicitud_path = rama_bd_obras + "/adicionales/solicitudes/";
    var storageRef = firebase.storage().ref(solicitud_path + obra + "/solicitudesTerminadas/" + solicitud +".pdf");
    const pdfDocGenerator = generaPDFsolicitudTerminada();
    //pdfDocGenerator.open();
    $('#' + id_boton_terminarSolicitudAdicional).prop('disabled', true);

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
            //console.log(json_solicitud);
            solicitud_update[obra + "/solicitudes/" + solicitud + "/terminada"] = true;
            solicitud_update[obra + "/solicitudes/" + solicitud + "/url_evidencia"] = downloadURL;
            solicitud_update[obra + "/solicitudes/" + solicitud + "/notas"] = $('#' + id_notasSolicitudAdicional).val();
            solicitud_update[obra + "/solicitudes/" + solicitud + "/copeo"] = json_modalCopeo;
            solicitud_update[obra + "/solicitudes/" + solicitud + "/cuantificacion"] = json_modalSuministros;
            solicitud_update[obra + "/listas/pendientes/" + solicitud] = null;
            solicitud_update[obra + "/listas/terminadas/" + solicitud] = true;
            firebase.database().ref(solicitud_path).update(solicitud_update, function(error) {
              if (error) {
                // The write failed...
                alert("¡Ups, hubo un error!");
              } else {
                // Data saved successfully!
                // PAD
                pda("modificacion", solicitud_path, registro_antiguo);
                alert("¡Registro de solicitud exitoso!");
                $('#' + id_boton_terminarSolicitudAdicional).prop('disabled', false);
                resetForm2SolicitudAdicional();
                $('#' + id_ddl_obra2SolicitudAdicional).val("");
                json_modalCopeo = {};
                json_modalSuministros = {};
              }
            });
          });
        });
    });
  }
});

//-------------------------FUNCIONES NECESARIAS -------------------------------
// Metodo para resetear el form 2
function resetForm2SolicitudAdicional(){
  //$('#'+id_ddl_obra2SolicitudAdicional ).val("");
  $('#' + id_ddl_solicitud2SolicitudAdicional).val("");
  $('#' + id_evidenciaInputSolicitudAdicional).text("Archivo no seleccionado");
  $('#' + id_imagenesSolicitudAdicional).empty();
  $('#' + id_notasSolicitudAdicional).val("");
}

// Metodo para llenar el ddl solicitudes cuando se selecciona una obra
function llenaDdlSolicitudSolicitudAdicional(id_objeto){
    $('#' + id_objeto).empty();
    var select = document.getElementById(id_objeto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var solicitud;
    firebase.database().ref(rama_bd_obras + "/adicionales/solicitudes/"+ uid_obra+"/listas/pendientes").on('child_added',function(snapshot){
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = snapshot.key;
      select.appendChild(option);
    });
}

// Metodo para generar el pdf de una solicitud
// vista_previa = boolean (true: no parece logo, false: aparece logo)
function generaPDFsolicitudTerminada(){
  var indices_seleccionados = selectImagenes2.selected();
  var fotos_seleccionadas=[];
  for(i=0; i<indices_seleccionados.length; i++){
    fotos_seleccionadas.push(array_fotosEvidencias[indices_seleccionados[i]]);
  }
  var pdfDocGenerator = pdfMake.createPdf(generaSolicitudTerminada(fotos_seleccionadas));
  return pdfDocGenerator;
}

// Metodo para validar todos los campos del form 2
function validateForm2SolicitudAdicional(){
  if($('#' + id_ddl_obra2SolicitudAdicional  + " option:selected").val() == ""){
      alert("Selecciona una obra.");
      highLightColor(id_ddl_obraSolicitudAdicional,"#FF0000");
      return false;
  }  else if($('#' + id_ddl_solicitud2SolicitudAdicional  + " option:selected").val() == ""){
      alert("Selecciona una solicitud");
      highLightColor(id_ddl_solicitudSolicitudAdicional,"#FF0000");
      return false;
  } else if(selectImagenes2.selected().length == 0){
      alert("Agrega las imagenes del documento de solicitud formado");
      return false;
  } else {
      return true;
  }
}


//------------------------Cementerio ------------------------------
/*
// Metodo para llenar el formulario de una solicitud ya registrada
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
*/
