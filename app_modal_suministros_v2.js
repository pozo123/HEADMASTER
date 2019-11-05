// ------------------ Campos Modal Suministros --------------------------------
var id_modalSuministros = "modalSuministros";
var id_dataTable_selectModalSuministros = "dataTableSeleccionadosModalSuministros";
var id_dataTable_busquedaModalSuministros = "dataTableBusquedaModalSuministros";

var id_ddl_buscaMarcaModalSuministros = "ddl_buscaMarcaModalSuministros";
var id_ddl_buscaClasificacionModalSuministros = "ddl_buscaClasificacionModalSuministros";
var id_ddl_buscaCategoriaModalSuministros = "ddl_buscaCategoriaModalSuministros";
var id_buscaCatalogoModalSuministros = "buscaCatalogoModalSuministros";
var id_catalogoModalSuministros = "catalogoModalSuministros";
var id_descripcionModalSuministros = "descripcionModalSuministros";
var id_cantidadModalSuministros = "cantidadModalSuministros";
var id_div_preciosModalSuministros = "div_preciosModalSuministros";
var id_precioListaModalSuministros = "precioListaModalSuministros";
var id_indirectosModalSuministros = "indirectosModalSuministros";
var id_precioClienteModalSuministros = "precioClienteModalSuministros";

var id_boton_agregarModalSuministross = "botonAgregarModalSuministros";
var id_boton_limpiarModalSuministros = "botonLimpiarFiltrosModalSuministros";
var id_boton_guardarModalSuministros = "botonGuardarModalSuministros";

var tabla_busqueda;
var tabla_selectos;

var json_precios;
var p_indirectos;
var supervisorFlag;

// --------------------- Método de inicialización -----------------------------
function modalSuministros(indirectos, supervisor){
  resetModalSuministros();
  json_precios = {};
  p_indirectos = indirectos;
  supervisorFlag = supervisor;
  firebase.database().ref(rama_bd_insumos + "/marcas").orderByChild('nombre').on('value',function(snapshot){
    marcas = snapshot;
    json_marcas=marcas.val();
    llenaDdlGeneric(id_ddl_buscaMarcaModalSuministros, marcas, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/categorias").orderByChild('nombre').on('value',function(snapshot){
    categorias = snapshot;
    json_categorias=categorias.val();
    llenaDdlGeneric(id_ddl_buscaCategoriaModalSuministros, categorias, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/clasificaciones").orderByChild('nombre').on('value',function(snapshot){
    clasificaciones = snapshot;
    json_clasificaciones=clasificaciones.val();
    llenaDdlGeneric(id_ddl_buscaClasificacionModalSuministros, clasificaciones, "nombre");
  });
  firebase.database().ref(rama_bd_insumos + "/unidades").orderByChild('nombre').on('value',function(snapshot){
    unidades = snapshot;
    json_unidades=unidades.val();
  });
  firebase.database().ref(rama_bd_insumos + "/productos").orderByChild('catalogo').on('value',function(snapshot){
    base_insumos = snapshot.val();
  });
  firebase.database().ref(rama_bd_insumos + "/listas/productos").on('value',function(snapshot){
    var productos = {};
    var produc = {};
    var maximo = 0;
    if(snapshot.exists()){
      productos= snapshot.val();
      for(key in base_insumos){
        produc = productos[key];
        maximo = 0;
        for(key2 in produc){
          if(produc[key2]["precio"] > maximo){
            maximo = produc[key2]["precio"];
          }
        }
        json_precios[key] = maximo;
      }
      console.log(json_precios);
    }
    actualizarTablaSuministros(base_insumos);
  });
  creaTablaSelectosSuministros();
  $('#' + id_modalSuministros).modal('show');
}

// ----------------------Funciones necesarias ----------------------------------
function resetModalSuministros(){
  $('#'+id_ddl_buscaMarcaModalSuministros).empty();
  $('#'+id_ddl_buscaClasificacionModalSuministros).empty();
  $('#'+id_ddl_buscaCategoriaModalSuministros).empty();

}

function limpiaBusquedaModalSuministros(){
  $('#'+id_ddl_buscaMarcaModalSuministros).val("");
  $('#'+id_ddl_buscaClasificacionModalSuministros).val("");
  $('#'+id_ddl_buscaCategoriaModalSuministros).val("");
}

//------------------------------- DataTables -----------------------------------
function actualizarTablaSuministros(datos){
  var datos_suministros = [];
  for(key in datos){
    var insumo = datos[key];
    datos_suministros.push([
      key,
      datos[key]["catalogo"],
      json_marcas[insumo["marca"]]["nombre"],
      json_clasificaciones[insumo["clasificacion"]]["nombre"],
      datos[key]["descripcion"],
      json_unidades[insumo["unidad"]]["nombre"],
      formatMoney(json_precios[key]),
      "<button type='button' class='agregarSuministros btn btn-transparente'><i class='icono_verde fas fa-check-circle'></i></button>",
    ]);
  }
  tabla_busqueda = $('#'+ id_dataTable_busquedaModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      //"autoWidth": false,
      "columnDefs": [
          { "width": "120px", "targets": 4 },
          {
              targets: -2,
              className: 'dt-body-center'
          },
          { "visible": false, "targets": supervisorFlag?[0,6]:[0] }, //Campos auxiliares
        ]
  });
}

$(document).on('click','.agregarSuministros', function(){
  var data = tabla_busqueda.row( $(this).parents('tr') ).data();
  $('#' + id_catalogoModalSuministros).val(data[1]);
  $('#' + id_descripcionModalSuministros).val(data[4]);
  $('#' + id_cantidadModalSuministros).val(1);
  $('#' + id_precioListaModalSuministros).val(data[6]);
  $('#' + id_indirectosModalSuministros).val(p_indirectos);
  $('#' + id_precioClienteModalSuministros).val( formatMoney( deformatMoney(data[6]) * (1 + p_indirectos*0.01) ) );
});

function creaTablaSelectosSuministros(){
  var datos_suministros = [];
  tabla_selectos = $('#'+ id_dataTable_selectModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      "columnDefs": [
          { "width": "120px", "targets": 4 },
          {
              targets: -2,
              className: 'dt-body-center'
          },
          { "visible": false, "targets": 0 }, //Campos auxiliares
        ]
  });

  $('#' + id_dataTable_selectModalSuministros + ' tbody').on( 'click', '.desplegar', function () {
      var data = tabla_selectos.row( $(this).parents('tr')).data();
      var icon_class = "";
      if(data[9]) {
          icon_class = "'icono_rojo fas fa-times-circle'"
          data[9]=false;
      } else {
        icon_class = "'icono_verde fas fa-check-circle'";
        data[9]=true;
      }
      data[7] = "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>";
      tabla_selectos.row( $(this).parents('tr')).data(data).draw();
  });

  $('#' + id_dataTable_selectModalSuministros + ' tbody').on( 'click', '.eliminar', function () {
      tabla_selectos.row( $(this).parents('tr') ).remove().draw();
  });

}
