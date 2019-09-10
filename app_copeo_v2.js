// id's de los elementos HTML
var id_tab_copeo = "tabCopeo";
var id_form_copeo = "formCopeo";
//var id_dataTable_copeo = "dataTableProcesos";

var id_ddl_obraCopeo = "ddl_obraCopeo";
var id_ddl_procesoCopeo = "ddl_procesoCopeo";
var id_ddl_subprocesoCopeo = "ddl_subprocesoCopeo";
var id_carga_socialCopeo = "cargaSocialCopeo";
var id_diasCopeo = "diasCopeo";
var id_multCopeo = "multCopeo";
var id_nombreCopeo = "nombreCopeo";
var id_alcanceCopeo = "alcanceCopeo";
var id_lista_trabajadoresCopeo = "listaTrabajadoresCopeo";
var id_div_trabajadoresCopeo = "divTrabajadoresCopeo";

var id_agregar_copeo = "botonAceptarCopeo";
var id_borrar_copeo = "botonResetCopeo";

var selectTrabajadores;

//Variables globales para controlar edición

//Dar formato a los elementos existentes
$('#' + id_tab_copeo).click(function() {
  console.log("Inicializando");
  // Llenado del ddl de obra.
  $('#' + id_ddl_obraCopeo).empty();
  var select = document.getElementById(id_ddl_obraCopeo);
  var option = document.createElement('option');
  option.style = "display:none";
  option.text = option.value = "";
  select.appendChild(option);
  var obra;
  firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
      obra = snapshot.val();
      option = document.createElement('option');
      option.value = snapshot.key;
      option.text = obra.nombre;
      select.appendChild(option);
  });

  var puesto;
  var select2 = document.getElementById(id_lista_trabajadoresCopeo);
  firebase.database().ref(rama_bd_datos_referencia + "/puestos").on('value',function(snapshot){
      snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
        puesto = snapChild.val();
        option = document.createElement('option');
        option.value = snapChild.key;
        option.text = puesto.puesto;
        select2.appendChild(option);
      })
      //Llenado de la lista de puestos
      selectTrabajadores = new SlimSelect({
          select: '#' + id_lista_trabajadoresCopeo,
          placeholder: 'Elige los puestos necesarios',
      });
  });
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_agregar_copeo).click(function() {

});

//Funcionalidad del boton 'Borrar todo'
$('#' + id_borrar_copeo).click(function() {

});

$('#' + id_lista_trabajadoresCopeo).change(function(){
  console.log(selectTrabajadores.selected());
    selectTrabajadores.selected().forEach(function (item){
      console.log(item);
      var id_puesto = item+"Copeo";
      var cantidad = document.createElement('input');
      cantidad.className = "form-control";
      cantidad.type = "text";
      cantidad.placeholder = "Cantidad";
      cantidad.id = id_puesto;

      var col = document.createElement('div');
      col.className = "form-group col-6";
      col.appendChild(cantidad);

      var label = document.createElement('label');
      label.className = "col-form-label";
      label.innerHTML = "puesto";
      label.for = id_puesto;

      var col2 = document.createElement('div');
      col2.className = "form-group col-6";
      col2.appendChild(label);

      var row = document.createElement('div');
      row.className = "form-row";
      row.id = "row-"+item;
      row.append(col2);
      row.append(col);

      var div_trabajadores = document.getElementById(id_div_trabajadoresCopeo);
      div_trabajadores.appendChild(row);
    });
});
