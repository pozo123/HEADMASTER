/*https://code.jquery.com/jquery-3.3.1.js
https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js
https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js
https://cdn.datatables.net/buttons/1.5.2/js/buttons.colVis.min.js*/
var id_datatable_datos_kaizen = "dataTableDatosKaizen";
var id_obra_ddl_datos_kaizen = "obraDdlDatosKaizen";
var id_tab_datos_kaizen = "tabDatosKaizen";
var id_reset_button = "resetDatosKaizen";

var id_actualizar_button_datos_kaizen = "actualizarButtonDatosKaizen";

var rama_bd_obras_magico = "obras";
var rama_bd_colaboradores_prod = "produccion/colaboradores";

var aut;
var username;

 $(document).ready(function(){

    firebase.auth().onAuthStateChanged(function(user){
		if(user){
            username = user.uid;

			firebase.database().ref(rama_bd_personal).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
				var pers = snapshot.val();
				if(pers.areas.administracion == true){
					aut = "gerente";
				} else {
					firebase.database().ref(rama_bd_colaboradores_prod).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
						var col = snapshot.val();
						console.log(col);
                        if(col.tipo == "supervisor"){
                            aut = "supervisor";
                        } else if(col.tipo == "gerente"){
                            aut = "gerente";
                        } else {
                            aut = "nope";
                            alert("Usuario sin autorización");
						}
						console.log(aut);
					});
                }
                console.log(aut)
			});
		}
	});
});

$('#' + id_tab_datos_kaizen).click(function(){
	var select = document.getElementById(id_obra_ddl_datos_kaizen);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    if(aut == "supervisor"){
	    firebase.database().ref(rama_bd_colaboradores_prod + "/" + username).once('value').then(function(snapshot){
	    	var col = snapshot.val();
	    	snapshot.child('obras').forEach(function(childSnap){
	    		var obra = childSnap.val();
	    		if(obra.activa){
	    			var option2 = document.createElement('option');
	        		option2.text = option2.value = obra.nombre; 
	        		select.appendChild(option2);
	    		}
	    	});
	    });
    } else if(aut == "gerente"){
    	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
    		snapshot.forEach(function(obraSnap){
    			var obra = obraSnap.val();
    			var option2 = document.createElement('option');
	        	option2.text = option2.value = obra.nombre; 
	        	select.appendChild(option2);
    		});
    	});
    }
});

$("#" + id_obra_ddl_datos_kaizen).change(function(){
    loadTableKaizen();
});

$('#' + id_reset_button).click(loadTableKaizen());

function loadTableKaizen(){
	datos_kaizen = [];
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_datos_kaizen + " option:selected").val()  + "/procesos").once('value').then(function(snapshot){
        console.log(snapshot.val())
        snapshot.forEach(function(childSnap){
            console.log(childSnap.val());
				var proc = childSnap.val();
				var avance_est;
				var avance_real;

				var textfield1 = document.createElement('input');
				textfield1.type = "text";
				textfield1.id = proc.clave + "_proy_ppto";

				var textfield2 = document.createElement('input');
				textfield2.type = "text";
				textfield2.id = proc.clave + "_proy_pag";

				var textfield3 = document.createElement('input');
				textfield3.type = "text";
				textfield3.id = proc.clave + "_sum_cuant";

				var textfield4 = document.createElement('input');
				textfield4.type = "text";
				textfield4.id = proc.clave + "_sum_odec";

				var textfield5 = document.createElement('input');
				textfield5.type = "text";
				textfield5.id = proc.clave + "_sum_pag";

				var textfield6 = document.createElement('input');
				textfield6.type = "text";
				textfield6.id = proc.clave + "_copeo_prec";

/* 				var textfield7 = document.createElement('input');
				textfield7.type = "text";
				textfield7.id = proc.clave + "_copeo_copeo";
				$('$' + textfield7.id).change(function(){
					avance_est = "%" + (100*parseFloat($('#' + proc.clave + "_copeo_pag").val())/parseFloat($('#' + proc.clave + "_copeo_copeo").val()));
				});

				var textfield8 = document.createElement('input');
				textfield8.type = "text";
				textfield8.id = proc.clave + "_copeo_pag";
				$('$' + textfield8.id).change(function(){
					avance_est = "%" + (100*parseFloat($('#' + proc.clave + "_copeo_pag").val())/parseFloat($('#' + proc.clave + "_copeo_copeo").val()));
				});

				var textfield9 = document.createElement('input');
				textfield9.type = "text";
				textfield9.id = proc.clave + "_est_ppto";
				$('$' + textfield9.id).change(function(){
					avance_real = "%" + (100*parseFloat($('#' + proc.clave + "_est_est").val())/parseFloat($('#' + proc.clave + "_est_ppto").val()));
				});

				var textfield10 = document.createElement('input');
				textfield10.type = "text";
				textfield10.id = proc.clave + "_est_est";
				$('$' + textfield10.id).change(function(){
					avance_real = "%" + (100*parseFloat($('#' + proc.clave + "_est_est").val())/parseFloat($('#' + proc.clave + "_est_ppto").val()));
				}); */

				var textfield11 = document.createElement('input');
				textfield11.type = "text";
				textfield11.id = proc.clave + "_est_pag";

				var textfield12 = document.createElement('input');
				textfield12.type = "text";
				textfield12.id = proc.clave + "_ant_ppto";

				var textfield13 = document.createElement('input');
				textfield13.type = "text";
				textfield13.id = proc.clave + "_ant_pag";



				datos_kaizen.push([ 
					proc.clave,
					//Ver si sí se pueden declarar así o si hay que darle el valor antes
					//y aquí abajo poner textfield1
					$('#' + proc.clave + "_proy_ppto").val(proc.PROYECTOS.PPTO),
					$('#' + proc.clave + "_proy_pag").val(proc.PROYECTOS.PAG),
					$('#' + proc.clave + "_sum_cuant").val(proc.PRODUCCION.SUMINISTROS.CUANT),
					$('#' + proc.clave + "_sum_odec").val(proc.PRODUCCION.SUMINISTROS.OdeC),
					$('#' + proc.clave + "_sum_pag").val(proc.PRODUCCION.SUMINISTROS.PAG),
					$('#' + proc.clave + "_copeo_prec").val(proc.PRODUCCION.COPEO.PREC),
					$('#' + proc.clave + "_copeo_copeo").val(proc.PRODUCCION.COPEO.COPEO),
					$('#' + proc.clave + "_copeo_pag").val(proc.PRODUCCION.COPEO.PAG),
					avance_est,
					avance_real,
					$('#' + proc.clave + "_est_ppto").val(proc.ADMINISTRACION.ESTIMACIONES.PPTO),
					$('#' + proc.clave + "_est_est").val(proc.ADMINISTRACION.ESTIMACIONES.EST),
					$('#' + proc.clave + "_est_pag").val(proc.ADMINISTRACION.ESTIMACIONES.PAG),
					$('#' + proc.clave + "_ant_ppto").val(proc.ADMINISTRACION.ANTICIPOS.PPTO),
					$('#' + proc.clave + "_ant_pag").val(proc.ADMINISTRACION.ANTICIPOS.PAG),
                ]);
                
                console.log(datos_kaizen)
						
				var tabla_procesos = $('#'+ id_datatable_asistencia).DataTable({
			 		destroy: true,
			 		data: datos_kaizen,
			 		dom: 'Bfrtip',
			 		buttons: ['excel'],
			 		columns: [
			 		/*<thead>
			            <tr>
			                <th rowspan="2" colspan="1">nombre_obra</th>
			                <th rowspan="2" colspan="1">PROYECTOS</th>
			                <th colspan="6">PRODUCCION</th>
			                <th rowspan="2" colspan="2">AVANCE</th>
			                <th colspan="6">ADMINISTRACION</th>
			                <th rowspan="2" colspan="2">PROFIT</th>
			            </tr>
			            <tr>
			                <th colspan="3">SUMINISTROS</th>
			                <th colspan="3">COPEO</th>
			                <th colspan="3">ESTIMACIONES</th>
			                <th colspan="3">ANTICIPOS</th>
			            </tr>
			            <tr>
			                <th>PROCESO</th>
			                <th>SCORE</th>
			                <th>CUANT</th>
			                <th>OdeC</th>
			                <th>PAG</th>
			                <th>PREC</th>
			                <th>COPEO</th>
			                <th>PAG</th>
			                <th>EST</th>
			                <th>REAL</th>
			                <th>PPTO</th>
			                <th>EST</th>
			                <th>PAG</th>
			                <th>PPTO</th>
			                <th>PAG</th>
			            </tr>
			        </thead>*/
			 		    {title: "PROCESO"},
			 		    {title: "PROY/PPTO"},
			 		    {title: "PROY/PAG"},
			 		    {title: "PROD/SUM/CUANT"},
			 		    {title: "PROD/SUM/OdeC"},
			 		    {title: "PROD/SUM/PAG"},
			 		    {title: "PROD/COPEO/PREC"},
			 		    {title: "PROD/COPEO/COPEO"},
			 		    {title: "PROD/COPEO/PAG"},
			 		    {title: "AVANCE/EST"},
			 		    {title: "AVANCE/REAL"},
			 		    {title: "ADMIN/EST/PPTO"},
			 		    {title: "ADMIN/EST/EST"},
			 		    {title: "ADMIN/EST/PAG"},
			 		    {title: "ADMIN/ANT/PPTO"},
			 		    {title: "ADMIN/ANT/PAG"},
				   	],
				   	language: idioma_espanol,
				});            
		})
	});
};

$('#' + id_actualizar_button_datos_kaizen).click(function(){
	firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_datos_kaizen + " option:selected").val()).once('value').then(function(snapshot){
		snapshot.forEach(function(childSnap){
			childSnap.child("procesos").forEach(function(procSnap){
				var proc = procSnap.val();
				var profit_prog;
				var sum;
				var cop;
				if(parseFloat($('#' + proc.clave + "_sum_odec").val() == 0)){
					sum = parseFloat($('#' + proc.clave + "_sum_cuant").val());
				} else { 
					sum = parseFloat($('#' + proc.clave + "_sum_odec").val());
				}
				if(parseFloat($('#' + proc.clave + "_copeo_copeo").val() == 0)){
					cop = parseFloat($('#' + proc.clave + "_copeo_prec").val());
				} else { 
					cop = CparseFloat($('#' + proc.clave + "_copeo_copeo").val());
				}
				var admin_prog = (parseFloat($('#' + proc.clave + "_est_ppto").val()) + parseFloat($('#' + proc.clave + "_ant_ppto").val()))*.8; 
				profit_prog = admin_prog - cop - sum - parseFloat($('#' + proc.clave + "_proy_ppto").val())*1.3;
				var admin = (parseFloat($('#' + proc.clave + "_est_pag").val()) + parseFloat($('#' + proc.clave + "_ant_pag").val()))*.8;
				var costos = parseFloat($('#' + proc.clave + "_proy_pag").val())*1.3 + parseFloat($('#' + proc.clave + "_sum_pag").val()) + parseFloat($('#' + proc.clave + "_copeo_pag").val());
				var profit_real = admin - costos;
				var kaiz = {
				    PROYECTOS: {
				        PPTO: parseFloat($('#' + proc.clave + "_proy_ppto").val()),
				        PAG: parseFloat($('#' + proc.clave + "_proy_pag").val()),
				    },
				    PRODUCCION: {
				        SUMINISTROS: {
				            CUANT: parseFloat($('#' + proc.clave + "_sum_cuant").val()),
				            OdeC: parseFloat($('#' + proc.clave + "_sum_odec").val()),
				            PAG: parseFloat($('#' + proc.clave + "_sum_pag").val()),
				        },
				        COPEO: {
				            PREC: parseFloat($('#' + proc.clave + "_copeo_prec").val()),
				            COPEO: parseFloat($('#' + proc.clave + "_copeo_copeo").val()),
				            PAG: parseFloat($('#' + proc.clave + "_copeo_pag").val()),
				        },
				    },
				    ADMINISTRACION: {
				        ESTIMACIONES: {
				            PPTO: parseFloat($('#' + proc.clave + "_est_ppto").val()),
				            EST: parseFloat($('#' + proc.clave + "_est_est").val()),
				            PAG: parseFloat($('#' + proc.clave + "_est_pag").val()),
				        },
				        ANTICIPOS: {
				            PPTO: parseFloat($('#' + proc.clave + "_ant_ppto").val()),
				            PAG: parseFloat($('#' + proc.clave + "_ant_pag").val()),
				        },
				    },
				    PROFIT: {
				        PROG: {
				        	BRUTO: profit_prog,
				        	NETO: profit_prog * 0.6,
				        },
				        REAL: {
				        	BRUTO: profit_real,
				        	NETO: profit_real * 0.6,
				        },
				    }
				};

				firebase.database().ref(rama_bd_obras_magico + "/" + snapshot.val().nombre + "/procesos/" + proc.clave).set(kaiz);

			});
		});
	});
});

var idioma_espanol = {	
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
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