var id_obra_ddl_pag_compras = "obraDdlPagCompras"
var id_solped_ddl_pag_compras = "solpedDdlPagCompras"
var id_odec_ddl_pag_compras = "odecDdlPagCompras"
var id_tipo_ddl_pag_compras = "tipoDdlPagCompras"

var id_cantidad_pag_compras = "cantidadPagCompras";
var id_num_factura_group_pag_compras = "numFacturaGroupPagCompras";
var id_num_factura_pag_compras = "numFacturaPagCompras";
var id_notas_pag_compras = "notasPagCompras";

var id_fecha_pag_compras = "fechaPagCompras";
var id_comprobante_file_pag_compras = "comprobanteFilePagCompras";
var id_comprobante_label_pag_compras = "comprobanteLabelPagCompras";
var id_acutalizar_button_pag_compras = "actualizarPagCompras";

var rama_bd_obras = "obras";

var id_tab_pag_compras = "tabPagosCompras";

var query;
var fileSeleccionado = "";
var tipos_pago_compras = [
	{text: "Efectivo", value: "EF"},
	{text: "Credito", value: "CR"},
	{text: "Contado", value: "CO"},
	{text: "Cheque", value: "CH"},
	{text: "Devolucion", value: "DE"},
	{text: "Nota de Credito", value: "NC"},
];

$('#' + id_tab_pag_compras).click(function(){
	$('#' + id_obra_ddl_pag_compras).empty();
	$('#' + id_solped_ddl_pag_compras).empty();
	$('#' + id_odec_ddl_pag_compras).empty();
	$('#' + id_tipo_ddl_pag_compras).empty();
	$('#' + id_num_factura_group_pag_compras).addClass('hidden');

	jQuery('#' + id_fecha_pag_compras).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    var select = document.getElementById(id_tipo_ddl_pag_compras);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    for(i=0;i<tipos_pago_compras.length;i++){
		var option2 = document.createElement('option');
	    option2.text = tipos_pago_compras[i]["text"];
	    option2.value = tipos_pago_compras[i]["value"];
	    select.appendChild(option2);
    }

    var select2 = document.getElementById(id_obra_ddl_pag_compras);
    var option4 = document.createElement('option');
    option4.style = "display:none";
    option4.text = option.value = "";
    select2.appendChild(option4);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
	        var option3 = document.createElement('OPTION');
	        option3.text = obra.nombre;
	        option3.value = obra.nombre;
	        select2.appendChild(option3);
	    }
    });
});

$("#" + id_obra_ddl_pag_compras).change(function(){
	$('#' + id_solped_ddl_pag_compras).empty();
	subprocs = [];
    var select = document.getElementById(id_solped_ddl_pag_compras);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val()).once('value').then(function(snapshot){
		snapshot.child("procesos").forEach(function(procSnap){
			if(procSnap.child("num_subprocesos").val() == 0 || $('#' + id_obra_ddl_pag_compras + " option:selected").val() == "IQONO MEXICO"){
				procSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
					var solped = solpedSnap.val();
			    	var option2 = document.createElement('OPTION');
			        option2.text = solpedSnap.key;
			        option2.value = procSnap.key + "/contrato_compras/solpeds/" + solpedSnap.key;
			        select.appendChild(option2);
			        if($('#' + id_obra_ddl_pag_compras + " option:selected").val() == "IQONO MEXICO"){
			        	subprocs[solpedSnap.key] = solpedSnap.child("subproceso").val();
			        }
				});
			} else {
				procSnap.child("subprocesos").forEach(function(subpSnap){
					subpSnap.child("contrato_compras/solpeds").forEach(function(solpedSnap){
						var solped = solpedSnap.val();
				    	var option2 = document.createElement('OPTION');
				        option2.text = solpedSnap.key;
				        option2.value = procSnap.key + "/subprocesos/" + subpSnap.key + "/contrato_compras/solpeds/" + solpedSnap.key;
				        select.appendChild(option2);
					});
				});
			}
		});
	});
});

$('#' + id_tipo_ddl_pag_compras).change(function(){
	if($('#' + id_tipo_ddl_pag_compras).val() == "CR"){
		$('#' + id_num_factura_group_pag_compras).removeClass('hidden');
	} else {
		$('#' + id_num_factura_group_pag_compras).addClass('hidden');
	}
});

$('#' + id_solped_ddl_pag_compras).change(function(){
	$('#' + id_odec_ddl_pag_compras).empty();
    var select = document.getElementById(id_odec_ddl_pag_compras);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pag_compras + " option:selected").val() + "/procesos/" + $('#' + id_solped_ddl_pag_compras + " option:selected").val() + "/odecs").once('value').then(function(snapshot){
    	snapshot.forEach(function(odecSnap){
    		var odec = odecSnap.val();
	    	var option2 = document.createElement('OPTION');
	        option2.text = odecSnap.key;
	        option2.value = odecSnap.key;
	        select.appendChild(option2);
    	});
    });
});

$('#' + id_comprobante_file_pag_compras).on("change", function(event){
    fileSeleccionado = event.target.files[0];
    $('#' + id_comprobante_label_pag_compras).text(fileSeleccionado.name);
});

$('#' + id_acutalizar_button_pag_compras).click(function(){
	//Subir pago a su OdeC
	//añadir valores a kaizen
	//Si tipo es devolucion o nota de credito entonces se resta tanto en:
	//la odec (sumar como pago pero como es tipo queda claro que es negativo?)
	//como en kaizen-odec (y pag?)
});