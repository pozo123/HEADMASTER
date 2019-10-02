var id_tab_adicionales = "tabGeneradorAdic";
var id_form_adicionales = "formGeneradorAdic";
var id_dataTable_selectAdicionales = "dataTableSeleccionadosAdicionales";

var id_ddl_obraAdicionales = "ddl_obraAdicionales";
var id_info_atencionAdicionales = "info_atencionAdicionales";
var id_ddl_subprocesoAdicionales = "ddl_subprocesoAdicionales";
var id_claveAdicionales = "claveAdicionales";
var id_nombreAdicionales = "nombreAdicionales";
var id_tituloAdicionales = "tituloAdicionales";
var id_ddl_atnAdicionales = "ddl_atnAdicionales";
var id_cb_altaSinSupervisorAdicionales = "cb_altaSinSupervisorAdicionales";
var id_div_sinSupervisorAdicionales = "div_sinSupervisorAdicionales";
var id_div_conSupervisorAdicionales = "div_conSupervisorAdicionales";
var id_ddl_peticionAdicionales = "ddl_peticionAdicionales";
var id_foto_inputAdicionales = "fotoInputAdicionales";
var id_imagen_labelAdicionales = "imagenLabelAdicionales";
var id_boton_imagenAdicionales = "botonImagenAdicionales";
var id_imagenes_selecAdicionales = "imagenesSeleccionadasAdicionales";
var id_boton_agregar_suministrosAdicionales = "botonAgregarSuministroAdicionales";

// ------------------------ Campos Calculadora --------------------------------
var id_boton_calculadoraAdicionales = "botonCalculadoraAdicionales";
var id_boton_copeoAdicionales = "botonCopeoAdicionales";

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
  //document.getElementById(id_info_atencionAdicionales).style.background = "#FF0000";
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

$('#' + id_boton_calculadoraAdicionales).click(function() {
  modalCalculadora();
});

$('#' + id_boton_copeoAdicionales).click(function() {
  modalCopeo();
});

$('#' + id_cb_altaSinSupervisorAdicionales ).change(function(){
    if ($('#' + id_cb_altaSinSupervisorAdicionales ).prop("checked")){
      $('#' + id_div_conSupervisorAdicionales ).addClass('hidden');
      $('#' + id_div_sinSupervisorAdicionales ).removeClass('hidden');
    } else {
      $('#' + id_div_sinSupervisorAdicionales ).addClass('hidden');
      $('#' + id_div_conSupervisorAdicionales ).removeClass('hidden');
    }
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
