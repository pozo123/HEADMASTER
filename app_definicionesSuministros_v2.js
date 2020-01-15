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

// Función para incializar esta página
$('#' + id_tab_definicionesSuministros).click(function() {
    // Inicialización de variables
    existeDefinicionSuministros = false;
    uid_existente="";
    // Setup inicial
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

// Funcion para limpiar el formulario
$('#' + id_boton_borrarDefinicionesSuministros).click(function(){
    resetFormDefinicionesSuministros();
});

// Funcion para agregar o editar una definición
$('#' + id_boton_agregarDefinicionesSuministros).click(function(){
    var definicion_path = getPathDefinicionesSuministros(); //obtener la rama de la base de datos
    if(validateFormDefinicionesSuministros() && definicion_path !== ""){ // Verificar los datos del formulario
      if(!existeCodigoDefinicionSuministros($('#'+id_codigoDefinicionesSuministros).val())){ //verificar que no se repita el codigo
        $('#' + id_boton_agregarDefinicionesSuministros).prop("disabled", true); //desactivar boton
        if (existeDefinicionSuministros == true){ //editar
            firebase.database().ref(rama_bd_insumos + definicion_path +"/" + uid_existente).once("value").then(function(snapshot){
                var registro_antiguo = snapshot.val();
                var definicion_update = {}; //actualizar campos
                definicion_update["nombre"] = $('#' + id_nombreDefinicionesSuministros).val();
                definicion_update["codigo"] = $('#' + id_codigoDefinicionesSuministros).val();
                firebase.database().ref(rama_bd_insumos + definicion_path +"/" + uid_existente).update(definicion_update); //escribir en la base de datos

                // pista de auditoria
                pda("modificacion", rama_bd_insumos + definicion_path +"/" + uid_existente, registro_antiguo);
                alert("¡Edición exitosa!");
                resetFormDefinicionesSuministros(); //limpiar formulario
                actualizarTablaDefinicionesSuministros(); //actualizar tabla de ese tipo
                if($("input[name=tipoDefiniciones]:checked").val() == "familia"){
                  llenaDdlGeneric(id_ddl_familiaDefincionesSuministros, categorias.child($('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val()+'/familias'), "nombre");
                }
                $('#' + id_boton_agregarDefinicionesSuministros).prop("disabled", false); //activar boton
            });
        } else { //dar de alta
          //console.log(rama_bd_insumos + definicion_path);
          //console.log(datosDefinicionesSuministros());
          firebase.database().ref(rama_bd_insumos + definicion_path).push(datosDefinicionesSuministros()).then(function(snapshot){ //agregar a la base de datos
              var regKey = snapshot.key
              // pista de auditoría
              pda("alta", rama_bd_insumos + definicion_path + "/" + regKey, "");
              alert("¡Alta exitosa!");
              resetFormDefinicionesSuministros(); //limpiar formulario
              generaCodigoDefincionesSuministros(); //generar el siguiente codigo
              actualizarTablaDefinicionesSuministros(); //actualizar tabla de ese tipo
              if($("input[name=tipoDefiniciones]:checked").val() == "familia"){ //cargar familias si están seleccionadas
                llenaDdlGeneric(id_ddl_familiaDefincionesSuministros, categorias.child($('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val()+'/familias'), "nombre");
              }
              $('#' + id_boton_agregarDefinicionesSuministros).prop("disabled", false); //activar boton
          });
        }
      }else{
        alert("Error, código repetido");
      }
    }
});

// ----------------------- VALIDACIÓN DE FORMULARIO ---------------------------
// Metodo para restringir caracteres en el campo nombre
$('#' + id_nombreDefinicionesSuministros).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú-.,",e);
});

// Metodo para eliminar espacios extra en el campo nombre
$('#' + id_nombreDefinicionesSuministros).change(function(){
    $('#' + id_nombreDefinicionesSuministros).val(deleteBlankSpaces(id_nombreDefinicionesSuministros));
});

// Metodo para restringir varacteres en el campo nombre
$('#' + id_codigoDefinicionesSuministros).keypress(function(e){
    charactersAllowed("0123456789",e);
});

// Método para esconder o mostrar ddls según el tipo de definición
$("input[name=tipoDefiniciones]").change(function (){
  //console.log($("input[name=tipoDefiniciones]:checked").val());
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

// Función para cargar la información de las familias cuando se elige categoría
$('#' + id_ddl_categoriaDefincionesSuministros).change(function(){
    llenaDdlGeneric(id_ddl_familiaDefincionesSuministros, categorias.child($('#'+id_ddl_categoriaDefincionesSuministros+' option:selected').val()+'/familias'), "nombre");
    generaCodigoDefincionesSuministros();
    actualizarTablaDefinicionesSuministros();
});

// Función activada cuando se elige una familia
$('#' + id_ddl_familiaDefincionesSuministros).change(function(){
    generaCodigoDefincionesSuministros();
    actualizarTablaDefinicionesSuministros();
});

// ----------------------- FUNCIONES NECESARIAS -------------------------------
// Función para limpiar el formulario y reiniciar variables
function resetFormDefinicionesSuministros(){
  $('#' + id_nombreDefinicionesSuministros).val("");
  // $('#' + id_codigoDefinicionesSuministros).val("");
  generaCodigoDefincionesSuministros();
  existeDefinicionSuministros = false;
  uid_existente = "";
}

//Función para validar los datos del formulario
function validateFormDefinicionesSuministros(){
   if($('#' + id_nombreDefinicionesSuministros).val() == ""){
       alert("Escribe el nombre del campo que deseas dar de alta en el sistema. Ejemplo: Siemens");
       return false;
   } else if($('#' + id_codigoDefinicionesSuministros).val().length !== 2){
       alert("El código debe tener dos dígitos numéricos");
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

// Función para verificar si el código es repetido
function existeCodigoDefinicionSuministros(codigo){
  var resp = false;
  tabla_definiciones.rows().iterator('row', function(context, index){
    var data = this.row(index).data();
    if(data[2] == codigo){ //checar hay otro código igual
      if(existeDefinicionSuministros){ //checar si se está editando
        if(uid_existente !== data[0]){ //checar si no corresponde al mismo registro que se esta editando
          resp=true;
        }
      }else{
        resp=true;
      }
    }
  });
  return resp;
}

// Función para generar el json de la definición
function datosDefinicionesSuministros(){
  var datos = {
    nombre: $('#' + id_nombreDefinicionesSuministros).val(),
    codigo: $('#' + id_codigoDefinicionesSuministros).val(),
  };
  return datos;
}

// Función para generar el path de la base de datos de acuerdo al tipo de definición
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

// Función para actualizar la tabla del tipo de definición
function actualizarTablaDefinicionesSuministros(){
   var path = getPathDefinicionesSuministros();
   //console.log(rama_bd_insumos + path);
   firebase.database().ref(rama_bd_insumos + path).once("value", function(snapshot){
       //console.log("Actualiza tabla");
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
             {title: "Editar"},
             {title: "Eliminar"},
           ],
           "order": [[2,"asc"]],
           "columnDefs": [
               {
                   "targets": -2,
                   "data": null,
                   "defaultContent": "<button type='button' class='editarDefinicionesSuministros btn btn-info'><i class='fas fa-edit'></i></button>"
               },
               {
                   "targets": -1,
                   "data": null,
                   "defaultContent": "<button type='button' class='eliminarDefinicionesSuministros btn btn-danger'><i class='fas fa-trash'></i></button>"
               },
               {
                   targets: -1,
                   className: 'dt-body-center'
               },
               { "visible": false, "targets": 0},
             ]
       });
   });
};

// Función para editar una definición al dar click en el icono de la tabla
$(document).on('click','.editarDefinicionesSuministros', function(){
  //console.log("Editar");
  var data = tabla_definiciones.row($(this).parents('tr')).data();
  resetFormDefinicionesSuministros(); //limpiar formulario
  existeDefinicionSuministros = true;
  uid_existente = data[0];
  $('#' + id_nombreDefinicionesSuministros).val(data[1]);
  $('#' + id_codigoDefinicionesSuministros).val(data[2]);
});

// Función para eliminar una definición al dar click en el icono de la tabla
$(document).on('click','.eliminarDefinicionesSuministros', function(){
  //console.log("Editar");
  var data = tabla_definiciones.row($(this).parents('tr')).data();
  var definicion_update = {}; //actualizar campos
  definicion_update[data[0]] = null;
  console.log(definicion_update);
  var path = getPathDefinicionesSuministros();
  var r = confirm("¿Seguro que quieres borrar esta rama?");
  if (r){
    if(path !== ""){
      firebase.database().ref(rama_bd_insumos + path).update(definicion_update);
      actualizarTablaDefinicionesSuministros();
    } else {
      alert("Error");
    }
  }
});

// Función para generar un código consecutivo al último
function generaCodigoDefincionesSuministros(){
  var path = getPathDefinicionesSuministros(); // obtener el path de la bd
  firebase.database().ref(rama_bd_insumos + path).orderByChild("codigo").limitToLast(1).once("value", function(snapshot){
    //console.log(rama_bd_insumos + path);
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

// Función para actualizar la tabla global de categorías, familias y subfamilias
function actualizarTablaArbolDefinicionesSuministros(){
   firebase.database().ref(rama_bd_insumos + "/categorias").on("value", function(snapshot){
       //console.log("Actualiza tabla");
       var datos = [];
       var cont = 0; // sirve para conservar el orden deseado de los renglones
       if(snapshot.exists()){
         var categorias = snapshot.val();
         var codigo1, codigo2;
         for(key1 in categorias){ //categorías
           codigo1 = categorias[key1]["codigo"];
           datos.push([
             cont,
             categorias[key1]["nombre"],
             "",
             "",
             codigo1,
           ]);
           cont += 1;
           for(key2 in categorias[key1]["familias"]){ //familias
             codigo2=categorias[key1]["familias"][key2]["codigo"];
             datos.push([
               cont,
               "",
               categorias[key1]["familias"][key2]["nombre"],
               "",
               codigo1+codigo2,
             ]);
             cont += 1;
             for (key3 in categorias[key1]["familias"][key2]["subfamilias"]){ //subfamilias
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
           dom: 'Bfrtip',
           buttons: [
               {extend: 'excelHtml5',
               title: "DefinicionesCatalogo",
               exportOptions: {
                   columns: [1,2,3,4]
               }}
           ],
           columns:[
             {title: "indice"},
             {title: "Categoría"},
             {title: "Familia"},
             {title: "Subfamilia"},
             {title: "Código"}
           ],
           "paging":false, //desplegar tabla completa
           "ordering":false, //no reordenar
           "order": [[0,"asc"]],
           "columnDefs": [
               { "visible": false, "targets": 0},
             ]
       });
   });
};
