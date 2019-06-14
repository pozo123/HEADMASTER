var id_obra_ddl_imprimir = "DDL_obra_imp";
var id_proceso_ddl_imprimir = "DDL_presupuesto_imp";
var id_imprimir_button_imprimir = "imprimir_presu";

var rama_bd_obras = "obras";

$('#tabImprimirPresupuesto').click(function(){
    var select = document.getElementById(id_obra_ddl_imprimir);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    for(key in nombre_obras){
        var option3 = document.createElement('option');
        option3.text = option3.value = key; 
        select.appendChild(option3);
    }   
});

$('#' + id_obra_ddl_imprimir).change(function(){
    $('#' + id_proceso_ddl_imprimir).empty();
    var select = document.getElementById(id_proceso_ddl_imprimir);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    for(key in nombre_obras[$('#' + id_obra_ddl_imprimir + " option:selected").val()]["procesos"]["PC00"]["subprocesos"]){
        var option2 = document.createElement('option');
        option2.text = key + " (" + nombre_obras[$('#' + id_obra_ddl_imprimir + " option:selected").val()]["procesos"]["PC00"]["subprocesos"][key].nombre + ")";
        option2.value = key; 
        select.appendChild(option2);

    }
});

/*$('#' + id_proceso_ddl_imprimir).change(function(){
    $('#' + id_consecutivo_ddl_imprimir).empty();
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val() + "procesos/PC00/subprocesos/" 
        + $('#' + id_proceso_ddl_imprimir + " option:selected").val() + "/presupuesto").once('value').then(function(snapshot){        
        var archivo = snapshot.child("archivos");
        if(parseInt(archivo.numChildren()) > 1){
            $('#' + id_consecutivo_group_imprimir).removeClass("hidden");
            var select = document.getElementById(id_consecutivo_ddl_imprimir);
            var option = document.createElement('option');
            option.style = "display:none";
            option.text = option.value = "";
            select.appendChild(option);
        } else {
            $('#' + id_consecutivo_group_imprimir).addClass("hidden");
        }
        archivo.forEach(function(childSnap){
            var option2 = document.createElement('option');
            option2.text = childSnap.key + " (" + new Date(childSnap.child("pda/timestamp").val()).toLocaleDateString() + ")"
            option2.value = childSnap.key;
            select.appendChild(option2);                
        });
    })
});*/

$('#' + id_imprimir_button_imprimir).click(function () {
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val()).once('value').then(function(snapshot){
        var ppto = snapshot.child("procesos/PC00/subprocesos/" + $('#' + id_proceso_ddl_imprimir + " option:selected").val() + "/presupuesto").val();
        var alcance = [];
        for(key in ppto.json_alcance){ 
            alcance.push({
                texto: ppto.json_alcance[key].texto,
                precio: ppto.json_alcance[key].precio,
            });
        }
        console.log(ppto);
        var ppto_pdf = generaPptoProy(true, $('#' + id_proceso_ddl_imprimir + " option:selected").val(), snapshot.val(), alcance, new Date(ppto.fecha_ppto), ppto.titulo_ppto, ppto.tiempoEntrega, ppto.fisc_bool, ppto.banc_bool, ppto.reqs_lista, ppto.exc_lista, ppto.atn_lista, ppto.anticipo);
        var pdfPresupuesto = ppto_pdf[0];
        const pdfDocGenerator = pdfMake.createPdf(pdfPresupuesto)
        pdfDocGenerator.open();
    });
});