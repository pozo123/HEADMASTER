var id_cliente_ddl_atn = "DDL_cliente";
var id_guardar_button_atn = "altaAtn";
var id_nombre_atn = "nombreAtn";
var id_area_atn = "areaAtn";
var id_celular_atn = "celAtn";
var id_email_atn = "emailAtn";
var id_extension_atn = "extensionAtn";
var rama_bd_clientes = "clientes";

var atencion_atn = [];

$('#tabAltaAtencion').click(function () {
    loadDDLClienteAtn();
});

function loadDDLClienteAtn(){
	var select = document.getElementById(id_cliente_ddl_atn);   
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_clientes).orderByChild('nombre').on('child_added',function(snapshot){
        var cliente = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = cliente.nombre; 
        option2.value = cliente.nombre;
        select.appendChild(option2);
    });
}

$('#' + id_guardar_button_atn).click(function () {
	if($('#' + id_cliente_ddl_atn + " option:selected").val() === "" || $('#' + id_nombre_atn).val() === ""){
		alert("Llena todos los campos esenciales");
	} else {
        atencion_atn = [];
	    firebase.database().ref(rama_bd_clientes + "/" + $('#' + id_cliente_ddl_atn + " option:selected").text()).once('value').then(function(snapshot){
            var cliente = snapshot;
            if(cliente.child("atencion").val() !== null){
                atencion_atn = cliente.child("atencion").val();
                atencion_atn.push({
                    nombre: $('#' + id_nombre_atn).val(),
                    area: $('#' + id_area_atn).val(),
                    celular: $('#' + id_celular_atn).val(),
                    email: $('#' + id_email_atn).val(),
                    extension: $('#' + id_extension_atn).val(),
                });
                firebase.database().ref(rama_bd_clientes + "/" + $('#' + id_cliente_ddl_atn + " option:selected").val()).update({atencion: atencion_atn});
            } else {
                atencion_atn.push({
                    nombre: $('#' + id_nombre_atn).val(),
                    area: $('#' + id_area_atn).val(),
                    celular: $('#' + id_celular_atn).val(),
                    email: $('#' + id_email_atn).val(),
                    extension: $('#' + id_extension_atn).val(),
                });
                firebase.database().ref(rama_bd_clientes + "/" + $('#' + id_cliente_ddl_atn + " option:selected").val() + "/atencion").set(atencion_atn);
            }
	    });
	    alert("Alta exitosa");
	}
 });