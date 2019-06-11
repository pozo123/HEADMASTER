var id_ofi_cuadrilla = "ofiCuadrilla";
var id_mof_cuadrilla = "mofCuadrilla";
var id_ayu_cuadrilla = "ayuCuadrilla";
var id_enc_cuadrilla = "encCuadrilla";
var id_sup_cuadrilla = "supCuadrilla";

var id_actualizar_button_cuadrilla = "actualizarCuadrilla";

var rama_bd_costos_cuadrilla = "produccion/costos_cuadrilla";

var tab_cuadrilla = "tabCuadrillas";

$('#' + tab_cuadrilla).click(function(){
	firebase.database().ref(rama_bd_costos_cuadrilla).once('value').then(function(snapshot){
		var costos = snapshot.val();
		$('#' + id_ofi_cuadrilla).val(costos.ofi);
		$('#' + id_mof_cuadrilla).val(costos.mof);
		$('#' + id_ayu_cuadrilla).val(costos.ayu);
		$('#' + id_enc_cuadrilla).val(costos.enc);
		$('#' + id_sup_cuadrilla).val(costos.sup);
	});
});

$('#' + id_actualizar_button_cuadrilla).click(function(){
	var costos = {
		ofi = isNaN(parseFloat($('#' + id_ofi_cuadrilla).val())) ? 0 : parseFloat($('#' + id_ofi_cuadrilla).val()),
		mof = isNaN(parseFloat($('#' + id_mof_cuadrilla).val())) ? 0 : parseFloat($('#' + id_mof_cuadrilla).val()),
		ayu = isNaN(parseFloat($('#' + id_ayu_cuadrilla).val())) ? 0 : parseFloat($('#' + id_ayu_cuadrilla).val()),
		enc = isNaN(parseFloat($('#' + id_enc_cuadrilla).val())) ? 0 : parseFloat($('#' + id_enc_cuadrilla).val()),
		sup = isNaN(parseFloat($('#' + id_sup_cuadrilla).val())) ? 0 : parseFloat($('#' + id_sup_cuadrilla).val()),
	};
	firebase.database().ref(rama_bd_costos_cuadrilla).set(costos);
});