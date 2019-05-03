var id_file_importarTrabajadores = "importarTrabajadoresFile";
var id_button_guardar_importarTrabajadores = "importarTrabajadoresButton";
var id_filename_importarTrabajadores = "importarTrabajadoresLabelFile";

var rama_bd_trabajadores = "produccion/trabajadores";

var excelSeleccionado = "";
var fileName = "";

var id_max = 0;

$('#' + id_file_importarTrabajadores).on("change",(function(event) {
    //console.log("hola"); 
    excelSeleccionado = event.target.files[0];
    fileName = excelSeleccionado.name;
    $('#' + id_filename_importarTrabajadores).text(fileName)
}));

$('#' + id_button_guardar_importarTrabajadores).on("click",function() {
    var reader = new FileReader();
    var result = {};
    var json = {};
    reader.onload = function (e) {
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
        //AQUI hay que definir
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
        firebase.database().ref(rama_bd_trabajadores).once('value').then(function(snapshot){
            var trabajadores = snapshot.val();
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
            var num_trabajadores = parseInt(trabajadores.num_trabajadores_id);
            if(id_max > num_trabajadores){
                firebase.database().ref(rama_bd_trabajadores + "/num_trabajadores_id").set(id_max);
            }
        });
    };
    reader.readAsArrayBuffer(excelSeleccionado);
});