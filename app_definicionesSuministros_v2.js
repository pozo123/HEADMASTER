var id_tab_definicionesSuministros = "tabDefinicionesSuministros";
var id_form_definicionesSuministros = "formDefinicionesSuministros";
var id_dataTable_definicionesSuministros = "dataTableDefinicionesSuministros";
var id_dataTable_arbolDefinicionesSuministros = "dataTableArbolDefinicionesSuministros";

var id_rb_categoriaDefinicionesSuministros = "rb_categoriaDefinicionesSuministros";
var id_rb_familiaDefinicionesSuministros = "rb_familiaDefinicionesSuministros";
var id_rb_subfamiliaDefinicionesSuministros = "rb_subfamiliaDefinicionesSuministros";
var id_rb_marcaDefinicionesSuministros = "rb_marcaDefinicionesSuministros";
var id_rb_unidadDefinicionesSuministros = "rb_unidadDefinicionesSuministros";
var id_ddl_categoriaDefincionesSuministros = "ddl_categoriaDefincionesSuministros";
var id_ddl_familiaDefincionesSuministros = "ddl_familiaDefincionesSuministros";
var id_div_ddl_categoriaDefincionesSuministros = "div_ddl_categoriaDefincionesSuministros"
var id_div_ddl_familiaDefincionesSuministros = "div_ddl_familiaDefincionesSuministros"
var id_nombreDefinicionesSuministros = "nombreDefinicionesSuministros";
var id_codigoDefinicionesSuministros = "codigoDefinicionesSuministros";
var id_boton_agregarDefinicionesSuministros = "boton_agregarDefinicionesSuministros";
var id_boton_borrarDefinicionesSuministros = "boton_borrarDefinicionesSuministros";

var tabla_definiciones;
var existeDefinicionSuministros;
var uid_existente;

$('#' + id_tab_definicionesSuministros).click(function() {
    existeDefinicionSuministros = false;
    uid_existente="";
    $('#' + id_div_ddl_categoriaDefincionesSuministros).addClass('hidden');
    $('#' + id_div_ddl_familiaDefincionesSuministros).addClass('hidden');

    firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
      var index = $('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val();
      categorias = snapshot;
      llenaDdlGeneric(id_ddl_categoriaDefincionesSuministros, categorias, "nombre");
      $('#'+id_ddl_categoriaDefincionesSuministros).val(index);
    });
    $("input[name=tipoDefiniciones]").filter("[value=categoria]").prop('checked', true);
    resetFormDefinicionesSuministros();
    generaCodigoDefincionesSuministros();
    actualizarTablaDefinicionesSuministros();
    actualizarTablaArbolDefinicionesSuministros();
});

$('#' + id_boton_borrarDefinicionesSuministros).click(function(){
    resetFormDefinicionesSuministros();
});

$('#' + id_boton_agregarDefinicionesSuministros).click(function(){
    if(validateFormDefinicionesSuministros()){
      var definicion_path = getPathDefinicionesSuministros();
      if (existeDefinicionSuministros == true){
          firebase.database().ref(rama_bd_insumos + definicion_path +"/" + uid_existente).once("value").then(function(snapshot){
              var registro_antiguo = snapshot.val();
              var definicion_update = {};
              definicion_update["nombre"] = $('#' + id_nombreDefinicionesSuministros).val();
              firebase.database().ref(rama_bd_insumos + definicion_path +"/" + uid_existente).update(definicion_update);

              // pda
              pda("modificacion", rama_bd_insumos + definicion_path +"/" + uid_existente, registro_antiguo);
              alert("¡Edición exitosa!");
              resetFormDefinicionesSuministros();
              actualizarTablaDefinicionesSuministros();
              if($("input[name=tipoDefiniciones]:checked").val() == "familia"){
                llenaDdlGeneric(id_ddl_familiaDefincionesSuministros, categorias.child($('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val()+'/familias'), "nombre");
              }
          });
      } else {
        console.log(rama_bd_insumos + definicion_path);
        console.log(datosDefinicionesSuministros());
        firebase.database().ref(rama_bd_insumos + definicion_path).push(datosDefinicionesSuministros()).then(function(snapshot){
            var regKey = snapshot.key
            // pista de auditoría
            pda("alta", rama_bd_insumos + definicion_path + "/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormDefinicionesSuministros();
            generaCodigoDefincionesSuministros();
            actualizarTablaDefinicionesSuministros();
            if($("input[name=tipoDefiniciones]:checked").val() == "familia"){
              llenaDdlGeneric(id_ddl_familiaDefincionesSuministros, categorias.child($('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val()+'/familias'), "nombre");
            }
        });
      };
    }
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_nombreDefinicionesSuministros).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú-",e);
});

$('#' + id_nombreDefinicionesSuministros).change(function(){
    $('#' + id_nombreDefinicionesSuministros).val(deleteBlankSpaces(id_nombreDefinicionesSuministros));
});

$("input[name=tipoDefiniciones]").change(function (){
  console.log($("input[name=tipoDefiniciones]:checked").val());
  if($("input[name=tipoDefiniciones]:checked").val() == "familia"){
    $('#' + id_div_ddl_categoriaDefincionesSuministros).removeClass('hidden');
    $('#' + id_div_ddl_familiaDefincionesSuministros).addClass('hidden');
  } else if($("input[name=tipoDefiniciones]:checked").val() == "subfamilia"){
    $('#' + id_div_ddl_categoriaDefincionesSuministros).removeClass('hidden');
    $('#' + id_div_ddl_familiaDefincionesSuministros).removeClass('hidden');
  } else {
    $('#' + id_div_ddl_categoriaDefincionesSuministros).addClass('hidden');
    $('#' + id_div_ddl_familiaDefincionesSuministros).addClass('hidden');
  }
  actualizarTablaDefinicionesSuministros();
  generaCodigoDefincionesSuministros();
});

$('#' + id_ddl_categoriaDefincionesSuministros).change(function(){
    llenaDdlGeneric(id_ddl_familiaDefincionesSuministros, categorias.child($('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val()+'/familias'), "nombre");
    generaCodigoDefincionesSuministros();
    actualizarTablaDefinicionesSuministros();
});

$('#' + id_ddl_familiaDefincionesSuministros).change(function(){
    generaCodigoDefincionesSuministros();
    actualizarTablaDefinicionesSuministros();
});

// ----------------------- FUNCIONES NECESARIAS -------------------------------
function resetFormDefinicionesSuministros(){
  $('#' + id_nombreDefinicionesSuministros).val("");
  // $('#' + id_codigoDefinicionesSuministros).val("");
  generaCodigoDefincionesSuministros();
  existeDefinicionSuministros = false;
  uid_existente = "";
}

function validateFormDefinicionesSuministros(){
   if($('#' + id_nombreDefinicionesSuministros).val() == ""){
       alert("Escribe el nombre del campo que deseas dar de alta en el sistema. Ejemplo: Siemens");
       return false;
   } else if($('#'+ id_rb_familiaDefinicionesSuministros).prop('checked')){
     // console.log("Familia check");
     if($('#' + id_ddl_categoriaDefincionesSuministros+' option:selected').val() == ""){
       alert("Selecciona una categoría");
       return false;
     }else{
       return true;
     }
   } else if($('#'+ id_rb_subfamiliaDefinicionesSuministros).prop('checked')){
     // console.log("Subfamilia check");
     if($('#' + id_ddl_categoriaDefincionesSuministros +' option:selected').val() == ""){
       alert("Selecciona una categoría");
       return false;
     }else if ($('#' + id_ddl_familiaDefincionesSuministros + ' option:selected').val() == ""){
       alert("Selecciona una familia");
       return false;
     } else {
       return true;
     }
   } else {
       return true;
   };
};

function datosDefinicionesSuministros(){
  var datos = {
    nombre: $('#' + id_nombreDefinicionesSuministros).val(),
    codigo: $('#' + id_codigoDefinicionesSuministros).val(),
  };
  return datos;
}

function getPathDefinicionesSuministros(){
  var definicion_path="";
  switch($("input[name=tipoDefiniciones]:checked").val()){
    case "categoria":
      definicion_path = "/categorias";
      break;
    case "familia":
      definicion_path = "/categorias/" + $('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val() + "/familias";
      break;
    case "subfamilia":
      definicion_path = "/categorias/" + $('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val() + "/familias/" + $('#'+id_ddl_familiaDefincionesSuministros+' option:selected').val() + "/subfamilias";
      break;
    case "marca":
      definicion_path = "/marcas";
      break;
    case "unidad":
    definicion_path = "/unidades";
      break;
    default:
      alert("Algo salió mal");
      return
      break;
  }
  return definicion_path;
}

function actualizarTablaDefinicionesSuministros(){
   var path = getPathDefinicionesSuministros();
   console.log(rama_bd_insumos + path);
   firebase.database().ref(rama_bd_insumos + path).once("value", function(snapshot){
       console.log("Actualiza tabla");
       var datos = [];
       snapshot.forEach(function(childSnap){
           var definicion = childSnap.val();
           var definicion_id = childSnap.key;
           var definicion_nombre = definicion.nombre;
           var definicion_codigo = definicion.codigo;
           datos.push([
               definicion_id,
               definicion_nombre,
               definicion_codigo
           ]);
           console.log(datos);
       });
       tabla_definiciones = $('#'+ id_dataTable_definicionesSuministros).DataTable({
           destroy: true,
           data: datos,
           language: idioma_espanol,
           columns:[
             {title: "id_definicion"},
             {title: "Nombre"},
             {title: "Codigo"},
             {title: "Editar"}
           ],
           "order": [[2,"asc"]],
           "columnDefs": [
               {
                   "targets": -1,
                   "data": null,
                   "defaultContent": "<button type='button' class='editarDefinicionesSuministros btn btn-info'><i class='fas fa-edit'></i></button>"
               },
               {
                   targets: -1,
                   className: 'dt-body-center'
               },
               { "visible": false, "targets": 0},
             ]
       });
       /*
       $('#' + id_dataTable_definicionesSuministros + ' tbody').on( 'click', '.editarDefinicionesSuministros', function () {
           var data = tabla_definiciones.row( $(this).parents('tr') ).data();
           resetFormDefinicionesSuministros();
           existeDefinicionSuministros = true;
           uid_existente = data[0];
           $('#' + id_nombreDefinicionesSuministros).val(data[1]);
           $('#' + id_codigoDefinicionesSuministros).val(data[2]);;
       });
       */
   });
};

$(document).on('click','.editarDefinicionesSuministros', function(){
  //console.log("Editar");
  var data = tabla_definiciones.row( $(this).parents('tr') ).data();
  resetFormDefinicionesSuministros();
  existeDefinicionSuministros = true;
  uid_existente = data[0];
  $('#' + id_nombreDefinicionesSuministros).val(data[1]);
  $('#' + id_codigoDefinicionesSuministros).val(data[2]);;
});

function generaCodigoDefincionesSuministros(){
  var path = getPathDefinicionesSuministros();
  firebase.database().ref(rama_bd_insumos + path).limitToLast(1).once("value", function(snapshot){
    console.log(rama_bd_insumos + path);
    var codigo;
    if(snapshot.exists()){
      for(key in snapshot.val()){
        codigo = parseFloat(snapshot.val()[key].codigo)+1;
        codigo = codigo<10?"0"+codigo:codigo;
      }
    } else {
      codigo = "01";
    }
    $('#'+id_codigoDefinicionesSuministros).val(codigo);
  });
}

function actualizarTablaArbolDefinicionesSuministros(){
   firebase.database().ref(rama_bd_insumos + "/categorias").on("value", function(snapshot){
       console.log("Actualiza tabla");
       var datos = [];
       var cont = 0;
       if(snapshot.exists()){
         var categorias = snapshot.val();
         var codigo1, codigo2;
         for(key1 in categorias){
           codigo1 = categorias[key1]["codigo"];
           datos.push([
             cont,
             categorias[key1]["nombre"],
             "",
             "",
             codigo1,
           ]);
           cont += 1;
           for(key2 in categorias[key1]["familias"]){
             codigo2=categorias[key1]["familias"][key2]["codigo"];
             datos.push([
               cont,
               "",
               categorias[key1]["familias"][key2]["nombre"],
               "",
               codigo1+codigo2,
             ]);
             cont += 1;
             for (key3 in categorias[key1]["familias"][key2]["subfamilias"]){
               datos.push([
                 cont,
                 "",
                 "",
                 categorias[key1]["familias"][key2]["subfamilias"][key3]["nombre"],
                 codigo1+codigo2+categorias[key1]["familias"][key2]["subfamilias"][key3]["codigo"],
               ]);
               cont += 1;
             }
           }
         }
       }
       tabla_arbol_definiciones = $('#'+ id_dataTable_arbolDefinicionesSuministros).DataTable({
           destroy: true,
           data: datos,
           language: idioma_espanol,
           columns:[
             {title: "indice"},
             {title: "Categoría"},
             {title: "Familia"},
             {title: "Subfamilia"},
             {title: "Código"}
           ],
           "paging":false,
           "order": [[0,"asc"]],
           "columnDefs": [
               { "visible": false, "targets": 0},
             ]
       });
   });
};
