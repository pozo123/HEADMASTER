var id_nombre_destajista = "destajistaNombre";
var id_telefono_destajista = "destajistaTelefono";
var id_cuenta_bancaria_destajista = "destajistaCuentaBancaria";
var id_esp_ie_checkbox_destajista = "destajistaCbIE";
var id_esp_ihs_checkbox_destajista = "destajistaCbIHS";
var id_registrar_button_destajista = "registrarDestajista";

var rama_bd_destajista = "produccion/destajistas";

$('#' + id_registrar_button_destajista).click(function () {
	var esp_ie = document.getElementById(id_esp_ie_checkbox_destajista).checked;
	var esp_ihs = document.getElementById(id_esp_ihs_checkbox_destajista).checked;
    if($('#' + id_nombre_destajista).val() == "" || $('#' + id_cuenta_bancaria_destajista).val() == "" || (!esp_ie && !esp_ihs)){
        alert("Llena todos los campos requeridos");
    } else {
    	var esp = "IHS";
    	if(esp_ie){
    		if(esp_ihs){
    			esp = "Ambas";
    		} else {
    			esp = "IE"
    		}
    	}
    	var destajista = {
    		nombre: $('#' + id_nombre_destajista).val(),
    		telefono: $('#' + id_telefono_destajista).val(),
    		cuenta_bancaria: $('#' + id_cuenta_bancaria_destajista).val(),
    		especialidad: esp,
    	}
    	firebase.database().ref(rama_bd_destajista + "/" + $('#' + id_nombre_destajista).val()).set(destajista);
        alert("Registro exitoso");
    }
});