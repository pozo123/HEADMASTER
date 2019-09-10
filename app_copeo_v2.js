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
var id_costo_CopeoCopeo = "costoCopeo"
var id_costo_Copeo_CSCopeo = "costoCSCopeo"

var id_agregar_copeo = "botonAceptarCopeo";
var id_borrar_copeo = "botonResetCopeo";

var selectTrabajadores;
var puestos_array;
var puestos_json;

//Variables globales para controlar edición

//Dar formato a los elementos existentes
$('#' + id_tab_copeo).click(function() {
  puestos_array = [];
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

  $('#' + id_lista_trabajadoresCopeo).empty();
  var puesto;
  var select2 = document.getElementById(id_lista_trabajadoresCopeo);
  firebase.database().ref(rama_bd_datos_referencia + "/puestos").on('value',function(snapshot){
      puestos_json = snapshot.val();
      console.log(puestos_json);
      snapshot.forEach(function(snapChild){ //Contar todos los subprocesos de la misma categoría para ese proceso
        puesto = snapChild.val();
        option = document.createElement('option');
        option.value = snapChild.key;
        option.text = puesto.puesto;
        select2.appendChild(option);
        agregaCamposPuesto(snapChild.key);
        puestos_array.push(snapChild.key);
      })
      //Llenado de la lista de puestos
      selectTrabajadores = new SlimSelect({
          select: '#' + id_lista_trabajadoresCopeo,
          placeholder: 'Elige los puestos necesarios',
      });
      resetFormCopeo();
  });
});

//Funcionalidad del boton 'Registrar/Editar'
$('#' + id_agregar_copeo).click(function() {

});

//Funcionalidad del boton 'Borrar todo'
$('#' + id_borrar_copeo).click(function() {

});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------
// -----------------------------------   ---------------------------------------

$('#' + id_lista_trabajadoresCopeo).change(function(){
    var array_html = selectTrabajadores.selected();
    var item;
    for (i = 0; i < puestos_array.length; i++) {
      item = puestos_array[i];
      if(array_html.includes(item)){
        $('#' + "row-"+item).removeClass('hidden');
      } else {
        $('#' + "row-"+item).addClass('hidden');
      }
    }
});

// ----------------------- FUNCIONES DE LOS CAMPOS REGULARES ------------------------

function resetFormCopeo (){
  $('#'+id_ddl_obraCopeo).val("");
  $('#'+id_ddl_procesoCopeo).empty();
  $('#'+id_ddl_subprocesoCopeo).empty();
  $('#'+id_carga_socialCopeo).val(54);
  $('#'+id_diasCopeo).val("");
  $('#'+id_multCopeo).val("");
  $('#'+id_nombreCopeo).val("");
  $('#'+id_alcanceCopeo).val("");
  selectTrabajadores.set(puestos_array);
  $('#'+id_costo_CopeoCopeo).val("");
  $('#'+id_costo_Copeo_CSCopeo).val("");
  for(i = 0; i < puestos_array.length; i++){
    $('#'+"row-"+puestos_array[i]).removeClass("hidden");
    $('#'+puestos_array[i]).val("");
  }

}

function agregaCamposPuesto(puesto){
  console.log(puesto);
  var id_puesto = puesto + "Copeo";
  var cantidad = document.createElement('input');
  cantidad.className = "form-control";
  cantidad.type = "text";
  cantidad.placeholder = "Cantidad";
  cantidad.id = id_puesto;

  var col1 = document.createElement('div');
  col1.className = "col-md-2";
  col1.appendChild(cantidad);

  var label = document.createElement('label');
  label.innerHTML = puestos_json[puesto]["puesto"]
  label.for = id_puesto;

  var col2 = document.createElement('div');
  col2.className = "col-md-3";
  col2.appendChild(label);

  var cantidad2 = document.createElement('input');
  cantidad2.className = "form-control";
  cantidad2.type = "text";
  cantidad2.disabled = "true";
  cantidad2.value = formatMoney(puestos_json[puesto]["sueldo"]);

  var col3 = document.createElement('div');
  col3.className = "col-md-3";
  col3.appendChild(cantidad2);

  var col0= document.createElement('div');
  col0.className = "col-md-2";

  var col4= document.createElement('div');
  col4.className = "col-md-2";

  var row = document.createElement('div');
  row.className = "form-row hidden";
  row.id = "row-"+puesto;
  row.append(col0);
  row.append(col2);
  row.append(col1);
  row.append(col3);
  row.append(col4);
  var div_trabajadores = document.getElementById(id_div_trabajadoresCopeo);
  div_trabajadores.appendChild(row);
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
