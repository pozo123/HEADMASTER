//http://live.datatables.net/bodanole/4053/edit
/*
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<link href="https://nightly.datatables.net/css/jquery.dataTables.css" rel="stylesheet" type="text/css" />
<script src="https://nightly.datatables.net/js/jquery.dataTables.js"></script>
<meta charset=utf-8 />
*/
var class_table_datatable_procesos = "dataDesplegarProcesos";
var class_tab_procesos = "tabCatalogoProceso";
var class_button_colapsar_subprocesos_desplegarProcesos = "colapsarSubpClassDesplegarProcesos";
var class_button_desplegar_subprocesos_desplegarProcesos = "desplegarSubpClassDesplegarProcesos";
var nombre_seleccionado;

var rama_bd_obras_magico = "test/obras";

$('.' + class_tab_procesos).click(function(){
    loadTablaProcesos();
});

function loadTablaProcesos(){
    var datos_procesos = [];
    var head = document.createElement('thead');
    var foot = document.createElement('tfoot');
    var body = document.createElement('tbody');
    var row_head = document.createElement('tr');
    var row_foot = document.createElement('tr');

    var th_clave = document.createElement('th');
    th_clave.innerHTML = "Clave";
    row_head.appendChild(th_clave);
    row_foot.appendChild(th_clave);
    var th_nombre = document.createElement('th');
    th_nombre.innerHTML = "Nombre";
    row_head.appendChild(th_nombre);
    row_foot.appendChild(th_nombre);
    var th_alcance = document.createElement('th');
    th_alcance.innerHTML = "Alcance";
    row_head.appendChild(th_alcance);
    row_foot.appendChild(th_alcance);

    head.appendChild(row_head);
    foot.appendChild(row_foot);

    firebase.database().ref(rama_bd_obras_magico).once("value").then(function(snapshot){
        snapshot.forEach(function(obraSnap){
            if(obraSnap.val().nombre != "ZObra Prueba" && !obraSnap.child("terminada").val()){
                obraSnap.child("procesos").forEach(function(childSnapshot){
                    var proc = childSnapshot.val();
                    if(proc.tipo != "adicional" || proc.num_subprocesos != 0){
                        var row = document.createElement('tr');
                        row.id = proc.clave + "_" + obraSnap.val().nombre;//Con los espacios chance truena
                        row.className = "desplegadosDesplegarKaizen";
                        var clave = document.createElement('td') 
                        clave.innerHTML= proc.clave;
                        var nombre = document.createElement('td')
                        nombre.innerHTML = proc.nombre;
                        var alcance = document.createElement('td')
                        alcance.innerHTML = proc.alcance;
                        var nombreObra = document.createElement('td')
                        nombreObra.innerHTML = obraSnap.val().nombre
                        var consecProc = document.createElement('td')
                        var consec_proc = proc.clave.substring(proc.clave.length - 2,proc.clave.length);
                        if(consec_proc == "IC")
                            consecProc.innerHTML = "ZZ";
                        else
                            consecProc.innerHTML = consec_proc;
                        var consecSubp = document.createElement('td')
                        consecSubp.innerHTML = "-";
                        row.appendChild(clave);
                        row.appendChild(nombre);
                        row.appendChild(alcance);
                        row.appendChild(nombreObra);
                        row.appendChild(consecProc);
                        row.appendChild(consecSubp);
                        body.appendChild(row);
                    }
                    if(proc.num_subprocesos != 0){
                        childSnapshot.child("subprocesos").forEach(function(subSnap){
                            var subproceso = subSnap.val();
                            var row = document.createElement('tr');
                            row.id = subproceso.clave + "_" + obraSnap.val().nombre;//Con los espacios chance truena
                            row.className = "subproceso_row";
                            var clave = document.createElement('td');
                            clave.innerHTML= subproceso.clave;
                            var nombre = document.createElement('td');
                            nombre.innerHTML = subproceso.nombre;
                            var alcance = document.createElement('td');
                            alcance.innerHTML = subproceso.alcance;
                            var nombreObra = document.createElement('td');
                            nombreObra.innerHTML = obraSnap.val().nombre;
                            var consecProc = document.createElement('td');
                            var consec_proc = proc.clave.substring(proc.clave.length - 2,proc.clave.length);
                            if(consec_proc == "IC")
                                consecProc.innerHTML = "ZZ";
                            else
                                consecProc.innerHTML = consec_proc;
                            var consecSubp = document.createElement('td');
                            consecSubp.innerHTML = subproceso.clave.substring(subproceso.clave.length - 2,subproceso.clave.length);
                            row.appendChild(clave);
                            row.appendChild(nombre);
                            row.appendChild(alcance);
                            row.appendChild(nombreObra);
                            row.appendChild(consecProc);
                            row.appendChild(consecSubp);
                            body.appendChild(row);
                        });
                    }
                }); 
            }           
        });
        var table = document.getElementsByClassName(class_table_datatable_procesos);
        for(i=0; i< table.length; i++){
            table[i].appendChild(head);
            table[i].appendChild(body);
            table[i].appendChild(foot);
        }

        var obra_colum = 3;
        var proc_consec_colum = 4;
        var subproc_consec_colum = 5;

        var tabla_procesos = $('.' + class_table_datatable_procesos).DataTable({
            "order": [[ obra_colum, 'asc' ], [ proc_consec_colum, 'asc' ],[ subproc_consec_colum, 'asc' ]],
            "columns": [
                {title: "Clave"},
                {title: "Nombre"},
                {title: "Alcance"},
                {title: "Obra"},
                {title: "Proceso Padre"},
                {title: "Consecutivo Subproceso"},
            ],
            "columnDefs": [ 
                { "visible": false, "targets": [obra_colum, proc_consec_colum, subproc_consec_colum] },
                {orderable:false, targets: [0,1,2]},
                {targets: 2, className: 'dt-body-justify'},
            ],
            "lengthMenu": [[-1, 10, 25, 50], ["Todos", 10, 25, 50]],
            destroy: true,
            dom: 'Bfrtip',
            buttons: [
                    {
                        text: "Desplegar Procesos",
                        action: function(e, dt, node, config){desplegarProcesos()}
                    },
                    {
                        text: "Colapsar Procesos",
                        action: function(e, dt, node, config){colapsarProcesos()}
                    },
                    {
                        text: "Desplegar Subprocesos",
                        action: function(e, dt, node, config){desplegarSubprocesos()}
                    },
                    {
                        text: "Colapsar Subprocesos",
                        action: function(e, dt, node, config){colapsarSubprocesos()}
                    },
                ],
            //https://datatables.net/extensions/buttons/
            //https://datatables.net/reference/button/colvis
        
            drawCallback: function ( settings ) {
                var api = this.api();
                var tableRows = api.rows( {page:'current'} ).nodes();
                var lastGroup = null;
                var lastSub = null;   
                var mySubGroup = null;
                $(tableRows).each( function () {
                    var clave_proc = this.id.split("_")[0];
                    //console.log(this.id.split("_"))
                    groupName = this.id.substring(clave_proc.length + 1, this.id.length);
                    var proc = clave_proc.split("-")[0];
                    var cons = proc.substring(proc.length - 2,proc.length);
                    mySubGroup = cons;//this.cells[3].innerHTML;
                    if ( lastGroup !== groupName ) {
                        $(this).before('<tr id="' + groupName + '" class="groupDesplegarProcesos desplegadosObraDesplegarKaizen"><td colspan="3">' + groupName +'</td></tr>');
                        lastGroup = groupName;
                    }
                    if (lastSub !== mySubGroup) {
                        //console.log(this.id)
                        var father_row = document.getElementById(proc + "_" + groupName);
                        father_row.className = father_row.className + " subgroupDesplegarProcesos";
                        //$(father_row).removeClass("subproceso_row");
                        $(this).before(father_row);          
                        lastSub = mySubGroup;  
                    }
                });
            },
            language: idioma_espanol,
        });
     
        // aqui
        $('.' + class_table_datatable_procesos +' tbody').on( 'click', 'tr.group', function () {
            var currentOrder = table.order()[0];
            if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
                table.order( [ groupColumn, 'desc' ] ).draw();
            }
            else {
                table.order( [ groupColumn, 'asc' ] ).draw();
            }
        } );

    });
}

$("." + class_table_datatable_procesos).on("click", "tr", function() { 
  //console.log(this.classList);
  if(this.classList.contains("groupDesplegarProcesos")){
    //console.log(this.id);
    if(this.classList.contains("desplegadosObraDesplegarKaizen")){
      $('[id$="' + this.id + '"]').addClass('hidden');
      $(this).removeClass('hidden');
      $(this).removeClass('desplegadosObraDesplegarKaizen');
    } else { 
      $('[id$="' + this.id + '"]').removeClass('hidden');
      $(this).addClass('desplegadosObraDesplegarKaizen');
    } 
  }
  if(this.classList.contains("subgroupDesplegarProcesos")){
    var split =this.id.split("_");
    if(this.classList.contains("desplegadosDesplegarKaizen")){
      $('[id^="' + split[0] + '"][id$="'+ split[split.length-1] + '"]').addClass('hidden');
      $(this).removeClass('hidden');
      $(this).removeClass('desplegadosDesplegarKaizen');
    } else { 
      $('[id^="' + split[0] + '"][id$="'+ split[split.length-1] + '"]').removeClass('hidden');
      $(this).addClass('desplegadosDesplegarKaizen');
    }
  }
});


//$('.' + class_button_colapsar_subprocesos_desplegarProcesos).on('click', function(){
function colapsarSubprocesos(){
    $('.subproceso_row').addClass('hidden');
    $('.subgroupDesplegarProcesos').removeClass('desplegadosDesplegarKaizen');
};

//$('.' + class_button_desplegar_subprocesos_desplegarProcesos).on('click', function(){
function desplegarSubprocesos(){
    $('.subproceso_row').each(function(){
        //console.log(this.id.substring(this.id.split("_")[0].length + 1,this.id.length));
        if(document.getElementById(this.id.substring(this.id.split("_")[0].length + 1,this.id.length)).classList.contains("desplegadosObraDesplegarKaizen")){
            //console.log(this.id); 
            $(this).removeClass('hidden');
            $('.subgroupDesplegarProcesos').addClass('desplegadosDesplegarKaizen'); 
        }
  });
};

function colapsarProcesos(){
    $('.subproceso_row').addClass('hidden');
    $('.subgroupDesplegarProcesos').addClass('hidden');
    $('.subgroupDesplegarProcesos').removeClass('desplegadosDesplegarKaizen');
    $('.groupDesplegarProcesos').removeClass('desplegadosObraDesplegarKaizen');
    /*$('tr').addClass('hidden');
    $('.groupDesplegarProcesos').removeClass('hidden');
    $('.subgroupDesplegarProcesos').removeClass('desplegadosDesplegarKaizen');
    $('.groupDesplegarProcesos').removeClass('desplegadosObraDesplegarKaizen');*/
};

function desplegarProcesos(){
    $('.subproceso_row').removeClass('hidden');
    $('.subgroupDesplegarProcesos').removeClass('hidden');
    $('.subgroupDesplegarProcesos').addClass('desplegadosDesplegarKaizen');
    $('.groupDesplegarProcesos').addClass('desplegadosObraDesplegarKaizen');
    /*$('.subgroupDesplegarProcesos').each(function(){
        $(this).removeClass('hidden');
        $('.groupDesplegarProcesos').addClass('desplegadosDesplegarKaizen');
    });*/
};
//http://live.datatables.net/xovixoju/228/edit

var idioma_espanol = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ procesos",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
}