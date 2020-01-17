// -----------------------------------------------------------------
// -----------------------------------------------------------------
// -------------------- CONTRATOS OBRA -----------------------------
// -----------------------------------------------------------------
// -----------------------------------------------------------------

var id_tab_contratos_obra = "tabContratosObra";
var id_dataTable_contratos_obra = "dataTableContratosObra";

var id_ddl_obra_contratos_obra = "obraContratosObra";
var id_input_monto_contratos_obra = "montoContratosObra";
var id_input_fecha_contratos_obra = "fechaAutorizacionContratosObra";
var id_textarea_info_contratos_obra = "infoAdicionalContratosObra";
var id_file_label_contratos_obra = "fileLabelContratosObra";
var id_file_input_contratos_obra = "fileInputContratosObra";
var id_button_actualizar_contratos_obra = "actualizarButtonContratosObra";

var id_div_container_dataTable_contratos_obra = "containerDataTableContratosObra";
var file_selected_contratos_obra = "";

$('#' + id_tab_contratos_obra).click(function() {
    $('#' + id_div_container_dataTable_contratos_obra).addClass('hidden');
    resetFormContratosObra();
    $('#' + id_ddl_obra_contratos_obra).empty();
    var obra_select = document.getElementById(id_ddl_obra_contratos_obra);

    jQuery('#' + id_input_fecha_contratos_obra).datetimepicker(
        {timepicker:false, weeks:true,format:'Y.m.d'}
    );
    
    var option1 = document.createElement('option');
    option1.style = "display:none";
    option1.text = option1.value = "";
    obra_select.appendChild(option1);
    
    firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').on('child_added',function(snapshot){
        obra = snapshot.val();
        option_asignada = document.createElement('option');
        option_asignada.value = snapshot.key;
        option_asignada.text = obra.nombre;
        obra_select.appendChild(option_asignada);
    });

    dataTableContratosObra();
});

// ----------------------------------------------
// funcionalidad;
// ----------------------------------------------

$('#' + id_ddl_obra_contratos_obra).change(function(){
    // buscar el registro de la obra y en caso de que exista, escribir el monto en su campo
    var obra_selected = $('#' + id_ddl_obra_contratos_obra + " option:selected").val();

    $('#' + id_input_monto_contratos_obra).val('');
    $('#' + id_input_fecha_contratos_obra).val('');
    $('#' + id_textarea_info_contratos_obra).val('');

    file_selected_contratos_obra = "";

    $('#' + id_file_label_contratos_obra).text("Archivo no seleccionado");
    $('#' + id_file_label_contratos_obra).attr("style", "color: black");
    $('#' + id_file_input_contratos_obra).val("");

    firebase.database().ref(rama_bd_obras + "/contratos/" + obra_selected).once("value").then(function(snapshot){
        if(snapshot.exists()){
            var contrato = snapshot.val();
            $('#' + id_input_monto_contratos_obra).val(formatMoney(contrato.monto_autorizado));

            // fecha
            var fecha_string = new Date(contrato.fecha_autorizacion);
            $('#' + id_input_fecha_contratos_obra).val(fecha_string.getFullYear() + "." + ("0" + (fecha_string.getMonth() + 1)).slice(-2)  + "." + ("0" + fecha_string.getDate()).slice(-2));

            // info_adicional
            $('#' + id_textarea_info_contratos_obra).val(contrato.info_adicional);

            highLight(id_input_monto_contratos_obra);
            highLight(id_textarea_info_contratos_obra);
        };
    });
});

$('#' + id_button_actualizar_contratos_obra).click(function(){
    // En esta app revisaré directo en la base de datos si existe el registro deseado
    var obra_selected = $('#' + id_ddl_obra_contratos_obra + " option:selected").val();
    firebase.database().ref(rama_bd_obras + "/contratos/" + obra_selected).once("value").then(function(snapshot){
        if(snapshot.exists()){
            var contrato_previo = snapshot.val();
            // primer caso: existe en la base de datos, por lo que será un edit 
            if(validateFormContratosObra(true)){
                if(file_selected_contratos_obra == ""){
                    // no se modifica el archivo evidencia. Solo se modifica el monto autorizado y la fecha de autorizacion
                    var key = obra_selected;

                    var monto_selected = deformatMoney($('#' + id_input_monto_contratos_obra).val());
    
                    var fecha_aux = $('#' + id_input_fecha_contratos_obra).val().split('.');
                    var fecha_selected = new Date(fecha_aux[0], fecha_aux[1] - 1, fecha_aux[2]).getTime();

                    var info_selected = $('#' + id_textarea_info_contratos_obra).val();

                    var json_update = {
                        monto_autorizado: monto_selected,
                        fecha_autorizacion: fecha_selected,
                        url_file: contrato_previo.url_file,
                        info_adicional:  info_selected
                    };

                    // subir a firebase database el pago
                    firebase.database().ref(rama_bd_obras + "/contratos/" + key).set(json_update);

                    // pda
                    pda("modificación", rama_bd_obras + "/contratos/" + key, contrato_previo);
                    resetFormContratosObra();
                    alert("Se realizó con exito la modificación del registro seleccionado.");
                } else {
                    var key = obra_selected;
                    // subir archivo evidencia a firebase storage
                    var storageRef = firebase.storage().ref(rama_bd_obras + "/contratos/" + key + "/" + file_selected_contratos_obra.name);
                    var uploadTask = storageRef.put(file_selected_contratos_obra);
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
                        console.log(error);
                        alert("Se ha generado un error al momento de dar de alta el registro.")
                    }, function() {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            
                            var monto_selected = deformatMoney($('#' + id_input_monto_contratos_obra).val());
    
                            var fecha_aux = $('#' + id_input_fecha_contratos_obra).val().split('.');
                            var fecha_selected = new Date(fecha_aux[0], fecha_aux[1] - 1, fecha_aux[2]).getTime();

                            var info_selected = $('#' + id_textarea_info_contratos_obra).val();
    
                            var json_update = {
                                monto_autorizado: monto_selected,
                                fecha_autorizacion: fecha_selected,
                                url_file: downloadURL,
                                info_adicional:  info_selected
                            };
    
    
                            // subir a firebase database el pago
                            firebase.database().ref(rama_bd_obras + "/contratos/" + key).set(json_update);
    
                            // pda
                            pda("modificación", rama_bd_obras + "/contratos/" + key, contrato_previo);
                            resetFormContratosObra();
                        }).then(function(){
                            alert("Se realizó con exito la modificación del registro seleccionado.");
                        });
                    });
                };
            };
        } else {
            // no existe en la base de datos y se hará el push;
            // si no existe, el documento evidencia es obligatorio.
            if(validateFormContratosObra(false)){
                var key = obra_selected;
                // subir archivo evidencia a firebase storage
                var storageRef = firebase.storage().ref(rama_bd_obras + "/contratos/" + key + "/" + file_selected_contratos_obra.name);
                var uploadTask = storageRef.put(file_selected_contratos_obra);
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
                    console.log(error);
                    alert("Se ha generado un error al momento de dar de alta el registro.")
                }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        
                        var monto_selected = deformatMoney($('#' + id_input_monto_contratos_obra).val());

                        var fecha_aux = $('#' + id_input_fecha_contratos_obra).val().split('.');
                        var fecha_selected = new Date(fecha_aux[0], fecha_aux[1] - 1, fecha_aux[2]).getTime();

                        var info_selected = deformatMoney($('#' + id_textarea_info_contratos_obra).val());

                        var json_update = {
                            monto_autorizado: monto_selected,
                            fecha_autorizacion: fecha_selected,
                            url_file: downloadURL,
                            info_adicional:  info_selected
                        };

                        // subir a firebase database el pago
                        firebase.database().ref(rama_bd_obras + "/contratos/" + key).set(json_update);

                        // pda
                        pda("alta", rama_bd_obras + "/contratos/" + key, "");
                        resetFormContratosObra();
                    }).then(function(){
                        alert("Se realizó con exito el alta del registro seleccionado.");
                    });
                });
            };
        };
    });
});



// ----------------------------------------------
// métodos auxiliares;
// ----------------------------------------------

// función que selecciona el archivo evidencia
$('#' + id_file_input_contratos_obra).on("change", function(event){
    file_selected_contratos_obra = event.target.files[0];
    $('#' + id_file_label_contratos_obra).text(file_selected_contratos_obra.name);
    $('#' + id_file_label_contratos_obra).attr("style", "color: #A7C5A1");
});


// método para solo permitir los caracteres correctos en monto
$('#' + id_input_monto_contratos_obra).keypress(function(e){
    charactersAllowed("$1234567890,.",e);
});


// método para eliminar espacios blancos
$('#' + id_textarea_info_contratos_obra).change(function(){
    var text = deleteBlankSpaces(id_textarea_info_contratos_obra).toUpperCase();
    $('#' + id_textarea_info_contratos_obra).val(text);
});

// método que da formato al campo de monto
$('#' + id_input_monto_contratos_obra).change(function(){
    var deformat_monto = deformatMoney($('#' + id_input_monto_contratos_obra).val());
    $('#' + id_input_monto_contratos_obra).val(formatMoney(deformat_monto));
});

// método para resetear el formulario
function resetFormContratosObra(){
    $('#' + id_ddl_obra_contratos_obra).val('');
    $('#' + id_input_monto_contratos_obra).val('');
    $('#' + id_input_fecha_contratos_obra).val('');
    $('#' + id_textarea_info_contratos_obra).val('');

    file_selected_contratos_obra = "";

    $('#' + id_file_label_contratos_obra).text("Archivo no seleccionado");
    $('#' + id_file_label_contratos_obra).attr("style", "color: black");
    $('#' + id_file_input_contratos_obra).val("");
}

function validateFormContratosObra(existe_contrato_previo){
    var valido = true;
    if($('#' + id_ddl_obra_contratos_obra).val() == ""){
        valido = false;
        alert("Selecciona la obra correspondiente")
    } else if($('#' + id_input_monto_contratos_obra).val() == ""){
        valido = false;
        alert("Escribe el monto del pago correspondiente");
    } else if($('#' + id_input_fecha_contratos_obra).val() == ""){
        valido = false;
        alert("Selecciona la fecha de autorización");
    } else if(file_selected_contratos_obra == "" && existe_contrato_previo == false){
        valido = false;
        alert("Agrega un documento evidencia del monto autorizado");
    }
    return valido;
};

function dataTableContratosObra(){
    firebase.database().ref(rama_bd_obras).on("value", function(snapshot){
        console.log(1);
        var datos = [];
        if(snapshot.child("contratos").exists()){
            firebase.database().ref(rama_bd_clientes + "/despachos").once("value").then(function(clienteSnapshot){
                $('#' + id_div_container_dataTable_contratos_obra).removeClass('hidden');
    
                  // recorro por todos los contratos
                snapshot.child("contratos").forEach(function(contratoSnap){
                    // llenar datos, solo si la obra está activa
                    if(snapshot.child("listas/obras_activas/" + contratoSnap.key).val() != null){
                        var obra = snapshot.child("listas/obras_activas/" + contratoSnap.key).val().nombre;
                        var contrato = contratoSnap.val();
                        var cliente_id = snapshot.child("obras/" + contratoSnap.key).val().id_cliente;
                        
                        var nombre_cliente = clienteSnapshot.child(cliente_id).val().clave_cliente;
                        console.log(nombre_cliente);

                        // obtener monto de venta si existe y calcular descuento
                        // PENDIENTE
                        // --------------
                        
                        datos.push([
                            obra,
                            contrato.info_adicional,
                            nombre_cliente,
                            "No disponible",
                            formatMoney(contrato.monto_autorizado),
                            "No disponible",
                            // utilizo el mismo formato que en pagosCliente
                            new Date(contrato.fecha_autorizacion).toLocaleDateString("es-ES", optionsPagoCliente),
                            "<button type='button' class='btn btn-dark' onclick='showFile(" + "\`" + contrato.url_file + "\`" + ")'><i class='fas fa-file'></i></button>",
                        ]);
                    };
                });

                console.log(datos);
                tabla_contratos_obra = $('#'+ id_dataTable_contratos_obra).DataTable({
                    destroy: true,
                    "order": [[ 0, "asc" ]],
                    data: datos,
                    language: idioma_espanol,
                    "columnDefs": [
                        {
                            targets: 2,
                            className: 'dt-body-center'
                        },
                        {
                            targets: 3,
                            className: 'dt-body-center'
                        },
                        {
                            targets: 4,
                            className: 'dt-body-center'
                        },
                        {
                            targets: 5,
                            className: 'dt-body-center'
                        },
                      ],
                      dom: 'Bfrtip',
                      buttons: [
                        {extend: 'excelHtml5',
                        title: "montos_contratados",
                        exportOptions: {
                            columns: [':visible']
                        }},
                      ],
                      //"paging":false,
                });

                // aquí termina firebase
            });
        };
    });
};