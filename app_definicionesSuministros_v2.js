// id's de los elementos HTML
var id_tab_definicionesSuministros = "tabDefinicionesSuministros";

//=============================================================================
//-------------------------------- MARCAS -------------------------------------
//=============================================================================

var id_form_marcasSuministros = "formMarcasSuministros";
var id_dataTable_marcasSuministros = "dataTableMarcasSuministros";

var id_boton_borrarMarcaSuministros = "boton_borrarMarcaSuministros";
var id_boton_agregarMarcaSuministros = "boton_agregarMarcaSuministros";

var id_nombreMarcaSuministros = "nombreMarcaSuministros";

// Variables globales

var existe_marca= false;
var id_marca_existente = "";

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_boton_borrarMarcaSuministros).click(function(){
    resetFormMarca();
})

$('#' + id_boton_agregarMarcaSuministros).click(function(){
    if(validateMarca()){
      if (existe_marca){
          firebase.database().ref(rama_bd_insumos + "/marcas/" + id_marca_existente).once("value").then(function(snapshot){
              var registro_antiguo = snapshot.val();

              var marca_update = {};
              marca_update["marcas/" + id_marca_existente + "/nombre"] = $('#' + id_nombreMarcaSuministros).val();
              firebase.database().ref(rama_bd_insumos).update(marca_update);

              // pda
              pda("modificacion", rama_bd_insumos + "/marcas/" + id_marca_existente, registro_antiguo);
              alert("¡Edición exitosa!");
              resetFormMarca();
          });
      } else {
          firebase.database().ref(rama_bd_insumos + "/marcas").push(datosMarcaSuministros()).then(function(snapshot){
              var regKey = snapshot.key
              // pista de auditoría
              pda("alta", rama_bd_insumos + "/marcas/" + regKey, "");
              alert("¡Alta exitosa!");
              resetFormMarca();
          });
      };
    }
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
$('#' + id_nombreMarcaSuministros).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú-",e);
});

$('#' + id_nombreMarcaSuministros).change(function(){
    $('#' + id_nombreMarcaSuministros).val(deleteBlankSpaces(id_nombreMarcaSuministros));
});

 // ----------------------- FUNCIONES NECESARIAS ----------------------------
 function resetFormMarca(){
    $('#' + id_form_marcasSuministros).trigger("reset");
    existe_marca = false;
 };

 function validateMarca(){
    if($('#' + id_nombreMarcaSuministros).val() == ""){
        alert("Escribe el nombre de la marca que deseas dar de alta en el sistema. Ejemplo: Siemens");
        return false;
    } else {
        return true;
    };
 };

 function actualizarTablaMarca(){
    firebase.database().ref(rama_bd_insumos + "/marcas").on("value", function(snapshot){
        var datosMarcas = [];
        snapshot.forEach(function(marcaSnap){
            var marca = marcaSnap.val();
            var marca_id = marcaSnap.key;
            var marca_nombre = marca.nombre;

            datosMarcas.push([
                marca_id,
                marca_nombre
            ]);
        });
        tabla_marcas = $('#'+ id_dataTable_marcasSuministros).DataTable({
            destroy: true,
            data: datosMarcas,
            language: idioma_espanol,
            "order": [[1,"asc"]],
            "columnDefs": [
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                },
                {
                    targets: -1,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0},
              ]
        });

        $('#' + id_dataTable_marcasSuministros + ' tbody').on( 'click', '.editar', function () {
            highLightAllMarca();
            var data = tabla_marcas.row( $(this).parents('tr') ).data();
            resetFormMarca();
            existe_marca = true;
            id_marca_existente = data[0];

            $('#' + id_nombreMarcaSuministros).val(data[1]);
        });
    });
 };

 function datosMarcaSuministros(){
    var marca = {
            nombre: $('#' + id_nombreMarcaSuministros).val(),
    }
    return marca;
 }

 function highLightAllMarca(){
    highLight(id_nombreMarcaSuministros);
 }

 //=============================================================================
 //-------------------------------- CATEGORIAS ---------------------------------
 //=============================================================================

 var id_form_categoriasSuministros = "formCategoriasSuministros";
 var id_dataTable_categoriaSuministros = "dataTableCategoriaSuministros";

 var id_boton_borrarCategoriaSuministros = "boton_borrarCategoriaSuministros";
 var id_boton_agregarCategoriaSuministros = "boton_agregarCategoriaSuministros";

 var id_nombreCategoriaSuministros = "nombreCategoriaSuministros";

 // Variables globales

 var existe_categoria= false;
 var id_categoria_existente = "";

 // al apretar el botón de resetear, se resetea todo el formulario
 $('#' + id_boton_borrarCategoriaSuministros).click(function(){
     resetFormCategoria();
 })

 $('#' + id_boton_agregarCategoriaSuministros).click(function(){
     if(validateCategoria()){
       if (existe_categoria){
           firebase.database().ref(rama_bd_insumos + "/categorias/" + id_categoria_existente).once("value").then(function(snapshot){
               var registro_antiguo = snapshot.val();

               var categoria_update = {};
               categoria_update["categorias/" + id_categoria_existente + "/nombre"] = $('#' + id_nombreCategoriaSuministros).val();
               firebase.database().ref(rama_bd_insumos).update(categoria_update);

               // pda
               pda("modificacion", rama_bd_insumos + "/categorias/" + id_categoria_existente, registro_antiguo);
               alert("¡Edición exitosa!");
               resetFormCategoria();
           });
       } else {
           firebase.database().ref(rama_bd_insumos + "/categorias").push(datosCategoriaSuministros()).then(function(snapshot){
               var regKey = snapshot.key
               // pista de auditoría
               pda("alta", rama_bd_insumos + "/categorias/" + regKey, "");
               alert("¡Alta exitosa!");
               resetFormCategoria();
           });
       };
     }
 });

 // ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
 $('#' + id_nombreCategoriaSuministros).keypress(function(e){
     charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú-",e);
 });

 $('#' + id_nombreCategoriaSuministros).change(function(){
     $('#' + id_nombreCategoriaSuministros).val(deleteBlankSpaces(id_nombreCategoriaSuministros));
 });

  // ----------------------- FUNCIONES NECESARIAS ----------------------------

  function resetFormCategoria(){
     $('#' + id_form_categoriasSuministros).trigger("reset");
     existe_categoria = false;
  };

  function validateCategoria(){
     if($('#' + id_nombreCategoriaSuministros).val() == ""){
         alert("Escribe el nombre de la categoria que deseas dar de alta en el sistema. Ejemplo: Eléctrico");
         return false;
     } else {
         return true;
     };
  };

  function actualizarTablaCategoria(){
     firebase.database().ref(rama_bd_insumos + "/categorias").on("value", function(snapshot){
         var datoscategorias = [];
         snapshot.forEach(function(categoriaSnap){
             var categoria = categoriaSnap.val();
             var categoria_id = categoriaSnap.key;
             var categoria_nombre = categoria.nombre;

             datoscategorias.push([
                 categoria_id,
                 categoria_nombre
             ]);
         });
         tabla_categorias = $('#'+ id_dataTable_categoriaSuministros).DataTable({
             destroy: true,
             data: datoscategorias,
             language: idioma_espanol,
             "order": [[1,"asc"]],
             "columnDefs": [
                 {
                     "targets": -1,
                     "data": null,
                     "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                 },
                 {
                     targets: -1,
                     className: 'dt-body-center'
                 },
                 { "visible": false, "targets": 0},
               ]
         });

         $('#' + id_dataTable_categoriaSuministros + ' tbody').on( 'click', '.editar', function () {
             highLightAllcategoria();
             var data = tabla_categorias.row( $(this).parents('tr') ).data();
             resetFormCategoria();
             existe_categoria = true;
             id_categoria_existente = data[0];

             $('#' + id_nombreCategoriaSuministros).val(data[1]);
         });
     });
  };

  function datosCategoriaSuministros(){
     var categoria = {
             nombre: $('#' + id_nombreCategoriaSuministros).val(),
     }
     return categoria;
  }

  function highLightAllcategoria(){
     highLight(id_nombreCategoriaSuministros);
  }

  //=============================================================================
  //----------------------------- CLASIFICACIONES -------------------------------
  //=============================================================================

  var id_form_clasificacionesSuministros = "formClasificacionesSuministros";
  var id_dataTable_clasificacionSuministros = "dataTableClasificacionSuministros";

  var id_boton_borrarClasificacionSuministros = "boton_borrarClasificacionSuministros";
  var id_boton_agregarClasificacionSuministros = "boton_agregarClasificacionSuministros";

  var id_nombreClasificacionSuministros = "nombreClasificacionSuministros";

  // Variables globales

  var existe_clasificacion= false;
  var id_clasificacion_existente = "";

  // al apretar el botón de resetear, se resetea todo el formulario
  $('#' + id_boton_borrarClasificacionSuministros).click(function(){
      resetFormClasificacion();
  })

  $('#' + id_boton_agregarClasificacionSuministros).click(function(){
      if(validateClasificacion()){
        if (existe_clasificacion){
            firebase.database().ref(rama_bd_insumos + "/clasificaciones/" + id_clasificacion_existente).once("value").then(function(snapshot){
                var registro_antiguo = snapshot.val();

                var clasificacion_update = {};
                clasificacion_update["clasificaciones/" + id_clasificacion_existente + "/nombre"] = $('#' + id_nombreClasificacionSuministros).val();
                firebase.database().ref(rama_bd_insumos).update(clasificacion_update);

                // pda
                pda("modificacion", rama_bd_insumos + "/clasificaciones/" + id_clasificacion_existente, registro_antiguo);
                alert("¡Edición exitosa!");
                resetFormClasificacion();
            });
        } else {
            firebase.database().ref(rama_bd_insumos + "/clasificaciones").push(datosClasificacionSuministros()).then(function(snapshot){
                var regKey = snapshot.key
                // pista de auditoría
                pda("alta", rama_bd_insumos + "/clasificaciones/" + regKey, "");
                alert("¡Alta exitosa!");
                resetFormClasificacion();
            });
        };
      }
  });

  // ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
  $('#' + id_nombreClasificacionSuministros).keypress(function(e){
      charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú-",e);
  });

  $('#' + id_nombreClasificacionSuministros).change(function(){
      $('#' + id_nombreClasificacionSuministros).val(deleteBlankSpaces(id_nombreClasificacionSuministros));
  });

   // ----------------------- FUNCIONES NECESARIAS ----------------------------

   function resetFormClasificacion(){
      $('#' + id_form_clasificacionesSuministros).trigger("reset");
      existe_clasificacion = false;
   };

   function validateClasificacion(){
      if($('#' + id_nombreClasificacionSuministros).val() == ""){
          alert("Escribe el nombre de la clasificacion que deseas dar de alta en el sistema. Ejemplo: Poliducto");
          return false;
      } else {
          return true;
      };
   };

   function actualizarTablaClasificacion(){
      firebase.database().ref(rama_bd_insumos + "/clasificaciones").on("value", function(snapshot){
          var datosClasificaciones = [];
          snapshot.forEach(function(clasificacionSnap){
              var clasificacion = clasificacionSnap.val();
              var clasificacion_id = clasificacionSnap.key;
              var clasificacion_nombre = clasificacion.nombre;

              datosClasificaciones.push([
                  clasificacion_id,
                  clasificacion_nombre
              ]);
          });
          tabla_clasificaciones = $('#'+ id_dataTable_clasificacionSuministros).DataTable({
              destroy: true,
              data: datosClasificaciones,
              language: idioma_espanol,
              "order": [[1,"asc"]],
              "columnDefs": [
                  {
                      "targets": -1,
                      "data": null,
                      "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                  },
                  {
                      targets: -1,
                      className: 'dt-body-center'
                  },
                  { "visible": false, "targets": 0},
                ]
          });

          $('#' + id_dataTable_clasificacionSuministros + ' tbody').on( 'click', '.editar', function () {
              highLightAllClasificacion();
              var data = tabla_clasificaciones.row( $(this).parents('tr') ).data();
              resetFormClasificacion();
              existe_clasificacion = true;
              id_clasificacion_existente = data[0];

              $('#' + id_nombreClasificacionSuministros).val(data[1]);
          });
      });
   };

   function datosClasificacionSuministros(){
      var clasificacion = {
              nombre: $('#' + id_nombreClasificacionSuministros).val(),
      }
      return clasificacion;
   }

   function highLightAllClasificacion(){
      highLight(id_nombreClasificacionSuministros);
   }

   //=============================================================================
   //--------------------------------- UNIDADES ----------------------------------
   //=============================================================================

   var id_form_unidadesSuministros = "formUnidadesSuministros";
   var id_dataTable_unidadSuministros = "dataTableUnidadSuministros";

   var id_boton_borrarUnidadSuministros = "boton_borrarUnidadSuministros";
   var id_boton_agregarUnidadSuministros = "boton_agregarUnidadSuministros";

   var id_nombreUnidadSuministros = "nombreUnidadSuministros";

   // Variables globales

   var existe_unidad= false;
   var id_unidad_existente = "";

   // al apretar el botón de resetear, se resetea todo el formulario
   $('#' + id_boton_borrarUnidadSuministros).click(function(){
       resetFormUnidad();
   })

   $('#' + id_boton_agregarUnidadSuministros).click(function(){
       if(validateUnidad()){
         if (existe_unidad){
             firebase.database().ref(rama_bd_insumos + "/unidads/" + id_unidad_existente).once("value").then(function(snapshot){
                 var registro_antiguo = snapshot.val();

                 var unidad_update = {};
                 unidad_update["unidades/" + id_unidad_existente + "/nombre"] = $('#' + id_nombreUnidadSuministros).val();
                 firebase.database().ref(rama_bd_insumos).update(unidad_update);

                 // pda
                 pda("modificacion", rama_bd_insumos + "/unidades/" + id_unidad_existente, registro_antiguo);
                 alert("¡Edición exitosa!");
                 resetFormUnidad();
             });
         } else {
             firebase.database().ref(rama_bd_insumos + "/unidades").push(datosUnidadSuministros()).then(function(snapshot){
                 var regKey = snapshot.key
                 // pista de auditoría
                 pda("alta", rama_bd_insumos + "/unidades/" + regKey, "");
                 alert("¡Alta exitosa!");
                 resetFormUnidad();
             });
         };
       }
   });

   // ----------------------- VALIDACIÓN DE FORMULARIO ------------------------
   $('#' + id_nombreUnidadSuministros).keypress(function(e){
       charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789áéíóú",e);
   });

   $('#' + id_nombreUnidadSuministros).change(function(){
       $('#' + id_nombreUnidadSuministros).val(deleteBlankSpaces(id_nombreUnidadSuministros));
   });

    // ----------------------- FUNCIONES NECESARIAS ----------------------------

    function resetFormUnidad(){
       $('#' + id_form_unidadesSuministros).trigger("reset");
       existe_unidad = false;
    };

    function validateUnidad(){
       if($('#' + id_nombreUnidadSuministros).val() == ""){
           alert("Escribe el nombre de la unidad que deseas dar de alta en el sistema. Ejemplo: Pza");
           return false;
       } else {
           return true;
       };
    };

    function actualizarTablaUnidad(){
       firebase.database().ref(rama_bd_insumos + "/unidades").on("value", function(snapshot){
           var datosUnidades = [];
           snapshot.forEach(function(unidadSnap){
               var unidad = unidadSnap.val();
               var unidad_id = unidadSnap.key;
               var unidad_nombre = unidad.nombre;

               datosUnidades.push([
                   unidad_id,
                   unidad_nombre
               ]);
           });
           tabla_unidades = $('#'+ id_dataTable_unidadSuministros).DataTable({
               destroy: true,
               data: datosUnidades,
               language: idioma_espanol,
               "order": [[1,"asc"]],
               "columnDefs": [
                   {
                       "targets": -1,
                       "data": null,
                       "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                   },
                   {
                       targets: -1,
                       className: 'dt-body-center'
                   },
                   { "visible": false, "targets": 0},
                 ]
           });

           $('#' + id_dataTable_unidadSuministros + ' tbody').on( 'click', '.editar', function () {
               highLightAllUnidad();
               var data = tabla_unidades.row( $(this).parents('tr') ).data();
               resetFormUnidad();
               existe_unidad = true;
               id_unidad_existente = data[0];

               $('#' + id_nombreUnidadSuministros).val(data[1]);
           });
       });
    };

    function datosUnidadSuministros(){
       var unidad = {
               nombre: $('#' + id_nombreUnidadSuministros).val(),
       }
       return unidad;
    }

    function highLightAllUnidad(){
       highLight(id_nombreUnidadSuministros);
    }

  //===========================================================================
  //===========================================================================

  // Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
  // se resetea el formulario (ver en funciones)
  // se llena la tabla con todos los colaboradores

  $('#' + id_tab_definicionesSuministros).click(function() {
      resetFormsDefinicionesSuministros();
      actualizarTablaMarca();
      actualizarTablaCategoria();
      actualizarTablaClasificacion();
      actualizarTablaUnidad();
  });

  function resetFormsDefinicionesSuministros(){
    $('#' + id_form_marcasSuministros).trigger("reset");
    existe_marca = false;
    $('#' + id_form_categoriasSuministros).trigger("reset");
    existe_categoria = false;
    $('#' + id_form_clasificacionesSuministros).trigger("reset");
    existe_clasificaciones = false;
    $('#' + id_form_unidadesSuministros).trigger("reset");
    existe_unidades = false;
  };
