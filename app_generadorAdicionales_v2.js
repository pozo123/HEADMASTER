var id_tab_adicionales = "tabGeneradorAdic";
var id_form_adicionales = "formGeneradorAdic";

var id_ddl_obraAdicionales = "ddl_obraAdicionales";
var id_ddl_adicionalAdicionales = "ddl_adicionalAdicionales";
var id_claveAdicionales = "claveAdicionales";
var id_ddl_solicitudAdicionales = "ddl_solicitudAdicionales";
var id_nombreAdicionales = "nombreAdicionales";
var id_tituloAdicionales = "tituloAdicionales";
var id_ddl_atencionAdicionales = "ddl_atencionAdicionales";
var id_indirectosAdicionales = "indirectosAdicionales";
var id_boton_suministrosAdicionales = "botonSuministrosAdicionales";
var id_cb_indirectosAdicionales = "cb_indirectosAdicionales";
var id_boton_copeoAdicionales = "botonCopeoAdicionales";
var id_boton_calculadoraAdicionales = "botonCalculadoraAdicionales";
var id_ddl_requisitosAdicionales = "ddl_requisitosAdicionales";
var id_ddl_exclusionesAdicionales = "ddl_exclusionesAdicionales";
var id_anticiposAdicionales = "anticiposAdicionales";
var id_estimacionesAdicionales = "estimacionesAdicionales";
var id_tiempoEntregaAdicionales = "tiempoEntregaAdicionales";
var id_cb_bancariosAdicionales = "cb_bancariosAdicionales";
var id_cb_fiscalesAdicionales = "cb_fiscalesAdicionales";
var id_botonpdfAdicionales = "botonpdfAdicionales";
var id_botonRegistrarAdicionales = "botonRegistrarAdicionales";
var id_botonBorrarAdicionales = "botonBorrarAdicionales";

var json_requisitos;
var json_exclusiones;
var select_requisitos;
var select_exclusiones;
var flagCuantificacionAdicionales;
var flagDownloadAdicionales;
var datos_obraAdicionales;
var no_adic;
var download_images_url;

$('#' + id_tab_adicionales).click(function() {
  json_modalSuministros={};
  json_modalCopeo={};
  json_modalCalculadora={};
  json_requisitos={};
  json_exclusiones={};
  flagCuantificacionAdicionales = false;
  flagDownloadAdicionales = false;
  download_images_url=[];
  ddlObrasActivasGeneric(id_ddl_obraAdicionales);
  cargarDdlRequisitosAdicionales();
  cargarDdlExclusionesAdicionales();
  $('#' + id_ddl_obraAdicionales + ' option:selected').val("");
  resetAdicionales();
});

// ------------------------ FUNCIONES DEL FORM ---------------------------------

$('#' + id_ddl_obraAdicionales).change(function(){
  resetAdicionales();
  llenaDdlAdicionalAdicionales(id_ddl_adicionalAdicionales);
  //llenaDdlSolicitudAdicionales(id_ddl_solicitudAdicionales);
  llenaDdlAtnGeneric(id_ddl_atencionAdicionales, $('#' + id_ddl_obraAdicionales + ' option:selected').val());
  clienteDireccionObraGeneric($('#' + id_ddl_obraAdicionales + ' option:selected').val());
});

$('#' + id_ddl_adicionalAdicionales ).change(function(){
  if($('#' + id_ddl_adicionalAdicionales + ' option:selected').val() == "-NUEVO-"){
    llenaDdlSolicitudAdicionales(id_ddl_solicitudAdicionales);
    generaClaveAdicionales(id_claveAdicionales);
  }else{
    var clave_adic = $('#' + id_ddl_adicionalAdicionales + ' option:selected').val();
    extraerCopeoInsumosCalculadoraAdicionales(clave_adic);
    llenarFormPropuestaAdicionales(clave_adic);
    $('#' + id_ddl_solicitudAdicionales).prop('disabled', true);
  }
});

$('#' + id_ddl_solicitudAdicionales).change(function(){
  var clave_sol = $('#' + id_ddl_solicitudAdicionales + ' option:selected').val();
  llenarFormSolicitudAdicionales(clave_sol);
  flagCuantificacionAdicionales = false;
  flagDownloadAdicionales = false;
});

$('#' + id_indirectosAdicionales).on("change", function(event){
    if($('#' + id_indirectosAdicionales).val() == ""){
      $('#' + id_indirectosAdicionales).val(0);
    }
    flagCuantificacionAdicionales = false;
});

// Metodo del boton para abrir el modal de cuantificacion
$('#' + id_boton_suministrosAdicionales).click(function() {
  if($('#' + id_ddl_adicionalAdicionales + ' option:selected').val() && !flagCuantificacionAdicionales){
    actualizaPreciosClienteAdicionales();
  }
  modalSuministros(parseFloat($('#' + id_indirectosAdicionales).val()).toFixed(2), false, json_modalSuministros);
  flagCuantificacionAdicionales = true;
});

// Metodo del boton para abrir el modal de cuantificacion
$('#' + id_boton_copeoAdicionales).click(function() {
  modalCopeo(json_modalCopeo, true);
});

// Metodo del boton para abrir el modal de calculadora
$('#' + id_boton_calculadoraAdicionales).click(function() {
  if(jQuery.isEmptyObject(json_modalCalculadora)){
    json_modalCalculadora["score"]={};
    json_modalCalculadora["score"]["horas_programadas"] = 0;
    json_modalCalculadora["score"]["costo_hora"] = 1300;
    json_modalCalculadora["porcentaje_indirectos"] = 10;
    json_modalCalculadora["utilidad"] = 0;
    json_modalCalculadora["precio_venta"] = 0;
  }
  var totales = calculaCostoSuministros();
  json_modalCalculadora["costo_suministros"] = totales.costos;
  json_modalCalculadora["precopeo"] = calculaCostoCopeo();
  json_modalCalculadora["porcentaje_impuestos"] = extraeImpuesto();
  json_modalCalculadora["precio_venta"] = parseFloat(totales.precio_venta + json_modalCalculadora["precopeo"]*(1+json_modalCalculadora["porcentaje_impuestos"]*0.01)*(1+$('#'+ id_indirectosAdicionales).val()*0.01)).toFixed(2);
  //console.log(json_modalCalculadora);

  modalCalculadora(json_modalCalculadora, false, true);
});

$('#' + id_modalCalculadora).on('hidden.bs.modal', function () {
    var porcentaje = 100 * (json_modalCalculadora["precio_venta"]-json_modalCalculadora["costo_suministros"]- json_modalCalculadora["precopeo"]*(1+json_modalCalculadora["porcentaje_impuestos"]*0.01))/ (json_modalCalculadora["costo_suministros"]+json_modalCalculadora["precopeo"]*(1+json_modalCalculadora["porcentaje_impuestos"]*0.01));
    if(parseFloat(porcentaje).toFixed(2) !== $('#'+ id_indirectosAdicionales).val()){
      $('#'+ id_indirectosAdicionales).val(parseFloat(porcentaje).toFixed(2));
      actualizaPreciosClienteAdicionales();
    }
})

$('#' + id_anticiposAdicionales).change(function(){
  if($('#' + id_anticiposAdicionales).val() == "" || $('#' + id_anticiposAdicionales).val() < 0){
    $('#' + id_anticiposAdicionales).val(0);
  }
    $('#' + id_estimacionesAdicionales).val(100 - $('#' + id_anticiposAdicionales).val());
});

$('#' + id_estimacionesAdicionales).change(function(){
  if($('#' + id_estimacionesAdicionales).val() == ""  || $('#' + id_estimacionesAdicionales).val() < 0){
    $('#' + id_estimacionesAdicionales).val(0);
  }
  $('#' + id_anticiposAdicionales).val(100 - $('#' + id_estimacionesAdicionales).val());
});

// Metodo del boton para abrir el modal de calculadora
$('#' + id_botonpdfAdicionales).click(function() {
  if (validateFormAdicionales()){
    var path = rama_bd_obras+"/adicionales/solicitudes/"+$('#' + id_ddl_obraAdicionales+' option:selected').val()+"/solicitudesTerminadas/"+$('#'+id_ddl_solicitudAdicionales+' option:selected').val();
    console.log(path);
    $('#' + id_botonpdfAdicionales).prop('disabled',true);
    getAllFirebaseStorageGeneric(path).then(function(images_array){
      console.log(images_array);
      downloadAllImagesGeneric(images_array).then(function(){
        flagDownloadAdicionales = true;
        var docDescription = pdfDocDescriptionAdicionales(true, download_images_url);
        var pdfDocGenerator = pdfMake.createPdf(docDescription);
        pdfDocGenerator.open();
        $('#' + id_botonpdfAdicionales).prop('disabled', false);
      });
    }).catch(function(error){
      $('#' + id_botonpdfAdicionales).prop('disabled', false);
      alert("Error descargar las imagenes de evidencia");
    });
  }
});

$('#' + id_botonRegistrarAdicionales).click(function() {
  if (validateFormAdicionales()){
    var obra = $('#'+ id_ddl_obraAdicionales + ' option:selected').val();
    var adicional = $('#'+ id_claveAdicionales).val();
    var solicitud = $('#'+ id_ddl_solicitudAdicionales + ' option:selected').val();
    var adicional_update = {};
    var path_adicional = "procesos/" + obra + "/procesos/ADIC";
    var path_copeo = "copeo/" + obra + "/ADIC/" + adicional;
    var path_insumos = "cuantificacion/" + obra + "/ADIC/" + adicional;
    var path_propuesta = "adicionales/propuestas/" + adicional;
    var path_lista_solicitudes = "adicionales/solicitudes/listas/";
    var path_lista_propuesta = "adicionales/propuestas/listas/pendientes";
    var path_storage = rama_bd_obras+"/adicionales/solicitudes/"+$('#' + id_ddl_obraAdicionales+' option:selected').val()+"/solicitudesTerminadas/"+$('#'+id_ddl_solicitudAdicionales+' option:selected').val();
    var storageRef = firebase.storage().ref(rama_bd_obras + "/adicionales/propuestas/"+ obra +"/formatos/"+ adicional +".pdf");
    getAllFirebaseStorageGeneric(path_storage).then(function(images_array){
      //console.log(images_array);
      downloadAllImagesGeneric(images_array).then(function(){
        flagDownloadAdicionales = true;
        var docDescription = pdfDocDescriptionAdicionales(false, download_images_url);
        var pdfDocGenerator = pdfMake.createPdf(docDescription);
        pdfDocGenerator.download(adicional + '_formato.pdf');
        $('#' + id_botonRegistrarAdicionales).prop('disabled', true);

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
              alert('Error al cargar el pdf');
              $('#' + id_botonRegistrarAdicionales).prop('disabled', false);
            }, function() {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                //console.log(json_solicitud);
                adicional_update[path_adicional +"/subprocesos/" + adicional] = datosAdicionalAdicionales();
                adicional_update[path_adicional +"/num_subprocesos"] = no_adic;
                adicional_update[path_copeo] = json_modalCopeo;
                adicional_update[path_insumos] = datosInsumosAdicionales();
                adicional_update[path_propuesta] = datosPropuestaAdicionales(downloadURL);
                adicional_update[path_lista_solicitudes + "/terminadas/" + solicitud] = null;
                adicional_update[path_lista_solicitudes + "/concretadas/" + solicitud] = true;
                adicional_update[path_lista_propuesta + "/" +adicional] = true;
                console.log(adicional_update);
                /*
                firebase.database().ref(rama_bd_obras).update(adicional_update, function(error) {
                  if (error) {
                    // The write failed...
                    alert("¡Ups, hubo un error!");
                  } else {
                    // Data saved successfully!
                    // PAD
                    // pda("alta", solicitud_path, "");
                    alert("¡Registro de solicitud exitoso!");
                    $('#' + id_botonRegistrarAdicionales).prop('disabled', false);
                    // resetForm1SolicitudAdicional();
                    $('#' + id_ddl_obraAdicionales).val("");
                  }
                });
                */
              });
            });
        });
      });
    }).catch(function(error){
      $('#' + id_botonpdfAdicionales).prop('disabled', false);
      alert("Error descargar las imagenes de evidencia");
    });
  }
});

//---------------------------FUNCIONES NECESARIAS ------------------------------

function llenarFormSolicitudAdicionales(clave_sol){
  firebase.database().ref(rama_bd_obras + "/adicionales/solicitudes/" + $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/solicitudes/" + clave_sol).on('value',function(snapshot){
    var solicitud;
    if(snapshot.exists()){
      solicitud = snapshot.val();
      $('#'+ id_nombreAdicionales ).val("");
      $('#'+ id_tituloAdicionales ).val(solicitud.descripcion);
      $('#'+ id_ddl_atencionAdicionales).val("");
      $('#'+ id_anticiposAdicionales ).val(100);
      $('#'+ id_estimacionesAdicionales ).val(0);
      $('#'+ id_tiempoEntregaAdicionales ).val("");
      $('#' + id_cb_bancariosAdicionales ).prop('checked', false);
      $('#' + id_cb_fiscalesAdicionales ).prop('checked', false);
      var aux = [];
      select_requisitos.selected(aux);
      select_exclusiones.selected(aux);
      json_modalCopeo = solicitud.copeo==undefined?{}:solicitud.copeo;
      json_modalSuministros = solicitud.cuantificacion==undefined?{}:solicitud.cuantificacion;
      json_calculadoraAdicionales={};
      //console.log(json_modalCopeo, json_modalSuministros);
    }
  });
}

function llenarFormPropuestaAdicionales(clave_adic){
  firebase.database().ref(rama_bd_obras + "/adicionales/propuestas/" + $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/" + clave_adic).on('value',function(snapshot){
    var propuesta;
    if(snapshot.exists()){
      propuesta = snapshot.val();
      var select = document.getElementById(id_ddl_solicitudAdicionales);
      var option = document.createElement('option');
      option.text = option.value = propuesta.id_solicitud;
      select.appendChild(option);
      $('#'+ id_ddl_solicitudAdicionales).val(propuesta.id_solicitud);
      $('#'+ id_nombreAdicionales ).val(propuesta.nombre);
      $('#'+ id_tituloAdicionales ).val(propuesta.titulo);
      $('#'+ id_ddl_atencionAdicionales ).val(propuesta.atencion);
      $('#'+ id_anticiposAdicionales ).val(propuesta.porcentaje_anticipo);
      $('#'+ id_estimacionesAdicionales ).val(100-propuesta.porcentaje_anticipo);
      $('#'+ id_tiempoEntregaAdicionales ).val(propuesta.tiempo_entrega);
      $('#' + id_cb_bancariosAdicionales ).prop('checked', propuesta.datos_bancarios);
      $('#' + id_cb_fiscalesAdicionales ).prop('checked', propuesta.datos_fiscales);
      var aux = [];
      for (key in propuesta.requisitos){
        aux.push(key);
      }
      select_requisitos.selected(aux);
      aux = [];
      for (key in propuesta.exclusiones){
        aux.push(key);
      }
      select_exclusiones.selected(aux);
    }
  });
}

function extraerCopeoInsumosCalculadoraAdicionales(clave_adic){
  firebase.database().ref(rama_bd_obras + "/copeo/" + $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/ADIC/" + clave_adic).on('value',function(snapshot){
    if(snapshot.exists()){
      json_modalCopeo = snapshot.val();
    } else{
      json_modalCopeo = {};
    }
  });
  firebase.database().ref(rama_bd_obras + "/cuantificacion/" + $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/ADIC/" + clave_adic).on('value',function(snapshot){
    if(snapshot.exists()){
      json_modalSuministros = snapshot.val();
    } else{
      json_modalSuministros = {};
    }
  });
  firebase.database().ref(rama_bd_obras + "/calculadora/" + $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/ADIC/" + clave_adic).on('value',function(snapshot){
    if(snapshot.exists()){
      json_calculadoraAdicionales = snapshot.val();
    } else{
      json_calculadoraAdicionales = {};
    }
  });
}

function generaClaveAdicionales(id_item){
  firebase.database().ref(rama_bd_obras + "/procesos/" + $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/procesos/ADIC/num_subprocesos").on('value',function(snapshot){
    var clave;
    if(snapshot.exists()){
      no_adic = snapshot.val();
    }else{
      no_adic = 0;
    }
    no_adic += 1;
    if(no_adic<10){
      clave = "ADIC-0" + no_adic;
    }else{
      clave = "ADIC-" + no_adic;
    }
    $('#' + id_item).val(clave);
  });
}

function llenaDdlAdicionalAdicionales(id_objeto){
    $('#' + id_objeto).empty();
    var select = document.getElementById(id_objeto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    option = document.createElement('option');
    option.value = "-NUEVO-";
    option.text = "-NUEVO-";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/adicionales/propuestas/"+ $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/listas/pendientes").on('child_added',function(snapshot){
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = snapshot.key;
      select.appendChild(option);
    });
}

function llenaDdlSolicitudAdicionales(id_objeto){
    $('#' + id_objeto).empty();
    var select = document.getElementById(id_objeto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var solicitud;
    firebase.database().ref(rama_bd_obras + "/adicionales/solicitudes/"+ $('#' + id_ddl_obraAdicionales + ' option:selected').val()+"/listas/terminadas").on('child_added',function(snapshot){
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = snapshot.key;
      select.appendChild(option);
    });
}

function cargarDdlRequisitosAdicionales(){
  $('#' + id_ddl_requisitosAdicionales).empty();
  var requisito;
  var select = document.getElementById(id_ddl_requisitosAdicionales);
  firebase.database().ref(rama_bd_datos_referencia + "/requisitosAdicionales").on('value',function(snapshot){
      snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
        requisito = snapChild.val();
        option = document.createElement('option');
        option.value = snapChild.key;
        option.text = requisito;
        select.appendChild(option);
        json_requisitos[snapChild.key]=requisito;
      })
      //Llenado de la lista de puestos
      select_requisitos = new SlimSelect({
          select: '#' + id_ddl_requisitosAdicionales,
          placeholder: 'Elige los requsitos de este adicional',
      });
  });
}

function cargarDdlExclusionesAdicionales(){
  $('#' + id_ddl_exclusionesAdicionales).empty();
  var exclusion;
  var select = document.getElementById(id_ddl_exclusionesAdicionales);
  firebase.database().ref(rama_bd_datos_referencia + "/exclusionesAdicionales").on('value',function(snapshot){
      snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
        exclusion = snapChild.val();
        option = document.createElement('option');
        option.value = snapChild.key;
        option.text = exclusion;
        select.appendChild(option);
        json_exclusiones[snapChild.key]=exclusion;
      })
      //Llenado de la lista de puestos
      select_exclusiones = new SlimSelect({
          select: '#' + id_ddl_exclusionesAdicionales,
          placeholder: 'Elige las exlusiones de este adicional',
      });
  });
}

function actualizaPreciosClienteAdicionales(){
  for(key in json_modalSuministros){
    json_modalSuministros[key]["precio_cliente"] = parseFloat(json_modalSuministros[key]["precio_lista"] * (1+$('#' + id_indirectosAdicionales).val() * 0.01)).toFixed(2);
  }
}

function calculaCostoSuministros(){
  var total = {
    costos: 0,
    precio_venta: 0,
  };
  if(!jQuery.isEmptyObject(json_modalSuministros)){
    for(key in json_modalSuministros){
      total.costos = total.costos + json_modalSuministros[key]["precio_lista"] * json_modalSuministros[key]["cantidad"];
      total.precio_venta = total.precio_venta + json_modalSuministros[key]["precio_cliente"] * json_modalSuministros[key]["cantidad"];
    }
  }
  return total;
}

function calculaCostoCopeo(){
  var total = 0;
  if(!jQuery.isEmptyObject(json_modalCopeo)){
    for(key in json_modalCopeo.entradas){
      total+= json_modalCopeo["entradas"][key]["subtotal"]
    }
  }
  return total;
}

function extraeImpuesto(){
  var cargaSocial=0;
  if(!jQuery.isEmptyObject(json_modalCopeo)){
    cargaSocial = json_modalCopeo.impuestos;
  }
  return cargaSocial;
}

function resetAdicionales (){
 //$('#' + id_ddl_obraAdicionales + ' option:selected').val("");
 $('#' + id_ddl_adicionalAdicionales ).empty();
 $('#' + id_claveAdicionales ).val("");
 $('#' + id_ddl_solicitudAdicionales ).empty();
 $('#' + id_nombreAdicionales ).val("");
 $('#' + id_tituloAdicionales ).val("");
 $('#' + id_ddl_atencionAdicionales ).empty();
 $('#' + id_indirectosAdicionales).val(10);
 $('#' + id_cb_indirectosAdicionales ).prop('checked', false);
 $('#' + id_anticiposAdicionales ).val(100);
 $('#' + id_estimacionesAdicionales ).val(0);
 $('#' + id_tiempoEntregaAdicionales ).val("");
 $('#' + id_cb_bancariosAdicionales ).prop('checked', false);
 $('#' + id_cb_fiscalesAdicionales ).prop('checked', false);
 flagCuantificacionAdicionales = false;
 flagDownloadAdicionales = false;
 json_modalSuministros={};
 json_modalCopeo={};
 json_modalCalculadora={};
};

function validateFormAdicionales(){
  if($('#' + id_ddl_obraAdicionales  + " option:selected").val() == ""){
    alert("Selecciona una obra");
    return false;
  } else if ($('#' + id_ddl_adicionalAdicionales  + " option:selected").val() == "") {
    alert("Selecciona un adicional");
    return false;
  } else if ($('#' + id_ddl_solicitudAdicionales  + " option:selected").val() == "") {
    alert("Selecciona un adicional");
    return false;
  } else if ($('#' + id_nombreAdicionales).val() == "") {
    alert("Ingresa un nombre para el adicional");
    return false;
  } else if ($('#' + id_tituloAdicionales).val() == "") {
    alert("Ingresa un titulo para el adicional");
    return false;
  } else if ($('#' + id_ddl_atencionAdicionales + ' option:selected').val() == "") {
    alert("Selecciona un contacto de atención");
    return false;
  } else if ($('#' + id_indirectosAdicionales).val() == "") {
    alert("Ingresa un porcentaje de costos indirectos");
    return false;
  } else if ($('#' + id_tiempoEntregaAdicionales).val() == "") {
    alert("Especifica un tiempo de entrega");
    return false;
  } else {
    return true;
  }
}

function extraeListaGeneric(select, json_padre){
  var aux = select.selected();
  var json_resp={};
  for(var i=0; i<aux.length; i++){
    json_resp[aux[i]] = json_padre[aux[i]];
  }
  return json_resp;
}

function clienteDireccionObraGeneric(id_obra){
  firebase.database().ref(rama_bd_obras + "/obras/" + id_obra).on('value',function(snapshot){
    if(snapshot.exists()){
      var obra = snapshot.val();
      firebase.database().ref(rama_bd_clientes + "/despachos/" + obra.id_cliente + "/nombre").on('value',function(snapchild){
        if(snapchild.exists()){
          var cliente = snapchild.val();
          datos_obraAdicionales = {
            nombre: $('#'+id_ddl_obraAdicionales+' option:selected').text(),
            direccion: obra.direccion,
            cliente: cliente,
          };
        } else{
          //console.log("Error con el cliente");
          datos_obraAdicionales = {
            nombre: $('#'+id_ddl_obraAdicionales+' option:selected').text(),
            direccion: {
              calle: 'DIRECCION NO ESPECIFICADA',
              ciudad: '',
              colonia:'',
              cp:'0000',
              estado:'',
              numero:''
            },
            cliente: cliente,
          };
        }
      });
    } else{
      //console.log("Error con la obra");
      datos_obraAdicionales = {
        nombre: $('#'+id_ddl_obraAdicionales+' option:selected').text(),
        direccion: {
          calle: 'DIRECCION NO ESPECIFICADA',
          ciudad: '',
          colonia:'',
          cp:'0000',
          estado:'',
          numero:''
        },
        cliente: 'NO ESPECIFICADO',
      };
    }
  });
}

function pdfDocDescriptionAdicionales(vista_previa, images_array){
  var obra_ppto = {};
  var clave_adic=$('#'+id_claveAdicionales).val();
  var titulo_ppto=$('#'+id_tituloAdicionales).val();
  var nombre_ppto=$('#'+id_nombreAdicionales).val();;
  var atencion=$('#'+id_ddl_atencionAdicionales+' option:selected').text();
  var desplegar_indirectos=$('#'+id_cb_indirectosAdicionales).prop('checked');
  var anticipo=$('#'+id_anticiposAdicionales).val();
  var exc_lista=extraeListaGeneric(select_exclusiones, json_exclusiones);
  var reqs_lista=extraeListaGeneric(select_requisitos, json_requisitos);
  var tiempoEntrega=$('#'+id_tiempoEntregaAdicionales).val();
  var fisc_bool=$('#'+id_cb_fiscalesAdicionales).prop('checked');
  var banc_bool=$('#'+id_cb_bancariosAdicionales).prop('checked');
  var fecha_ppto=new Date();
  var insumos = Object.assign({}, json_modalSuministros);
  insumos["manoDeObra"]=manoDeObraAInsumoAdicionales();
  console.log(insumos);
  //console.log(vista_previa, obra_ppto, clave_adic, titulo_ppto, nombre_ppto, atencion, json_modalSuministros, desplegar_indirectos, anticipo, exc_lista, reqs_lista, tiempoEntrega, fisc_bool, banc_bool, fecha_ppto);
  var docDescription = generaPresupuestoAdicional(vista_previa, datos_obraAdicionales, clave_adic, titulo_ppto, nombre_ppto, atencion, insumos, desplegar_indirectos, anticipo, exc_lista, reqs_lista, tiempoEntrega, fisc_bool, banc_bool, fecha_ppto, images_array);
  return docDescription;
}

function datosAdicionalAdicionales(url){
  var adicional = {
    nombre: $('#'+id_nombreAdicionales).val(),
    alcance: $('#'+id_tituloAdicionales).val(),
    terminado: false,
    categoria: "NA",
    url_formato: url,
    precio_venta: json_modalCalculadora.precio_venta,
    costo_suministros:json_modalCalculadora.costo_suministros,
    utilidad: json_modalCalculadora.utilidad,
    precopeo: json_modalCalculadora.precopeo,
    porcentaje_anticipo: $('#'+id_anticiposAdicionales).val(),
    porcentaje_indirectos: json_modalCalculadora.indirectos,
    porcentaje_impuestos: json_modalCalculadora.porcentaje_impuestos,
    score: json_modalCalculadora.score
  };
  return adicional;
}

function datosInsumosAdicionales(){
  var insumos = {
    porcentaje_indirecto: $('#'+id_indirectosAdicionales).val(),
    desplegar_indirectos: $('#'+id_cb_indirectosAdicionales).prop('checked'),
    materiales:{},
    materiales_nr: {}
  };
  var cont = 1;
  for (key in json_modalSuministros){
    if(json_modalSuministros[key]["catalogo"] !== "NA"){
      insumos["materiales"][key] = json_modalSuministros[key];
    } else {
      insumos["materiales_nr"]["NR-"+ cont] = json_modalSuministros[key];
      cont +=1;
    }
  }
}

function datosPropuestaAdicionales(url){
  var propuesta = {
    id_solicitud: $('#' + id_ddl_solicitudAdicionales).val(),
    nombre: $('#'+id_nombreAdicionales).val(),
    titulo: $('#'+id_tituloAdicionales).val(),
    atencion: $('#'+id_ddl_atencionAdicionales).val(),
    porcentaje_anticipo: $('#'+id_anticiposAdicionales).val(),
    requisitos:extraeListaGeneric(select_requisitos, json_requisitos),
    exlusiones:extraeListaGeneric(select_exclusiones, json_exclusiones),
    tiempo_entrega: $('#'+id_tiempoEntregaAdicionales).val(),
    datos_bancarios: $('#'+id_cb_bancariosAdicionales).prop('checked'),
    datos_fiscales: $('#'+id_cb_fiscalesAdicionales).prop('checked'),
    aprobada: false,
    url_evidencia: url,
  };
}

function getAllFirebaseStorageGeneric(ruta){
  var storageRef = firebase.storage().ref(ruta);
  var images_url = [];
  var promise = new Promise(function(resolve, reject) {
    if(flagDownloadAdicionales){
      resolve(images_url);
    } else {
      // Now we get the references of these images
      storageRef.listAll().then(function(result) {
          var total = result.items.length;
          var cont = 0;
          result.items.forEach(function(imageRef) {
            imageRef.getDownloadURL().then(function(url) {
              images_url.push(url);
              cont += 1;
              if(cont == total){
                resolve(images_url);
              }
            }).catch(function(error) {
              reject(Error("Download fail"));
            });
          });
      }).catch(function(error) {
        reject(Error("Folder fail"));
      });
    }
  });
  return promise;
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function downloadImageGeneric(download_url, index){
  //console.log("Donwload image");
  var promise = new Promise(function(resolve, reject) {
    // Now we get the references of these images
    var xhr_response = new XMLHttpRequest();
    xhr_response.responseType = 'blob';
    xhr_response.onload = function(event) {
      var blob = xhr_response.response;
      blob.arrayBuffer().then(function(respuesta){
        var image_url = 'data:image/jpeg;base64,' + _arrayBufferToBase64(respuesta);
        download_images_url[index] = image_url;
        resolve(image_url);
        // resolve(images_url);
      }).catch(function(error) {
        reject(Error("Download fail"));
      });
    }
    xhr_response.open('GET', download_url);
    xhr_response.send();
  });
  return promise;
}

function downloadAllImagesGeneric(download_array){
  var total = download_array.length;
  var promise = new Promise(function(resolve, reject) {
    if(flagDownloadAdicionales){ // Ya se descargaron las imagenes y no hay cambios
      resolve();
    } else { // Descargar imagnenes de firebase storage
      download_images_url=[];
      var cont = 0;
      for (var i=0; i<download_array.length; i++){
        downloadImageGeneric(download_array[i], i).then(function (imagen){
          cont+=1;
          if(cont == total){ // Descargas completas
            resolve();
          }
        }).catch(function(error){
          reject(Error("Download fail"));
        });
      }
    }
  });
  return promise;
}

function manoDeObraAInsumoAdicionales(){
  var aux = {
    unidad: "MO",
    cantidad: 1,
    descripcion: "MANO DE OBRA",
    precio_lista: parseFloat(calculaCostoCopeo() * (1+json_modalCopeo.impuestos*0.01)).toFixed(2),
    precio_cliente: parseFloat(calculaCostoCopeo() * (1+json_modalCopeo.impuestos*0.01) * (1+$('#'+id_indirectosAdicionales).val()*0.01) ).toFixed(2),
  };
  return aux;
}
