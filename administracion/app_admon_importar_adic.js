var id_file_importar_adic = "importarAdicionalesFile";
var id_file_label_importar_adic = "importarAdicionalesLabelFile";
var id_button_importar_adic = "importarAdicionalesButton";

var excelSeleccionadoAdic = "";
var fileNameAdic = "";

$('#' + id_file_importar_adic).on("change",function(event) {
    excelSeleccionadoAdic = event.target.files[0];
    fileNameAdic = excelSeleccionadoAdic.name;
    $('#' + id_file_label_importar_adic).text(fileNameAdic);
});

$('#' + id_button_importar_adic).on("click",function() {
	if(fileNameAdic == ""){
		alert("Selecciona un archivo");
	} else {
	    var reader = new FileReader();
	    var result = {};
	    var json = {};
	    reader.onload = function (e) {
	    	/*
	        var data = e.target.result;
	        data = new Uint8Array(data);
	        var workbook = XLSX.read(data, {type: 'array'});
	        json = {};
	        workbook.SheetNames.forEach(function (sheetName) {
	            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
	            if (roa.length) json = roa;
	        });
	        var uid_index = 0;
	        var titulos = [];
	        //hay que definir
	        var niveles = [0,"obra_asignada",0,0,"claves","claves","claves","info_personal","info_personal","info_personal","info_personal",0,"datos_bancarios","datos_bancarios","datos_bancarios",0,0,"tallas","tallas","tallas",0,0];
	        for(key in json[0]){
	            if(json[0][key] == "id_trabajadores") 
	                uid_index = key;
	            titulos[key] = json[0][key];
	        }
	        var resultado = {};
	        //console.log(json)
	        for(key in json){
	            if(key > 0){
	                var trabajador = {};
	                //console.log(json[key])
	                for(i=0;i<titulos.length;i++){
	                    var n = niveles[i];
	                    var k = titulos[i];
	                    //console.log(json[key][i])
	                    if(n != 0){
	                        var path = n.split("/");
	                        var pointer = trabajador;
	                        for(j = 0; j < path.length; j++){
	                            if(pointer[path[j]] == undefined){
	                                pointer[path[j]] = {};
	                            }
	                            pointer = pointer[path[j]];
	                        }
	                        if(!json[key][i]){
	                            pointer[k] = "";
	                        } else {
	                            pointer[k] = json[key][i];
	                        }
	                    } else {
	                        if(!json[key][i]){
	                            trabajador[k] = "";
	                        } else {
	                            trabajador[k] = json[key][i];
	                        }
	                    }
	                }
	                //console.log(json[key][uid_index])
	                resultado[json[key][uid_index]] = trabajador;
	            }
	        }
	        console.log(resultado); 
	        firebase.database().ref(rama_bd_rrhh).once('value').then(function(snapshot){
	            var trabajadores = snapshot.child("trabajadores").val();
	            for(key in resultado){
	                if(key > id_max){
	                    id_max = key;
	                }
	                if(trabajadores[key]){
	                    console.log("El trabajador con ID " + key + " ya existe en la base de datos");
	                } else {
	                    console.log(rama_bd_trabajadores + "/" + key + ": " + resultado[key]);
	                    firebase.database().ref(rama_bd_trabajadores + "/" + key).set(resultado[key]);
	                }
	            }
	            var num_trabajadores = parseInt(snapshot.child("num_trabajadores_id").val());
	            if(id_max > num_trabajadores){
	                firebase.database().ref(rama_bd_rrhh + "/num_trabajadores_id").set(id_max);
	            }
	            alert("Importación exitosa");
	        });*/
	    };
	    reader.readAsArrayBuffer(excelSeleccionadoAdic);
	}
});