// id's de los elementos HTML
var id_tab_diversos_nomina = "tabDiversos";
var id_form_diversos_nomina = "formDiversos";
var id_dataTable_diversos_nomina = "dataTableDiverso";

var id_reset_diversos_nomina = "borrarButtonDiverso";
var id_agregar_diversos_nomina = "agregarButtonDiverso";

var id_diverso_diversos_nomina= "diversoDiverso";

// Variables globales

var existe_diverso= false;
var id_diverso_existente = "";

// Lo necesario para inicializar la pestaña (se hace al seleccionar la pestaña)
// se resetea el formulario (ver en funciones)
// se llena la tabla con todos los colaboradores

$('#' + id_tab_diversos_nomina).click(function() {
    resetFormDiversos();  
    actualizarTablaDiversos();      
});

// al apretar el botón de resetear, se resetea todo el formulario
$('#' + id_reset_diversos_nomina).click(function(){
    resetFormDiversos();
})

$('#' + id_agregar_diversos_nomina).click(function(){
    if(!validateDiversos()){
        return;
    }
    if (existe_diverso){
        firebase.database().ref(rama_bd_datos_referencia + "/diversos/" + id_diverso_existente).once("value").then(function(snapshot){
            var registro_antiguo = snapshot.val();
            
            var diverso_update = {};
            diverso_update["diversos/" + id_diverso_existente] = $('#' + id_diverso_diversos_nomina).val();
            firebase.database().ref(rama_bd_datos_referencia).update(diverso_update);

            // pda
            pda("modificacion", rama_bd_datos_referencia + "/diversos/" + id_diverso_existente, registro_antiguo);
            alert("¡Edición exitosa!");
            resetFormDiversos();
        });
    } else {
        firebase.database().ref(rama_bd_datos_referencia + "/diversos").push($('#' + id_diverso_diversos_nomina).val()).then(function(snapshot){
            var regKey = snapshot.key
            // pista de auditoría
            pda("alta", rama_bd_datos_referencia + "/diversos/" + regKey, "");
            alert("¡Alta exitosa!");
            resetFormDiversos();
        });
    };
});

// ----------------------- VALIDACIÓN DE FORMULARIO ------------------------

$('#' + id_diverso_diversos_nomina).keypress(function(e){
    charactersAllowed("abcdefghijklmnñopqrstuvwxyz ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",e);
});


$('#' + id_diverso_diversos_nomina).change(function(){
    var diverso = deleteBlankSpaces(id_diverso_diversos_nomina);
    diverso =diverso.charAt(0).toUpperCase() +diverso.slice(1);
    $('#' + id_diverso_diversos_nomina).val(diverso);
});

$('#' + id_diverso_diversos_nomina).on("cut copy paste",function(e) {
    e.preventDefault();
 });


 // ----------------------- FUNCIONES NECESARIAS ----------------------------

 function resetFormDiversos(){
    $('#' + id_form_diversos_nomina).trigger("reset");
    existe_diverso = false;
 };

 function validateDiversos(){
    if ($('#' + id_diverso_diversos_nomina).val() == ""){
        alert("Escribe el diverso que deseas dar de alta en el sistema. Ejemplo: Cajas Chicas");
        return false;
    }  else {
        return true;
    };
 };

 function actualizarTablaDiversos(){
    firebase.database().ref(rama_bd_datos_referencia + "/diversos").on("value", function(snapshot){
        var datosDiverso = [];
        snapshot.forEach(function(diversoSnap){
            var diverso_id = diversoSnap.key;
            var diverso_val = diversoSnap.val();

            datosDiverso.push([
                diverso_id,
                diverso_val,
            ]);
        });
        tabla_diversos = $('#'+ id_dataTable_diversos_nomina).DataTable({
            destroy: true,
            data: datosDiverso,
            language: idioma_espanol,
            "columnDefs": [
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='editar btn btn-info'><i class='fas fa-edit'></i></button>"
                },
                {
                    targets: -1,
                    className: 'dt-body-center'
                },
                { "visible": false, "targets": 0},
              ]
        });
        $('#' + id_dataTable_diversos_nomina + ' tbody').on( 'click', '.editar', function () {
            highLightAllDiversos();
            var data = tabla_diversos.row( $(this).parents('tr') ).data();
            resetFormDiversos();
            existe_diverso = true;
            id_diverso_existente = data[0];
               
            $('#' + id_diverso_diversos_nomina).val(data[1]);
        });
    });
 };


 function highLightAllDiversos(){
    highLight(id_diverso_diversos_nomina);
 }

