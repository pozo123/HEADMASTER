// id's de los elementos HTML
var id_tab_asignacion_supervisor = "tabAsignacionSupervisores";
var id_form_asignacion_supervisor = "formAsignacionSupervisor";
var id_dataTable_asignacion_supervisor = "dataTableAsignacionSupervisor";
var id_container_dataTable_asignacion_supervisor = "containerDataTableAsignacionSupervisor";

// id's ddls.
var id_ddl_obra_asignacion_supervisor = "obraAsignacionSupervisor";
var id_multiple_supervisores_asignacion_supervisor = "supervisoresMultipleAsignacionSupervisor";

// boton para asignar obras
var id_button_asignar_asignacion_supervisor = "aceptarButtonAsignacionSupervisor";

var select_asignacion_supervisor;

var json_supervisores = {};
var json_obras = {};

$('#' + id_tab_asignacion_supervisor).click(function() { 
    // necesito llenar el selector multiple con todos los colaboradores con área de supervision y con credencial 3 
    firebase.database().ref(rama_bd_personal + "/colaboradores").on("value", function(snapshot){ 
        firebase.database().ref(rama_bd_obras + "/listas/obras_activas").orderByChild('nombre').once('value').then(function(obraSnap){
            
            json_supervisores = {};
            json_obras = {};
            $('#' + id_ddl_obra_asignacion_supervisor).empty();
            $('#' + id_multiple_supervisores_asignacion_supervisor).empty();
            
            // llenado de ddl con obras activas.
            var obra_select = document.getElementById(id_ddl_obra_asignacion_supervisor);
        
            var option1 = document.createElement('option');
            option1.style = "display:none";
            option1.text = option1.value = "";
            obra_select.appendChild(option1);
            obraSnap.forEach(function(obraSubSnap){
                obra = obraSubSnap.val();
                option_asignada = document.createElement('option');
                option_asignada.value = obraSubSnap.key;
                option_asignada.text = obra.nombre;
                obra_select.appendChild(option_asignada);
        
                json_obras[obraSubSnap.key] = obra.nombre;    
            });

            var select_multiple = document.getElementById(id_multiple_supervisores_asignacion_supervisor);
            
            snapshot.forEach(function(colaboradorSnap){
                var colaborador = colaboradorSnap.val();
                if(colaborador.areas.produccion && colaborador.credenciales == 3){
                    var option = document.createElement('option');
                    option.text = colaborador.nickname;
                    option.value = colaboradorSnap.key;
            
                    select_multiple.appendChild(option);
                    json_supervisores[colaboradorSnap.key] = colaborador;
                };
            });
            select_asignacion_supervisor = new SlimSelect({
                select: '#' + id_multiple_supervisores_asignacion_supervisor,
                placeholder: 'Elige los supervisores asignados',
            }); 

            actualizarTablaAsignacionSupervisores();
        });
    });
});


// 

$('#' + id_ddl_obra_asignacion_supervisor).change(function(){
    select_asignacion_supervisor.set([]);
    // aquí ya llené todo el ddl múltiple con todos los supervisores, falta que se seleccionen los que ya están elegidos
    firebase.database().ref(rama_bd_obras + "/supervisores/" + $('#' + id_ddl_obra_asignacion_supervisor + " option:selected").val()).once("value").then(function(snapshot){
        var aux_supervisores = [];
        if(snapshot.exists()){
            snapshot.forEach(function(supSnap){
                aux_supervisores.push(supSnap.key);
            });
            select_asignacion_supervisor.set(aux_supervisores);
        };
    });
});

$('#' + id_button_asignar_asignacion_supervisor).click(function(){
    var obra_selected = $('#' + id_ddl_obra_asignacion_supervisor + " option:selected").val();
    if(obra_selected != ""){
        var supervisores_asignados = {};
        for(var i=0; i<select_asignacion_supervisor.selected().length; i++){
            supervisores_asignados[select_asignacion_supervisor.selected()[i]] ={  
                nombre: json_supervisores[select_asignacion_supervisor.selected()[i]].nombre + " " + json_supervisores[select_asignacion_supervisor.selected()[i]].a_paterno + " " + json_supervisores[select_asignacion_supervisor.selected()[i]].a_materno,
                nickname: json_supervisores[select_asignacion_supervisor.selected()[i]].nickname,
                email: json_supervisores[select_asignacion_supervisor.selected()[i]].email
            }
        }
        firebase.database().ref(rama_bd_obras + "/supervisores/" + obra_selected).set(supervisores_asignados);
        alert("Asignación exitosa");
    } else {
        alert("Selecciona la obra a la que deseas asignar supervisores");
    }
});

function actualizarTablaAsignacionSupervisores() {
    firebase.database().ref(rama_bd_obras + "/supervisores").on("value", function(snapshot){
        var datos = [];
        // si existen datos muestro tabla, si no existen o dejan de haber entonces oculto tabla.
        if(snapshot.exists()){
            $('#' + id_container_dataTable_asignacion_supervisor).removeClass('hidden');
            snapshot.forEach(function(obraSnap){
                obraSnap.forEach(function(supSnap){
                    var colaborador = supSnap.val();
                    datos.push([
                        json_obras[obraSnap.key],
                        colaborador.nombre,
                        colaborador.nickname,
                        colaborador.email
                    ]);
                });
            });
        } else {
            $('#' + id_container_dataTable_asignacion_supervisor).addClass('hidden');
        }

        tabla_pagos = $('#'+ id_dataTable_asignacion_supervisor).DataTable({
            destroy: true,
            "order": [[ 0, "desc" ]],
            data: datos,
            language: idioma_espanol,
            "columnDefs": [
                {
                    targets: [0,1,2,3],
                    className: 'dt-body-center'
                },
              ],
              dom: 'Bfrtip',
              buttons: [
                {extend: 'excelHtml5',
                title: "supervisores_asignados",
                exportOptions: {
                    columns: [':visible']
                }},
              ],
              //"paging":false,
        });
    });
};