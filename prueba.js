var id_obra_ddl_gestionar = "DDL_obra";
var id_presupuestos_ddl_gestionar = "DDL_presupuesto";
var id_activar_button_gestionar = "activar_button";
var id_terminar_button_gestionar = "terminar_button"; //Cambie a terminar
var id_ocultar_button_gestionar = "ocultar_button";
var id_horas_column_gestionar  = "horasColumn"; //Agregué
var rama_bd_obras = "obras";
var id_guardar_button_gestionar = "guardarHorasGestionar";

var horas_por_inge = [];
//var multiples_consecutivos = false;

$(document).ready(function() {

    loadColaboradoresGestionar(); //Sí aqui?

    var select = document.getElementById(id_obra_ddl_gestionar);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    //var option2 = document.createElement('option');
    //option2.text = option2.value = "Miscelaneo";
    //select.appendChild(option2);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        
        var obra = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = obra.nombre; 
        select.appendChild(option3);

    });    
});

//Camie a gestionar
function loadDDLPresupuestosGestionar(){
    $('#' + id_presupuestos_ddl_gestionar).empty();
    var select = document.getElementById(id_presupuestos_ddl_gestionar);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = option2.value = presu; 
        select.appendChild(option2);
    });

};


$('#' + id_activar_button_gestionar).click(function () {
//Chance falta un orderBy?
    var activado = true;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/contrato").set(activado);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/timestamps/activacion").set(new Date.getTime());
    alert("Presupuesto activado");
});

$('#' + id_terminar_button_gestionar).click(function () {
    var activado = false;
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/contrato").set(activado);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/timestamps/finishedAt").set(new Date.getTime());
    alert("Presupuesto terminado");
});

$('#' + id_ocultar_button_gestionar).click(function () {
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").once("value").then(function(snapshot){
        if(snapshot.val() === true){
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").set(false);
            alert("Presupuesto desocultado");
        }
        else{
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/oculto").set(true);                
            alert("Presupuesto ocultado");
        }
    });
});

$("#" + id_horas_column_gestionar).on("change", "input.row_checkbox_gestionar",function() {
    //$("#text_" + $(this).value + "_gestionar")[($(this).is(":checked") ? "show" : "hide")]();//Value necesita ()?
    if($(this).is(":checked")){
      $("#text_" + $(this).val() + "_gestionar").removeClass("hidden");
    }
    else
      $("#text_" + $(this).val() + "_gestionar").addClass("hidden");
});//trigger("click");//Es necesario el trigger?
//Este en el document.Ready??
function loadColaboradoresGestionar(){
  horas_por_inge = [];
  $('#' + id_horas_column_gestionar).empty();
  firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
    var inge = snapshot.val();
    if(inge.permisos.perfil === true){
      var row_gestionar = document.createElement('div');
      row_gestionar.id = "row_" + inge.uid;
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "row_checkbox_gestionar";
      checkbox.value = inge.uid;
      checkbox.id = "check_" + inge.uid + "_gestionar";
      var label = document.createElement('label');
      label.innerHTML = " " + inge.nombre;//Puede ser innerText?
      var textfield = document.createElement('input');
      textfield.type = "text";
      textfield.id = "text_" + inge.uid + "_gestionar";
      textfield.className = "hidden";
      row_gestionar.appendChild(checkbox);
      row_gestionar.appendChild(label);
      row_gestionar.appendChild(textfield);
      var div = document.getElementById(id_horas_column_gestionar);
      div.appendChild(row_gestionar);
      horas_por_inge.push({uid: inge.uid, nombre: inge.nombre});
      console.log(checkbox);
    }      
  });
}

$('#' + id_guardar_button_gestionar).click(function () {
  for(i=0;i<horas_por_inge.length;i++){
    var i_uid = horas_por_inge[i].uid;
    if($("#check_" + i_uid + "_gestionar").is(":checked")){
      var horas = {
        nombre: horas_por_inge[i].nombre,
        horas: $("#text_" + i_uid + "_gestionar").val()
      }
      firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_gestionar + " option:selected").val() + "/colaboradores_asignados/" + i_uid).set(horas);
    }
  }
  alert("Distribucion de horas actualizada");
});


//.......
