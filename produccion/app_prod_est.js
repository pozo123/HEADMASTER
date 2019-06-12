var id_obras_ddl_est = "obrasDdlEst";
var id_table_est = "tableEst";
var id_file_est = "fotoEst";
var id_file_label_est = "fotoLabelEst";
var id_fecha_est = "fechaEst";
var id_actualizar_button_est = "acutalizarEst";

var rama_bd_obras = "obras";
var rama_storage_obras = "obras";

var tab_est = "tabEstimacion";

var tableEst = document.getElementById(id_table_est);
var fileSelectedEst;

$('#' + tab_est).click(function(){
	$('#' + id_file_label_est).text("Archivo no seleccionado");
	fileSelectedEst = "";

	jQuery('#' + id_fecha_est).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
	var select = document.getElementById(id_obras_ddl_est);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    var count = 0;
	var aut = (areas_usuario_global.administracion || creden_usuario_global < 3);
    var single = 0;
    for(key in nombre_obras){
        console.log(nombre_obras[key]);
        var obra = nombre_obras[key];
        var aut_local = false;
        if(!obra.terminada){
            if(!aut){
                for(sup in obra.supervisor){
                    if(sup == uid_usuario_global && obra.supervisor[sup].activo){
                        aut_local = true;
                        single++;
                    }
                }
            }
            if(aut || aut_local){
                var option2 = document.createElement('OPTION');
                option2.text = key;
                option2.value = key;
                select.appendChild(option2);
            }
        }
    }
    if(single == 1){
		select.selectedIndex = 1;
		$('#' + id_obras_ddl_est).addClass('hidden');
		loadTableEst();
	} else {
		$('#' + id_obras_ddl_est).removeClass('hidden');
	}
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
  cell7.innerHTML = "EST (%)";
  cell8.innerHTML = "TOTAL (%)";
}

$('#' + id_file_est).on("change", function(event){
    fileSelectedEst = event.target.files[0];
    $('#' + id_file_label_est).text(fileSelectedEst.name);
});

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
    cell_acu_cant.appendChild(acu_cant_label);
    cell_acu_porc.appendChild(acu_porc_label);
    cell_total.appendChild(total_label);

    var est_cant = document.createElement('input');
    est_cant.type = "text";
    est_cant.id = "est_cant_" + hojaSnap.key;
    est_cant.placeholder = "Cantidad estimada";

    var est_porc = document.createElement('input');
    est_porc.type = "text";
    est_porc.id = "est_porc_" + hojaSnap.key;
    est_porc.placeholder = "Porcentaje estimado";

    cell_est_cant.appendChild(est_cant);
    cell_est_porc.appendChild(est_porc);

    $('#' + est_cant.id).change(function(){
    	var nueva_est = isNaN(parseFloat($('#' + est_cant.id).val())) ? 0 : parseFloat($('#' + est_cant.id).val());
    	$('#' + est_porc.id).val((100 * nueva_est / ppto).toFixed(2) + "%");
    	total_label.innerHTML = (100 * (nueva_est + est) / ppto).toFixed(2) + "%";
    });

    $('#' + est_porc.id).change(function(){
    	var nuevo_porc = isNaN(parseFloat($('#' + est_porc.id).val())) ? 0 : parseFloat($('#' + est_porc.id).val());
    	$('#' + est_cant.id).val((ppto * nuevo_porc / 100).toFixed(2));
    	total_label.innerHTML = ((100 * est / ppto) + nuevo_porc).toFixed(2) + "%";
    });
}

$('#' + id_actualizar_button_est).click(function(){
	if($('#' + id_fecha_est).val() == "" || fileSelectedEst == "" || $('#' + id_obras_ddl_est + " option:selected").val() == "" || $('#' + id_file_label_est).text() == "Archivo no seleccionado"){
		alert("Llena todos los campos necesarios");
	} else {
		var storageRef = firebase.storage().ref(rama_storage_obras + "/" + $('#' + id_obras_ddl_est + " option:selected").val() + "/" + fileSelectedEst.name);
	    var uploadTask = storageRef.put(fileSelectedEst);
	    uploadTask.on('state_changed', function(snapshot){
	        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	        console.log('Upload is ' + progress + '% done');
	        switch (snapshot.state) {
	            case firebase.storage.TaskState.PAUSED: // or 'paused'
	            console.log('Upload is paused');
	            break;
	            case firebase.storage.TaskState.RUNNING: // or 'running'
	            console.log('Upload is running');
	            break;
	        }
	    }, function(error) {
	        // Handle unsuccessful uploads
	    }, function() {
	        // Handle successful uploads on complete
	        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
	        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obras_ddl_est + " option:selected").val()).once('value').then(function(snapshot){
					var obra_json = snapshot.val();
					var total = 0;
					$('[id^=est_cant_]').each(function(){
						var split = this.id.split("_");
						var proc = split[split.length - 1];
						var cant = realParse($('#' + this.id).val());
						total += cant;
						var path = proc.split("-");
						obra_json["procesos"][path[0]]["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["EST"] = parseFloat(obra_json["procesos"][path[0]]["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["EST"]) + cant;
						obra_json["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["EST"] = parseFloat(obra_json["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["EST"]) + cant;
						if(path.length > 1){
							obra_json["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["EST"] = parseFloat(obra_json["procesos"][path[0]]["subprocesos"][proc]["kaizen"]["ADMINISTRACION"]["ESTIMACIONES"]["EST"]) + cant;
						}
					});
					firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obras_ddl_est + " option:selected").val()).update(obra_json);
					alert("Operación exitosa");
					var estimacion = {
						fecha: new Date($('#' + id_fecha_est).val()).getTime(),
						pad: pistaDeAuditoria(),
						cantidad: total,
						url: downloadURL,
					}
					firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obras_ddl_est + " option:selected").val() + "/estimaciones").push(estimacion);
				});
	        });
	    });

	}
});