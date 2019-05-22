var id_ref_proveedor = "refProveedor";
var id_razon_proveedor = "razonProveedor";
var id_rfc_proveedor = "rfcProveedor";
var id_direccion_proveedor = "direccionProveedor";
var id_atiende_proveedor = "atiendeProveedor";
var id_telefono_proveedor = "telefonoProveedor";

var id_registrar_button_proveedor = "registrarButtonProveedor";
var id_editar_button_proveedor = "editarButtonProveedor";

var rama_bd_proveedores = "compras/proveedores";
var rama_bd_compras = "compras";

var id_tab_proveedores = "tabProveedores"

$('#' + id_tab_proveedores).click(function(){
	$('#' + id_ref_proveedor).val("");
	clearFieldsProveedor();
});

function clearFieldsProveedor(){
	$('#' + id_razon_proveedor).val("");
	$('#' + id_rfc_proveedor).val("");
	$('#' + id_direccion_proveedor).val("");
	$('#' + id_atiende_proveedor).val("");
	$('#' + id_telefono_proveedor).val("");

	$('#' + id_registrar_button_proveedor).removeClass("hidden");
	$('#' + id_editar_button_proveedor).addClass("hidden");
}

$('#' + id_ref_proveedor).change(function(){
	firebase.database().ref(rama_bd_proveedores + "/" + $(this).val()).once('value').then(function(snapshot){
		var prov = snapshot.val();
		if(prov != null){
			$('#' + id_razon_proveedor).val(prov.razonSocial);
			$('#' + id_rfc_proveedor).val(prov.RFC);
			$('#' + id_direccion_proveedor).val(prov.direccion);
			$('#' + id_atiende_proveedor).val(prov.atiende);
			$('#' + id_telefono_proveedor).val(prov.telefono);

			$('#' + id_registrar_button_proveedor).addClass("hidden");
			$('#' + id_editar_button_proveedor).removeClass("hidden");
		} else {
			clearFieldsProveedor();
		}
	});
});

$('#' + id_registrar_button_proveedor).click(function(){
	firebase.database().ref(rama_bd_compras + "/num_proveedores_id").once('value').then(function(snapshot){
		var max = parseInt($('#' + id_ref_proveedor).val());
		console.log(max);
		if(parseInt(snapshot.val()) < max){
			max++;
			firebase.database().ref(rama_bd_compras + "/num_proveedores_id").set(max);
		}
	});
	cargaProveedor();
	alert("Alta exitosa");
	$('#' + id_ref_proveedor).val("");
	clearFieldsProveedor();
});

$('#' + id_editar_button_proveedor).click(function(){
	cargaProveedor();
	alert("Edición exitosa");
	$('#' + id_ref_proveedor).val("");
	clearFieldsProveedor();
});

function cargaProveedor(){
	if($('#' + id_ref_proveedor).val() == "" || $('#' + id_razon_proveedor).val() == ""){
		alert("Llena todos los campos requeridos");
	} else {
		var prov = {
			razonSocial: $('#' + id_razon_proveedor).val(),
			RFC: $('#' + id_rfc_proveedor).val(),
			direccion: $('#' + id_direccion_proveedor).val(),
			atiende: $('#' + id_atiende_proveedor).val(),
			telefono: $('#' + id_telefono_proveedor).val(),
		}
		firebase.database().ref(rama_bd_proveedores + "/" + $('#' + id_ref_proveedor).val()).set(prov);
	}
}