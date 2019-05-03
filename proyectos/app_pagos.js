
var nombre_tab_pago = "tabPagos";
var id_obra_ddl_pagos = "obrasDdlPagos";
var id_presupuestos_ddl_pagos = "pptoDdlPagos";
var id_guardar_button_pagos = "guardarPago";
var id_monto_pagos = "montoPagos";
var id_concepto_pagos = "conceptoPagos";
var id_fecha_pagos = "fechaPagos";

var input_pagoArchivo = "pagoArchivo";
var archivoSeleccionado = "";
var label_archivoSeleccionado = "label_pago";

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
jQuery.datetimepicker.setLocale('es');

var rama_bd_obras = "proyectos/obras";
var rama_storage_pagos = "proyectos/pagos"

$('#' + nombre_tab_pago).click(function(){
    
    jQuery('#' + id_fecha_pagos).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
        );
        
        var select = document.getElementById(id_obra_ddl_pagos);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);
        //var option2 = document.createElement('option');
        //option2.text = option2.value = "Miscelaneo";
        //select.appendChild(option2);
        
        firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
            
            var obra = snapshot.val();
            var option3 = document.createElement('option');
            option3.text = option3.value = obra.nombre; 
            select.appendChild(option3);
            
        });  
    });
    
    function loadDDLPresupuestosPagos(){
        $('#' + id_presupuestos_ddl_pagos).empty();
        var select = document.getElementById(id_presupuestos_ddl_pagos);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);
        firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos").orderByKey().on('child_added',function(snapshot){
            var presu = snapshot.key;
            var option2 = document.createElement('option');
            option2.text = option2.value = presu; 
            select.appendChild(option2);
        });  
    };

    $('#' + input_pagoArchivo).on("change", function(event){
        archivoSeleccionado = event.target.files[0];
        $('#' + label_archivoSeleccionado).text(archivoSeleccionado.name)
        $('#' + label_archivoSeleccionado).addClass("text-success");
    });

    $('#borrarPago').click(function(){
        archivoSeleccionado = "";
    });
    
    
    $('#' + id_guardar_button_pagos).click(function () {
        
        var fecha_pago_inicial = new Date($('#' + id_fecha_pagos).val());
        var fecha_pago_timestamp = fecha_pago_inicial.getTime();
        
        if($('#' + id_fecha_pagos).val() === "" || $('#' + id_obra_ddl_pagos + " option:selected").val() === "" || $('#' + id_presupuestos_ddl_pagos + " option:selected").val() === "" || $('#' + id_monto_pagos).val() === "" || $('#' + id_concepto_pagos).val() === "" ){
            alert("Llena todos los campos esenciales");
        } else {

            


            var pago = {
                fecha_timestamp: fecha_pago_timestamp,
                fecha_dia: new Date(fecha_pago_timestamp).toLocaleDateString("es-ES", options),
                monto: $('#' + id_monto_pagos).val(),
                concepto: $('#' + id_concepto_pagos).val(),
                imagen: "",
                cu: ""
            }
            var ref_cu = firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/pagos").push(pago);
            var cu = ("" + ref_cu).substring(("" + ref_cu).length - 20, (""+ref_cu).length);
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/pagos/" + cu + "/cu").set(cu);


            // IMAGEN
            var fileName = archivoSeleccionado.name;
            if(fileName){

                var storageRef = firebase.storage().ref(rama_storage_pagos + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/" + fileName);
            
                var uploadTask = storageRef.put(archivoSeleccionado);
                
                
                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                        console.log('File available at', downloadURL);
                        var updates = {}
                        var data = {
                            url: downloadURL,
                            uploadUser: userUID,
                        }
                        updates["/" + rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/pagos/" + cu + "/imagen"] = data;
                        firebase.database().ref().update(updates);
                    });
                });
            }

            //
            
            
            
            firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val()).once('value').then(function(snapshot){
                var presu = snapshot.val();
                var monto_nuevo = $('#' + id_monto_pagos).val();
                if(presu.cash_pagado != null){
                    monto_nuevo = parseFloat(monto_nuevo) + parseFloat(presu.cash_pagado);
                }
                firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_pagos + " option:selected").val() + "/presupuestos/" + $('#' + id_presupuestos_ddl_pagos + " option:selected").val() + "/cash_pagado").set(monto_nuevo);
            });
            alert("Pago guardado de manera exitosa");
        }
    });
    //
    //