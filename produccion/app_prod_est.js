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
  var cell4 = row.insertCell(2);
  var cell5 = row.insertCell(2);
  var cell6 = row.insertCell(2);
  var cell7 = row.insertCell(2);
  cell1.innerHTML = "PROC";
  cell2.innerHTML = "NOMBRE";
  cell3.innerHTML = "ACUMULADO ($)";
  cell4.innerHTML = "ACUMULADO (%)";
  cell5.innerHTML = "EST ($)";
  cell6.innerHTML = "EST ($)";
  cell7.innerHTML = "TOTAL (%)";
}

function cargaRenglonEst(hojaSnap){
	var est = hojaSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/EST").val();
	est = isNaN(parseFloat(est)) ? 0 : parseFloat(est);
	var ppto = hojaSnap.child("kaizen/ADMINISTRACION/ESTIMACIONES/EST").val();
	ppto = isNaN(parseFloat(ppto)) ? 0 : parseFloat(ppto);

	var row = tableEst.insertRow();
	var cell_id = row.insertCell(0);
    var cell_nombre = row.insertCell(1);
    var cell_acu_cant = row.insertCell(2);
    var cell_acu_porc = row.insertCell(3);
    var cell_est_cant = row.insertCell(4);
    var cell_est_porc = row.insertCell(5);
    var cell_total = row.insertCell(6);
    /*
    var id_label = document.createElement('label');
    id_label.innerHTML = hojaSnap.key;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = hojaSnap.child("nombre").val();
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);

    var acu_cant_label = document.createElement('label');
    acu_cant_label.innerHTML = ;
    var nombre_label = document.createElement('label');
    nombre_label.innerHTML = hojaSnap.child("nombre").val();
    cell_id.appendChild(id_label);
    cell_nombre.appendChild(nombre_label);

    var lala = document.createElement('input');
    lala.type = "text";
    lala.id = "" + ;
    lala.placeholder = "";
    cell_lele.appendChild(lala);

    var lala = document.createElement('input');
    lala.type = "text";
    lala.id = "" + ;
    lala.placeholder = "";
    cell_lele.appendChild(lala);
    */
}