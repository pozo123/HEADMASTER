// ------------------ Campos Modal Suministros --------------------------------
var id_modalSuministros = "modalSuministros";
var id_dataTable_selectModalSuministros = "dataTableSeleccionadosModalSuministros";
var id_dataTable_busquedaModalSuministros = "dataTableBusquedaModalSuministros";

var id_ddl_buscaMarcaModalSuministros = "ddl_buscaMarcaModalSuministros";
var id_ddl_buscaClasificacionModalSuministros = "ddl_buscaClasificacionModalSuministros";
var id_ddl_buscaCategoriaModalSuministros = "ddl_buscaCategoriaModalSuministros";
var id_buscaCategoriaModalSuministros = "buscaCatalogoModalSuministros";

var id_boton_limpiarModalSuministros = "botonLimpiarFiltrosModalSuministros";
var id_boton_guardarModalSuministros = "botonGuardarModalSuministros";

var datos_insumos;
var tabla_busqueda;
var tabla_selectos;

function modalSuministros(){
  firebase.database().ref(rama_bd_insumos).on('value',function(snapshot){
    datos_insumos = snapshot;
    var listas = datos_insumos.child('listas');
    $('#' + id_ddl_buscaMarcaModalSuministros).empty();
    var select = document.getElementById(id_ddl_buscaMarcaModalSuministros);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    var cliente;
    listas.child('marca').forEach(function(snap_marca){
      var marca = snap_marca.val();
      option = document.createElement('option');
      option.value = snap_marca.key;
      option.text = marca.nombre;
      select.appendChild(option);
    });

  });
}

function resetModalSuministros(){
  $('#'+id_buscaMarcaModalSuministros).empty();
  $('#'+id_buscaClasificacionModalSuministros).empty();
  $('#'+id_buscaCatalogoModalSuministros).empty();
}

function limpiaBusquedaModalSuministros(){
  $('#'+id_buscaMarcaModalSuministros).val("");
  $('#'+id_buscaClasificacionModalSuministros).val("");
  $('#'+id_buscaCatalogoModalSuministros).val("");
}

function actualizarTablaSuministros(datos){
  var datos_suministros = [];
  for(key in datos){
    datos_suministros.push([
      key,
      datos[key]["catalogo"],
      datos[key]["marca"],
      datos[key]["clasificacion"],
      datos[key]["descripcion"],
      datos[key]["unidad"],
      datos[key]["precio"],
      "<button type='button' class='agregar btn btn-transparente'><i class=" + icon_class + "></i></button>",
    ]);
  }
  tabla_busqueda = $('#'+ id_dataTable_busquedaModalSuministros).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
      "autoWidth": false,
      "columnDefs": [
          { "width": "120px", "targets": 4 },
          {
              targets: -2,
              className: 'dt-body-center'
          },
          { "visible": false, "targets": 0 }, //Campos auxiliares
        ]
  });
  //Funcion para llenar los campos cuando se quiere editar desde las opciones de la tabla
  $('#' + id_dataTable_busquedaModalSuministros + ' tbody').on( 'click', '.agregar', function () {
      var data = tabla_busqueda.row( $(this).parents('tr') ).data();
      var icon_class = "";
      var icon_class_verde = "'icono_verde fas fa-check-circle'";
      var icon_class_rojo = "'icono_rojo fas fa-times-circle'"
      tabla_selectos.row.add([
        data[0],
        data[1],
        data[2]+"-"data[3]+"-"data[4],
        data[5],
        data[5],
        0,
        0,
        "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class_verde + "></i></button>",
        "<button type='button' class='eliminar btn btn-transparente'><i class=" + icon_class_rojo + "></i></button>",
        true,
      ]);
  });
}

function creaTablaSalectos(){
  var datos_selectos=[];
  tabla_selectos = = $('#'+ id_dataTable_selectModalSuministros).DataTable({
      destroy: true,
      data: datos_selectos,
      language: idioma_espanol,
      "autoWidth": false,
      "columnDefs": [
          { "width": "120px", "targets": 2 },
          {
              targets: -2,
              className: 'dt-body-center'
          },
          { "visible": false, "targets": 0 }, //Campos auxiliares
          { "visible": false, "targets": 9 }
        ]
  });
}

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
