var id_obras_ddl_est = "obrasDdlEst";
var id_table_est = "tableEst";

var rama_bd_obras = "obras";

var tab_est = "tabEstimacion";

var tableEst = document.getElementById(id_table_est);

$('#' + tab_est).click(function(){
	var select = document.getElementById(id_obras_ddl_est);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    var count = 0;

	firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
		if(areas_usuario_global.administracion == true || creden_usuario_global < 3){
			snapshot.forEach(function(obraSnap){
				var obra = obraSnap.val();
				if(!obra.terminada){
					var option2 = document.createElement('option');
					option2.text = option2.value = obra.nombre; 
					select.appendChild(option2);
					count++;
				}
			});
		} else {
			snapshot.forEach(function(obraSnap){
				var obra = obraSnap.val();
				if(!obra.terminada){
					obraSnap.child("supervisor").forEach(function(supSnap){
						if(supSnap.key == uid_usuario_global && supSnap.child("activo").val()){
							var option2 = document.createElement('option');
							option2.text = option2.value = obra.nombre; 
							select.appendChild(option2);
							count++;
						}
					});
				}
			});
		}
		if(count == 1){
			select.selectedIndex = 1;
			$('#' + id_obras_ddl_est).addClass('hidden');
			loadTableEst();
		} else {
			$('#' + id_obras_ddl_est).removeClass('hidden');
		}
	});
});

$('#' + id_obras_ddl_est).change(function(){
	loadTableEst();
});

function loadTableEst(){
	headersEst();
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obras_ddl_est + " option:selected").val() + "/procesos").once('value').then(function(snapshot){
		snapshot.forEach(function(procSnap){
			if(procSnap.child("num_subprocesos").val() == 0 && procSnap.key != "ADIC" && procSnap.key != "PC00"){
				cargaRenglonEst(procSnap);
			} else {
				procSnap.child("subprocesos").forEach(function(subpSnap){
					cargaRenglonEst(subpSnap);
				});
			}
		});
	});
}

function headersEst() {
  var row = tableEst.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  cell1.innerHTML = "PROC";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "PPTO";
  cell4.innerHTML = "ACUMULADO ($)";
  cell5.innerHTML = "ACUMULADO (%)";
  cell6.innerHTML = "EST ($)";
  cell7.innerHTML = "EST ($)";
  cell8.innerHTML = "TOTAL (%)";
}

function cargaRenglonEst(hojaSnap){
	var est = hojaSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/EST").val();
	est = isNaN(parseFloat(est)) ? 0 : parseFloat(est);
	var ppto = hojaSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/PPTO").val();
	ppto = isNaN(parseFloat(ppto)) ? 0 : parseFloat(ppto);

	var row = tableEst.insertRow();
	var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_ppto = row.insertCell(2);
    var cell_acu_cant = row.insertCell(3);
    var cell_acu_porc = row.insertCell(4);
    var cell_est_cant = row.insertCell(5);
    var cell_est_porc = row.insertCell(6);
    var cell_total = row.insertCell(7);
    
    var id_label = document.createElement('label');
    id_label.innerHTML = hojaSnap.key;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = hojaSnap.child("nombre").val();
    var ppto_label = document.createElement('label');
    ppto_label.innerHTML = formatMoney(ppto);
    var acu_cant_label = document.createElement('label');
    acu_cant_label.innerHTML = formatMoney(est);
    var acu_porc_label = document.createElement('label');
    acu_porc_label.innerHTML = (100 * est / ppto).toFixed(2) + "%";
    var total_label = document.createElement('label');
    total_label.innerHTML = (100 * est / ppto).toFixed(2) + "%";
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);
    cell_ppto.appendChild(ppto_label);
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(acu_porc_label);
    cell_total.appendChild(total_label);

    var est_cant = document.createElement('input');
    est_cant.type = "text";
    est_cant.id = "est_cant_" + hojaSnap.key;
    est_cant.placeholder = "Cantidad estimada";

    var cell_est_porc = document.createElement('input');
    cell_est_porc.type = "text";
    cell_est_porc.id = "est_porc_" + hojaSnap.key;
    cell_est_porc.placeholder = "Porcentaje estimado";
    
    $('#' + est_cant.id).change(function(){
    	var nueva_est = isNaN(parseFloat($('#' + est_cant.id).val())) ? 0 : parseFloat($('#' + est_cant.id).val());
    	$('#' + cell_est_porc.id).val((100 * nueva_est / ppto).toFixed(2) + "%");
    	total_label.innerHTML = (100 * (nueva_est + est) / ppto).toFixed(2) + "%";
    });

    cell_est_cant.appendChild(est_cant);
    cell_cell_est_porc.appendChild(cell_est_porc);
    
}