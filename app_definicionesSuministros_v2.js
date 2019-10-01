// id's de los elementos HTML
var id_tab_definicionesSuministros = "tabDefinicionesSuministros";

//=============================================================================
//-------------------------------- MARCAS -------------------------------------
//=============================================================================

var id_form_marcasSuministros = "formMarcasSuminsitros";
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
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e);
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

 var id_form_categoriasSuministros = "formcategoriasSuminsitros";
 var id_dataTable_categoriaSuministros = "dataTablecategoriasSuministros";

 var id_boton_borrarCategoriaSuministros = "boton_borrarcategoriaSuministros";
 var id_boton_agregarCategoriaSuministros = "boton_agregarcategoriaSuministros";

 var id_nombreCategoriaSuministros = "nombrecategoriaSuministros";

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
     charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789",e);
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
         alert("Escribe el nombre de la categoria que deseas dar de alta en el sistema. Ejemplo: Siemens");
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

  //===========================================================================
  // Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
  // se resetea el formulario (ver en funciones)
  // se llena la tabla con todos los colaboradores

  $('#' + id_tab_definicionesSuministros).click(function() {
      resetFormsDefinicionesSuministros();
      actualizarTablaMarca();
      actualizarTablaCategoria();
      //actualizarTablaClasificacion();
      //actualizarTablaUnidad();
  });

  function resetFormsDefinicionesSuministros(){
    $('#' + id_form_marcasSuministros).trigger("reset");
    existe_marca = false;
    $('#' + id_form_categoriasSuministros).trigger("reset");
    existe_categoria = false;
    //$('#' + id_form_clasificacionesSuministros).trigger("reset");
    //existe_clasificaciones = false;
    //$('#' + id_form_unidadesSuministros).trigger("reset");
    //existe_unidades = false;
  };
