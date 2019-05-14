var id_obra_ddl_imprimir = "DDL_obra_imp";
var id_proceso_ddl_imprimir = "DDL_presupuesto_imp";
var id_consecutivo_ddl_imprimir = "DDL_consecutivo_imp";
var id_consecutivo_group_imprimir = "group_consecutivo_imp";
var id_imprimir_button_imprimir = "imprimir_presu";

var rama_bd_obras = "obras";

$('#tabImprimirPresupuesto').click(function(){
    var select = document.getElementById(id_obra_ddl_imprimir);
    $('#' + id_consecutivo_ddl_imprimir).empty();
    $('#' + id_consecutivo_group_imprimir).addClass("hidden");
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option3 = document.createElement('option');
        option3.text = option3.value = obra.nombre; 
        select.appendChild(option3);
    });    
});

$('#' + id_obra_ddl_imprimir).change(function(){
    $('#' + id_proceso_ddl_imprimir).empty();
    $('#' + id_consecutivo_ddl_imprimir).empty();
    $('#' + id_consecutivo_group_imprimir).addClass("hidden");
    var select = document.getElementById(id_proceso_ddl_imprimir);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val() + "/procesos/PC00/subprocesos").orderByKey().on('child_added',function(snapshot){
        var presu = snapshot.key;
        var option2 = document.createElement('option');
        option2.text = presu + " (" + snapshot.child("nombre").val() + ")";
        option2.value = presu; 
        select.appendChild(option2);
    });
});

$('#' + id_proceso_ddl_imprimir).change(function(){
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
});

$('#' + id_imprimir_button_imprimir).click(function () {
    var consec = $('#' + id_consecutivo_ddl_imprimir + " option:selected").val() == undefined ? 0 : $('#' + id_consecutivo_ddl_imprimir + " option:selected").val();
    firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_imprimir + " option:selected").val() + "/procesos/PC00/subprocesos/" + $('#' + id_proceso_ddl_imprimir + " option:selected").val() + "/presupuesto/archivos/" + consec + "/pdf").once('value').then(function(snapshot){
        var pdf = snapshot.val();

        var downloadLink = document.createElement('a');
        downloadLink.target   = '_blank';
        downloadLink.download = $('#' + id_proceso_ddl_imprimir + " option:selected").val() + '.pdf';

        var URL = window.URL || window.webkitURL;
        var downloadUrl = pdf;

        // set object URL as the anchor's href
        downloadLink.href = downloadUrl;

        // append the anchor to document body
        document.body.appendChild(downloadLink);

        // fire a click event on the anchor
        downloadLink.click();

        // cleanup: remove element and revoke object URL
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadUrl);
    });
});