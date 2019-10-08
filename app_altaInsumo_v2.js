// id's de los elementos HTML
var id_tab_insumo = "tabAltaInsumos";
var id_form_insumo = "formInsumos";
var id_dataTable_insumo = "dataTableInsumos";

//Definición de variables del formulario
var id_catalogoInsumos = "catalogoInsumos";
var id_descripcionInsumos = "descripcionInsumos";
var id_catfabricInsumos = "catfabricInsumos";
var id_ddl_marcaInsumos = "ddl_marcaInsumos";
var id_ddl_unidadInsumos = "ddl_unidadInsumos";
var id_ddl_clasificacionInsumos = "ddl_clasificacionInsumos";
var id_ddl_categoriaInsumos = "ddl_categoriaInsumos";
var id_ddl_proveedorInsumos = "ddl_proveedorInsumos";
var id_precioInsumos = "precioInsumos";
var id_fechaCotizacionInsumos = "fechaCotizacionInsumos";
var id_botonAgregarProveedorInsumos = "botonAgregarProveedorInsumos";
var id_dataTableProveedoresInsumos = "dataTableProveedoresInsumos";

var id_boton_AgregarInsumos = "botonAgregarInsumos";
var id_boton_BorrarInsumos = "botonBorrarInsumos";

//Variables globales para controlar edición
var existe_insumo = false;
var uid_insumo = "";

jQuery.datetimepicker.setLocale('es');

//Dar formato a los elementos existentes
$('#' + id_tab_insumo).click(function() {
    resetFormInsumo();
    // Con las líneas siguiente se genera el cuadro para las fechas en el HTML
    jQuery('#' + id_fechaCotizacionInsumos).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    llenaDdlMarca();
    llenaDdlUnidad();
    llenaDdlCategoria();
    llenaDdlProveedor();
    llenaDdlClasificacion();

    actualizarTablaInsumos();

});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_boton_AgregarInsumos).click(function() {
  //Validar datos ingresados
  if (validateFormObra()){
    var datos_obra = datosAltaObra();
    //console.log(datos_obra);
    //Decidir si editar o dar de alta
    if (existe_obra){ //editar
        firebase.database().ref(rama_bd_obras + "/obras/" + uid_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            var obra_update = {};
            //Actualizar los campos de la obra
            obra_update["obras/" + uid_existente + "/clave_obra"] = datos_obra.clave_obra;
            obra_update["obras/" + uid_existente + "/nombre"] = datos_obra.nombre;
            obra_update["obras/" + uid_existente + "/id_cliente"] = datos_obra.id_cliente;
            obra_update["obras/" + uid_existente + "/direccion"] = datos_obra.direccion;
            obra_update["obras/" + uid_existente + "/retencion_fondo_garantia"] =datos_obra.retencion_fondo_garantia;
            if(datos_obra.terminada){
              obra_update["listas/obras_terminadas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            } else {
              obra_update["listas/obras_no_terminadas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            };
            if(!datos_obra.habilitada){
              obra_update["listas/obras_no_activas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            } else {
              obra_update["listas/obras_activas/" + uid_existente + "/nombre"] =datos_obra.nombre;
            }

            //Actualizar fechas en obra y MISC
            if (registro_antiguo.fechas.fecha_inicio_teorica !== datos_obra.fechas.fecha_inicio_teorica){
              obra_update["obras/" + uid_existente + "/fechas/fecha_inicio_teorica"] = datos_obra.fechas.fecha_inicio_teorica;
              obra_update["procesos/" + uid_existente + "/procesos/MISC/subprocesos/MISC/fechas/fecha_inicio_teorica"] = datos_obra.fechas.fecha_inicio_teorica;
              obra_update["listas/fechas_obra_inicio/programada/" + datos_obra.fechas.fecha_inicio_teorica + "/" + uid_existente] = true;
              obra_update["listas/fechas_obra_inicio/programada/" + registro_antiguo.fechas.fecha_inicio_teorica + "/" + uid_existente] = null;
            }
            if (registro_antiguo.fechas.fecha_final_teorica !== datos_obra.fechas.fecha_final_teorica){
              obra_update["obras/" + uid_existente + "/fechas/fecha_final_teorica"] = datos_obra.fechas.fecha_final_teorica;
              obra_update["procesos/" + uid_existente + "/procesos/MISC/subprocesos/MISC/fechas/fecha_final_teorica"] = datos_obra.fechas.fecha_final_teorica;
              obra_update["listas/fechas_obra_fin/programada/" + datos_obra.fechas.fecha_final_teorica + "/" + uid_existente] = true;
              obra_update["listas/fechas_obra_fin/programada/" + registro_antiguo.fechas.fecha_final_teorica + "/" + uid_existente] = null;
            }
            //firebase.database().ref(rama_bd_obras).update(obra_update);

            // PAD
            //pda("modificacion", rama_bd_obras + "/obras/" + uid_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormObra();
        });
    } else { //dar de alta
        firebase.database().ref(rama_bd_obras + "/obras").push(datos_obra).then(function(snapshot){
            var regKey = snapshot.key;
            var obra_paths = {};
            var fechas = fechasAltaObra();
            //Dar de alta los 3 procesos default
            obra_paths["procesos/" + regKey + "/procesos/PC00"]=datosPC00();
            obra_paths["procesos/" + regKey + "/procesos/MISC"]=datosMISC(fechas);
            obra_paths["procesos/" + regKey + "/procesos/ADIC"]=datosADIC();
            obra_paths["procesos/" + regKey + "/num_procesos"]=0;

            // Actualizar listas
            var fechas = fechasProgramadasObra();
            obra_paths["listas/obras_no_terminadas/" + regKey + "/nombre"] = datos_obra.nombre;
            obra_paths["listas/obras_activas/" + regKey + "/nombre"] = datos_obra.nombre;
            obra_paths["listas/fechas_obra_inicio/programada/" + fechas.inicio + "/" + regKey] = true;
            obra_paths["listas/fechas_obra_fin/programada/" + fechas.final + "/" + regKey] = true;
            //console.log(obra_paths);
            //firebase.database().ref(rama_bd_obras).update(obra_paths);

            // PAD
            //pda("alta", rama_bd_obras + "/obras/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormObra();
        });
    };
  };
});
//Funcionalidad del boton 'Borrar todo'
$('#' + id_boton_BorrarInsumos).click(function() {
  resetFormInsumo();
  existe_insumo=false;
});

$('#' + id_botonAgregarProveedorInsumos).click(function() {

});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_catalogoInsumos).keypress(function(e){
    charactersAllowed(" 0123456789",e)
});

$('#' + id_descripcionInsumos).change(function(){
    $('#' + id_descripcionInsumos).val($('#' + id_descripcionInsumos).val().toUpperCase());
});

$('#' + id_descripcionInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-_0123456789áéíóú/",e)
});

$('#' + id_catfabricInsumos).change(function(){
    $('#' + id_catfabricInsumos).val($('#' + id_catfabricInsumos).val().toUpperCase());
});

$('#' + id_catfabricInsumos).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ-/0123456789",e)
});

$('#' + id_precioInsumos).keypress(function(e){
    charactersAllowed("0123456789.",e);
});

$('#' + id_precioInsumos).focus(function(){
  $('#' + id_precioInsumos).val(deformatMoney($('#' + id_precioInsumos).val()));
});

$('#' + id_precioInsumos).focusout(function(){
  $('#' + id_precioInsumos).val(formatMoney($('#' + id_precioInsumos).val()));
});


// ----------------------- FUNCIONES NECESARIAS ----------------------------
//Borrar la información de todos los campos
function resetFormInsumo(){
  $('#' + id_catalogoInsumos).val("");
  $('#' + id_descripcionInsumos).val("");
  $('#' + id_catfabricInsumos).val("");
  $('#' + id_ddl_marcaInsumos).val("");
  $('#' + id_ddl_unidadInsumos).val("");
  $('#' + id_ddl_clasificacionInsumos).val("");
  $('#' + id_ddl_categoriaInsumos).val("");
  $('#' + id_ddl_proveedorInsumos).val("");
  $('#' + id_precioInsumos).val("");
  $('#' + id_fechaCotizacionInsumos).val("")
  existe_insumo=false;
}

//Validar que no esté vacío nungún campo
function validateFormInsumo(){
    if ($('#' + id_catalogoInsumos).val() == ""){
        alert("Escribe el número de catálogo");
        highLightColor(id_catalogoInsumos,"#FF0000");
        return false;
    } else if($('#' + id_descripcionInsumos).val() == ""){
        alert("Escribe la descripcion del producto");
        highLightColor(id_descripcionInsumos,"#FF0000");
        return false;
    } else if($('#' + id_catfabricInsumos).val() == ""){
        alert("Escribe el catfabric del producto");
        highLightColor(id_catfabricInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_marcaInsumos + 'option:selected').val() == ""){
        alert("Selecciona una marca para el producto.");
        highLightColor(id_ddl_marcaInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_unidadInsumos + 'option:selected').val() == ""){
        alert("Selecciona una unidad para el producto.");
        highLightColor(id_ddl_unidadInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_clasificacionInsumos + 'option:selected').val() == ""){
        alert("Selecciona una clasificacion para el producto.");
        highLightColor(id_ddl_clasificacionInsumos,"#FF0000");
        return false;
    } else if($('#' + id_ddl_categoriaInsumos + 'option:selected').val() == ""){
        alert("Selecciona una categoría para el producto.");
        highLightColor(id_ddl_categoriaInsumos,"#FF0000");
        return false;
    } else {
        return true;
    }
}

function validateProveedorInsumo(){
  if ($('#' + id_ddl_proveedorInsumos + 'option:selected').val() == ""){
    alert("Selecciona un proveedor.");
    highLightColor(id_ddl_proveedorInsumos,"#FF0000");
    return false;
  } else if($('#' + id_precioInsumos).val() == ""){
      alert("Escribe el precio del proveedor para este producto");
      highLightColor(id_precioInsumos,"#FF0000");
      return false;
  } else if($('#' + id_fechaCotizacionInsumos).val() == ""){
      alert("Escribe una fecha de vigencia para el precio");
      highLightColor(id_fechaCotizacionInsumos,"#FF0000");
      return false;
  } else {
      return true;
  }
}

//Construir el JSON de direccion para la obra
function direccionAltaObra(){
  var direccion = {};
  direccion = {
      estado: $('#' + id_estado_obra).val(),
      ciudad: $('#' + id_ciudad_obra).val(),
      colonia: $('#' + id_colonia_obra).val(),
      cp: $('#' + id_codigo_postal_obra).val(),
      calle: $('#' + id_calle_obra).val(),
      numero: $('#' + id_numero_obra).val()
  }
  return direccion;
};
//Construir el JSON de fechas para la obra
function fechasAltaObra(){
  var fechas = {};
  var f_inicio = $('#' + id_fecha_inicio_obra).val().split('.');
  var f_final = $('#' + id_fecha_final_obra).val().split('.');
  fechas = {
      fecha_inicio_teorica: new Date(f_inicio[0], f_inicio[1] - 1, f_inicio[2]).getTime(),
      fecha_final_teorica: new Date(f_final[0], f_final[1] - 1, f_final[2]).getTime()
  }
  return fechas;
}
//Construir el JSON de la obra
function datosAltaObra(){
  var obra = {};
  obra = {
    clave_obra : $('#' + id_clave_obra).val(),
    nombre: $('#' + id_nombre_obra).val(),
    id_cliente: $('#' + id_ddl_cliente_obra + ' option:selected').val(),
    habilitada: true,
    direccion: direccionAltaObra(),
    retencion_fondo_garantia: parseFloat($('#' + id_garantia_obra).val()),
    fechas: fechasAltaObra()
  }
  return obra;
}
//Construir el JSON del proceso PC00
function datosPC00(){
  var pc00 = {};
  pc00 = {
    nombre: "PREPROYECTO",
    alcance:"Trabajo previo a firmar contrato",
    num_subprocesos: 0,
    subprocesos:{
      PC00:{
        nombre: "PREPROYECTO",
        alcance: "Trabajo previo a firmar contrato"
      }
    }
  }
  return pc00;
}
//Construir el JSON del proceso MISC
function datosMISC(fechas){
  var misc = {};
  misc = {
    nombre: "MISCELANEOS",
    alcance:"Miscelaneos",
    num_subprocesos: 0,
    subprocesos:{
      MISC:{
        nombre: "MISCELANEOS",
        alcance: "",
        fechas: fechas,
      }
    }
  }
  return misc
}
//Construir el JSON del proceso ADIC
function datosADIC(){
  var adic = {};
  adic = {
    nombre: "ADICIONALES",
    alcance:"Adicionales",
    num_subprocesos: 0
  }
  return adic;
}
//Llenar los campos en caso de existir la clave de la obra
function llenaCamposObra(clave){
  firebase.database().ref(rama_bd_obras + "/obras").orderByChild('clave_obra').equalTo(clave).limitToFirst(1).once("value").then(function(snapshot){
      snapshot.forEach(function(child_snap){
          var value = child_snap.val();
          if (value){
              existe_obra = true;
              uid_existente = child_snap.key;
              var direccion = value.direccion;
              var fechas = value.fechas;
              var fecha;
              $('#' + id_nombre_obra).val(value.nombre);
              $('#' + id_ddl_cliente_obra).val(value.id_cliente);
              $('#' + id_garantia_obra).val(value.retencion_fondo_garantia);
              $('#' + id_estado_obra).val(direccion.estado);
              $('#' + id_ciudad_obra).val(direccion.ciudad);
              $('#' + id_colonia_obra).val(direccion.colonia);
              $('#' + id_calle_obra).val(direccion.calle);
              $('#' + id_codigo_postal_obra).val(direccion.cp);
              $('#' + id_numero_obra).val(direccion.numero);
              fecha = new Date(fechas.fecha_inicio_teorica);
              $('#' + id_fecha_inicio_obra).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
              fecha = new Date(fechas.fecha_final_teorica);
              $('#' + id_fecha_final_obra).val(fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2));
              highLightAllObra();
          } else {
              existe_obra = false;
          }
      });
  });
}

//Dar formato AAAAMMDD a las fechas
function fechasProgramadasObra(){
  var f_inicio = $('#' + id_fecha_inicio_obra).val().split('.');
  var f_final = $('#' + id_fecha_final_obra).val().split('.');
  var lista_obra_inicio = f_inicio[0] + ("0" + f_inicio[1]).slice(-2) + ("0" + f_inicio[2]).slice(-2);
  var lista_obra_final = f_final[0] + ("0" + f_final[1]).slice(-2) + ("0" + f_final[2]).slice(-2);
  var fechas = {
    inicio: lista_obra_inicio,
    final: lista_obra_final
  }
  return fechas;
}

// función que actualiza la tabla (revisar librería DataTable para ver funcionalidad)
// se utiliza on "value" para que en cada movimiento en la base de datos "colaboradores", la tabla se actualize
// automáticamente.
function actualizarTablaInsumos(){
    firebase.database().ref(rama_bd_obras + "/obras").on("value",function(snapshot){
        var datos_obras = [];
        snapshot.forEach(function(obraSnap){
            var uid = obraSnap.key;
            var obra = obraSnap.val();
            var clave = obra.clave_obra;
            var nombre = obra.nombre;
            var habilitada = obra.habilitada;
            var fondo_garantia = obra.retencion_fondo_garantia;
            var direccion_json = obra.direccion;
            var fechas = obra.fechas;
            var id_cliente = obra.id_cliente;
            var terminada = obra.terminada;
            var cliente;
            firebase.database().ref(rama_bd_clientes + "/despachos/" + id_cliente + "/nombre").on("value", function(snapcliente){
              cliente = snapcliente.val();
            });

            var direccion = direccion_json.calle + "/" + direccion_json.numero + "/" +
                            direccion_json.colonia + "/" + direccion_json.ciudad + "/" +
                            direccion_json.estado + "/" + direccion_json.cp;
            var direccion_text = direccion_json.calle + " " + direccion_json.numero + ", " +
                              direccion_json.colonia + ". " + direccion_json.ciudad + ", " +
                              direccion_json.estado + ". CP: " + direccion_json.cp;

            var fecha = new Date(fechas.fecha_inicio_teorica);
            var fecha_inicio = fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2);
            fecha = new Date(fechas.fecha_final_teorica);
            var fecha_final = fecha.getFullYear() +"."+ ("0" + (fecha.getMonth() + 1)).slice(-2) +"."+ ("0" + fecha.getDate()).slice(-2);

            var icon_class = "";
            if(habilitada) {
                icon_class = "'icono_verde fas fa-check-circle'";
            } else {
                icon_class = "'icono_rojo fas fa-times-circle'"
            }
            if (terminada){
              terminada = "Sí";
            } else {
              terminada = "No";
            }

            datos_obras.push([
                uid,
                id_cliente,
                clave,
                nombre,
                cliente,
                direccion,
                direccion_text,
                fondo_garantia,
                fecha_inicio,
                fecha_final,
                terminada,
                "<button type='button' class='btn btn-transparente' onclick='habilitarObra(" + habilitada + "," + "\`"  + uid  + "\`" + ")'><i class=" + icon_class + "></i></button>",
            ]);
        });

        tabla_obra = $('#'+ id_dataTable_obra).DataTable({
            destroy: true,
            data: datos_obras,
            language: idioma_espanol,
            "autoWidth": false,
            "columnDefs": [
                { "width": "150px", "targets": 3 },
                { "width": "100px", "targets": 6 },
                {
                    targets: -2,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0 }, //campos auxiliares
                { "visible": false, "targets": 1 },
                { "visible": false, "targets": 5 },
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                },
                { targets: [2,7,8,9,10], className: 'dt-body-center'},
              ]
        });
        //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
        $('#' + id_dataTable_obra + ' tbody').on( 'click', '.editar', function () {
            highLightAllObra();
            var data = tabla_obra.row( $(this).parents('tr') ).data();
            var direccion = data[5].split("/");
            resetFormObra();
            existe_obra = true;
            uid_existente = data[0];
            $('#' + id_clave_obra).val(data[2]);
            $('#' + id_nombre_obra).val(data[3]);
            $('#' + id_ddl_cliente_obra).val(data[1]);
            $('#' + id_garantia_obra).val(data[7]);
            $('#' + id_estado_obra).val(direccion[4]);
            $('#' + id_ciudad_obra).val(direccion[3]);
            $('#' + id_colonia_obra).val(direccion[2]);
            $('#' + id_calle_obra).val(direccion[0]);
            $('#' + id_codigo_postal_obra).val(direccion[5]);
            $('#' + id_numero_obra).val(direccion[1]);
            $('#' + id_fecha_inicio_obra).val(data[8]);
            $('#' + id_fecha_final_obra).val(data[9]);
        } );
    });
}

function llenaDdlMarca(){
  // Llenado del ddl de marca
  $('#' + id_ddl_marcaInsumos).empty();
  var select = document.getElementById(id_ddl_marcaInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var marca;
  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('child_added',function(snapshot){
      marca = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = marca.nombre;
      select.appendChild(option);
  });
}

function llenaDdlUnidad(){
  // Llenado del ddl de unidad
  $('#' + id_ddl_unidadInsumos).empty();
  var select = document.getElementById(id_ddl_unidadInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var unidad;
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('child_added',function(snapshot){
      unidad = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = unidad.nombre;
      select.appendChild(option);
  });
}

function llenaDdlCategoria(){
  // Llenado del ddl de categoria
  $('#' + id_ddl_categoriaInsumos).empty();
  var select = document.getElementById(id_ddl_categoriaInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var categoria;
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('child_added',function(snapshot){
      categoria = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = categoria.nombre;
      select.appendChild(option);
  });
}

function llenaDdlClasificacion(){
  // Llenado del ddl de proveedor
  $('#' + id_ddl_clasificacionInsumos).empty();
  var select = document.getElementById(id_ddl_clasificacionInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var clasificacion;
  firebase.database().ref(rama_bd_insumos + "/clasificaciones").orderByChild('nombre').on('child_added',function(snapshot){
      clasificacion = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = clasificacion.nombre;
      select.appendChild(option);
  });
}

function llenaDdlProveedor(){
  // Llenado del ddl de proveedor
  $('#' + id_ddl_proveedorInsumos).empty();
  var select = document.getElementById(id_ddl_proveedorInsumos);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var proveedor;
  firebase.database().ref(rama_bd_insumos + "/proveedores").orderByChild('razon_social').on('child_added',function(snapshot){
      proveedor = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = proveedor.razon_social;
      select.appendChild(option);
  });
}
