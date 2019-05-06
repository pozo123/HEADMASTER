var id_file_importarProveedores = "importarProveedoresFile";
var id_button_guardar_importarProveedores = "importarProveedoresButton";
var id_filename_importarProveedores = "importarProveedoresLabelFile";

var rama_bd_proveedores = "compras/proveedores";
var rama_bd_compras = "compras";

var excelSeleccionado = "";
var fileName = "";

var id_max = 0;

$('#' + id_file_importarProveedores).on("change",(function(event) {
    //console.log("hola"); 
    excelSeleccionado = event.target.files[0];
    fileName = excelSeleccionado.name;
    $('#' + id_filename_importarProveedores).text(fileName)
}));

$('#' + id_button_guardar_importarProveedores).on("click",function() {
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
        var titulos = ["referencia","razonSocial","direccion","telefono","atiende","RFC"];
        var resultado = {};
        //console.log(json)
        for(key in json){
            if(key > 0){
                var proveedor = {};
                //console.log(json[key])
                for(i=1;i<titulos.length;i++){
                    proveedor[titulos[i]] = json[key][i] ? json[key][i] : "";
                }
                //console.log(json[key][uid_index])
                resultado[json[key][0]] = proveedor;
            }
        }
        console.log(resultado); 
        firebase.database().ref(rama_bd_compras).once('value').then(function(snapshot){
            var proveedores = snapshot.child("proveedores").val();
            for(key in resultado){
                if(key > id_max){
                    id_max = key;
                }
                if(proveedores[key]){
                    console.log("El proveedor con ID " + key + " ya existe en la base de datos");
                } else {
                    console.log(rama_bd_proveedores + "/" + key + ": " + resultado[key]);
                    firebase.database().ref(rama_bd_proveedores + "/" + key).set(resultado[key]);
                }
            }
            var num_proveedores = parseInt(proveedores.num_proveedores_id);
            if(id_max > num_proveedores){
                firebase.database().ref(rama_bd_compras + "/num_proveedores_id").set(id_max);
            }
            alert("Importación exitosa");
        });
    };
    reader.readAsArrayBuffer(excelSeleccionado);
});