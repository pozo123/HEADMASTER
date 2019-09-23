var id_tab_adicionales = "tabGeneradorAdic";
var id_form_adicionales = "formGeneradorAdic";
var id_dataTable_selectAdicionales = "dataTableSeleccionadosAdicionales";

var id_ddl_obraAdicionales = "ddl_obraAdicionales";
var id_ddl_subprocesoAdicionales = "ddl_subprocesoAdicionales";
var id_claveAdicionales = "claveAdicionales";
var id_nombreAdicionales = "nombreAdicionales";
var id_tituloAdicionales = "tituloAdicionales";
var id_ddl_atnAdicionales = "ddl_atnAdicionales";
var id_foto_inputAdicionales = "fotoInputAdicionales";
var id_imagen_labelAdicionales = "imagenLabelAdicionales";
var id_boton_imagenAdicionales = "botonImagenAdicionales";
var id_imagenes_selecAdicionales = "imagenesSeleccionadasAdicionales";
var id_boton_agregar_suministrosAdicionales = "botonAgregarSuministroAdicionales";

// ------------------------ Campos Calculadora --------------------------------
var id_boton_defaultCalculadoraAdicionales = "botonDefaultAdicionales";
var id_indirectosCalculadoraAdicionales = "indirectosAdicionales";
var id_anticipoCalculadoraAdicionales = "anticipoAdicionales";
var id_estimacionesCalculadoraAdicionales = "estimacionesAdicionales";
var id_costo_horas_scoreCalculadoraAdicionales = "costoHoraScoreAdicionales";
var id_horas_scoreCalculadoraAdicionales = "horasProyectoAdicionales";
var id_costo_scoreCalculadoraAdicionales = "costoProyectoAdicionales";
var id__costo_copeoCalculadoraAdicionales = "costoCopeoAdicionales";
var id__costo_copeo_CSCalculadoraAdicionales = "costoCopeoCargaAdicionales";
var id_impuestosCalculadoraAdicionales = "impuestosAdicionales";
var id_costo_suministrosCalculadoraAdicionales = "costoSuministrosAdicionales";
var id_profit_cantidadCalculadoraAdicionales = "profitCantidadAdicionales";
var id_profit_porcentajeCalculadoraAdicionales = "profitPorcentajeAdicionales";
var id_precioVentaCalculadoraAdicionales = "precioVentaAdicionales";
var id_costos_indirectosCalculadoraAdicionales = "costosIndirectosAdicionales";
var id_costo_operacionesCalculadoraAdicionales = "costoOperacionesAdicionales";

var id_ddlCb_requisitosAdicionales = "ddlCb_requisitosAdicionales";
var id_ddlCb_exclusionesAdicionales = "ddlCb_exclusionesAdicionales";
var id_tiempo_entregaAdicionales = "tiempoEntregaAdicionales";
var id_cb_bancariosAdicionales = "cb_bancariosAdicionales";
var id_cd_fiscalesAdicionales = "cb_fiscalesAdicionales";
var id_boton_registrarAdicionales = "botonRegistrarAdicionales";
var id_boton_vistaPreviaAdicionales = "botonvistaPreviaAdicionales";
var id_boton_borrarAdicionales = "botonBorrarTodoAdicionales";

var selectImagenes;
var tabla_selectosAdicionales;

$('#' + id_tab_adicionales).click(function() {
  $('#' + id_imagenes_selecAdicionales).empty();
  selectImagenes = new SlimSelect({
      select: '#' + id_imagenes_selecAdicionales,
      placeholder: 'Elige los documentos de respaldo',
  });
  creaTablaSelectosAdicionales();
});

$('#' + id_boton_agregar_suministrosAdicionales).click(function() {
  modalSuministros();
});

function creaTablaSelectosAdicionales(){
  var datos_suministros = [];
  tabla_selectosAdicionales = $('#'+ id_dataTable_selectAdicionales).DataTable({
      destroy: true,
      data: datos_suministros,
      language: idioma_espanol,
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

  $('#' + id_dataTable_selectAdicionales + ' tbody').on( 'click', '.desplegar', function () {
      var data = tabla_selectosAdicionales.row( $(this).parents('tr')).data();
      var icon_class = "";
      if(data[9]) {
          icon_class = "'icono_rojo fas fa-times-circle'"
          data[9]=false;
      } else {
        icon_class = "'icono_verde fas fa-check-circle'";
        data[9]=true;
      }
      data[7] = "<button type='button' class='desplegar btn btn-transparente'><i class=" + icon_class + "></i></button>";
      tabla_selectosAdicionales.row( $(this).parents('tr')).data(data).draw();
  });

  $('#' + id_dataTable_selectAdicionales + ' tbody').on( 'click', '.eliminar', function () {
      tabla_selectosAdicionales.row( $(this).parents('tr') ).remove().draw();
  });

}
