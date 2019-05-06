var id_datatable_editarTrabajadores = "dataTableEditarTrabajadores";

var id_tab_editarTrabajadores = "tabEditarTrabajadores"

var options_bibliotecas = { year: 'numeric', month: 'numeric', day: 'numeric' };

var rama_bd_trabajadores = "rrhh/trabajadores";

//_____MODAL______
var id_modal_editarTrabajadores = "modalEditarTrabajadores";

var id_nombre_editarTrabajadores = "nombreEditarTrabajadores";//TF
var id_puesto_ddl_editarTrabajadores = "puestoDdlEditarTrabajadores";//ddl
var id_sueldo_base_editarTrabajadores = "sueldoBaseEditarTrabajadores";//TF
var id_jefe_editarTrabajadores = "jefeEditarTrabajadores";//ddl?TF? AQUI definir
var id_especialidad_ddl_editarTrabajadores = "especialidadDdlEditarTrabajadores";//ddl
var id_activo_cb_editarTrabajadores = "activoCbEditarTrabajadores";//checkbox
var id_clave_pagadora_editarTrabajadores = "clavePagadoraEditarTrabajadores";//TF
var id_RFC_editarTrabajadores = "RFCEditarTrabajadores";//TF
var id_IMSS_editarTrabajadores = "IMSSEditarTrabajadores";//TF
var id_CURP_editarTrabajadores = "CURPEditarTrabajadores";//TF
var id_fecha_nacimiento_editarTrabajadores = "fechaNacimientoEditarTrabajadores";//datepicker
var id_estado_civil_ddl_editarTrabajadores = "estadoCivilDdlEditarTrabajadores";//ddl
var id_sexo_editarTrabajadores = "sexoEditarTrabajadores";//TF
var id_domicilio_editarTrabajadores = "domicilioEditarTrabajadores";//TF
var id_banco_editarTrabajadores = "bancoEditarTrabajadores";//TF
var id_cuenta_editarTrabajadores = "cuentaEditarTrabajadores";//TF
var id_clabe_editarTrabajadores = "clabeEditarTrabajadores";//TF
var id_camisa_editarTrabajadores = "camisaEditarTrabajadores";//TF
var id_pantalon_editarTrabajadores = "pantalonEditarTrabajadores";//TF
var id_zapatos_editarTrabajadores = "zapatosEditarTrabajadores";//TF
		
//var id_label_eliminar_editarTrabajadores = "labelEliminarEditarTrabajadores";

var id_editar_button_editarTrabajadores = "editarTrabajadorButton";
//var id_eliminar_button_editarTrabajadores = "eliminarTrabajadorButton";

var trabajador_seleccionado;

$('#' + id_tab_editarTrabajadores).click(function(){
	loadTablaTrabajadores();
});

function loadTablaTrabajadores(){
	var datos_trabajadores = [];
	firebase.database().ref(rama_bd_trabajadores).on("child_added",function(snapshot){
		var trabajador = snapshot.val();
		datos_trabajadores.push([trabajador.id_trabajador, trabajador.nombre, trabajador.fecha_antiguedad, trabajador.puesto, trabajador.sueldo_base, trabajador.jefe, trabajador.especialidad, trabajador.activo, trabajador.clave_pagadora, trabajador.claves.RFC, trabajador.claves.IMSS, trabajador.claves.CURP, trabajador.info_personal.fecha_nacimiento, trabajador.info_personal.estado_civil, trabajador.info_personal.sexo, trabajador.info_personal.domicilio, trabajador.datos_bancarios.banco, trabajador.datos_bancarios.cuenta, trabajador.datos_bancarios.clabe, trabajador.tallas.camisa, trabajador.tallas.pantalon, trabajador.tallas.zapatos]);
		var tabla_trabajadores = $('#'+ id_datatable_editarTrabajadores).DataTable({
            destroy: true,
			data: datos_trabajadores,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "ID"},
				{title: "Nombre"},
				{title: "Fecha de antiguedad"},
				{title: "Puesto"},
				{title: "Sueldo base"},
				{title: "Jefe"},
				{title: "Especialidad"},
				{title: "Activo"},
				{title: "Clave pagadora"},
				{title: "RFC"},
				{title: "IMSS"},
				{title: "CURP"},
				{title: "Fecha de nacimiento"},
				{title: "Estado civil"},
				{title: "Sexo"},
				{title: "Domicilio"},
				{title: "Banco"},
				{title: "Cuenta"},
				{title: "Clabe"},
				{title: "Camisa"},
				{title: "Pantalon"},
				{title: "Zapatos"},	
				{defaultContent: "<button type='button' class='editar btn btn-primary' data-toggle='modal' data-target='#excModalEditar'><i class='fas fa-edit'></i></button> <button type='button' class='editar btn btn-danger'><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_trabajador("#" + id_datatable_editarTrabajadores + " tbody", tabla_trabajadores);
		eliminar_trabajador("#" + id_datatable_editarTrabajadores + " tbody", tabla_trabajadores);
	});
};

function editar_trabajador(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			firebase.database().ref(rama_bd_trabajadores + "/" + data[0]).once('child_added').then(function(snapshot){
				var trabajador = snapshot.val();
				var ddl_puesto = document.getElementById(id_puesto_ddl_editarTrabajadores);
				for(var i = 0; i<ddl_puesto.length;i++){
	                if(ddl_puesto[i].text == trabajador.puesto){
	                    ddl_puesto.selectedIndex = i;
	                }
	            }
	            var ddl_especialidad = document.getElementById(id_especialidad_ddl_editarTrabajadores);
				for(var i = 0; i<ddl_especialidad.length;i++){
	                if(ddl_especialidad[i].text == trabajador.especialidad){
	                    ddl_especialidad.selectedIndex = i;
	                }
	            }
	            var ddl_estado_civil = document.getElementById(id_estado_civil_ddl_editarTrabajadores);
				for(var i = 0; i<ddl_estado_civil.length;i++){
	                if(ddl_estado_civil[i].text == trabajador.estado_civil){
	                    ddl_estado_civil.selectedIndex = i;
	                }
	            }
				$('#' + id_nombre_editarTrabajadores).val(trabajador.nombre);
				$('#' + id_sueldo_base_editarTrabajadores).val(trabajador.sueldo_base);
				$('#' + id_jefe_editarTrabajadores).val(trabajador.jefe);//TF/ddl? AQUI definir
				if(trabajador.activo){
					document.getElementById(id_activo_cb_editarTrabajadores).checked = true;
				} else {
					document.getElementById(id_activo_cb_editarTrabajadores).checked = false;
				}
				$('#' + id_clave_pagadora_editarTrabajadores).val(trabajador.clave_pagadora);
				$('#' + id_RFC_editarTrabajadores).val(trabajador.claves.RFC);
				$('#' + id_IMSS_editarTrabajadores).val(trabajador.claves.IMSS);
				$('#' + id_CURP_editarTrabajadores).val(trabajador.claves.CURP);
				var fecha_nac = new Date(trabajador.info_personal.fecha_nacimiento);
				$('#' + id_fecha_nacimiento_editarTrabajadores).val((fecha_nac.getMonth() + 1) + "." + fecha_nac.getDate() + "." + (fecha_nac.getYear() + 1900));
				$('#' + id_sexo_editarTrabajadores).val(trabajador.info_personal.sexo);
				$('#' + id_domicilio_editarTrabajadores).val(trabajador.info_personal.domicilio);
				$('#' + id_banco_editarTrabajadores).val(trabajador.datos_bancarios.banco);
				$('#' + id_cuenta_editarTrabajadores).val(trabajador.datos_bancarios.cuenta);
				$('#' + id_clabe_editarTrabajadores).val(trabajador.datos_bancarios.clabe);
				$('#' + id_camisa_editarTrabajadores).val(trabajador.tallas.camisa);
				$('#' + id_pantalon_editarTrabajadores).val(trabajador.tallas.pantalon);
				$('#' + id_zapatos_editarTrabajadores).val(trabajador.tallas.zapatos);
			});
		trabajador_seleccionado = data[0];
		}
	});
}
/*
var trabajador_eliminado;
function eliminar_trabajador(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			$('#' + id_label_eliminar_editarTrabajadores).val(data[0] + ": " + data[1]);
			trabajador_eliminado = data[0];
		}
	});
}*/

/*$('#' + id_eliminar_button_editarTrabajadores).click(function(){
	firebase.database().ref(rama_bd_trabajadores + "/" + trabajador_eliminado).once('child_added').then(function(snapshot){
		//snapshot.getRef().removeValue();
	});
});*/

$('#' + id_editar_button_editarTrabajadores).click(function(){
	firebase.database().ref(rama_bd_trabajadores + "/" + trabajador_seleccionado).once('value').then(function(snapshot){
		var trab = snapshot.val();
		var trabajador = {
			nombre: $('#' + id_nombre_editarTrabajadores).val(),
			puesto: $('#' + id_puesto_ddl_editarTrabajadores + " option:selected").val(),
			sueldo_base: $('#' + id_sueldo_base_editarTrabajadores).val(),
			jefe: $('#' + id_jefe_editarTrabajadores).val(),//AQUI definir
			id_trabajador: trabajador_seleccionado,
			fecha_antiguedad: trab.fecha_antiguedad,
			obra_asignada: trab.obra_asignada,
			especialidad: $('#' + id_especialidad_ddl_editarTrabajadores + " option:selected").val(),
			activo: document.getElementById(id_activo_cb_editarTrabajadores).checked,
			clave_pagadora: $('#' + id_clave_pagadora_editarTrabajadores).val(),
			claves: { 
				RFC: $('#' + id_RFC_editarTrabajadores).val(),
				IMSS: $('#' + id_IMSS_editarTrabajadores).val(),
				CURP: $('#' + id_CURP_editarTrabajadores).val(),
			},
			info_personal: {
				fecha_nacimiento: new Date($('#' + id_fecha_nacimiento_editarTrabajadores).val()).getTime(),
				estado_civil: $('#' + id_estado_civil_ddl_editarTrabajadores + " option:selected").val(),
				sexo: $('#' + id_sexo_editarTrabajadores).val(),
				domicilio: $('#' + id_domicilio_editarTrabajadores).val(),
			},
			datos_bancarios: {
				banco: $('#' + id_banco_editarTrabajadores).val(),
				cuenta: $('#' + id_cuenta_editarTrabajadores).val(),
				clabe: $('#' + id_clabe_editarTrabajadores).val(),
			},
			tallas:{
				camisa: $('#' + id_camisa_editarTrabajadores).val(),
				pantalon: $('#' + id_pantalon_editarTrabajadores).val(),
				zapatos: $('#' + id_zapatos_editarTrabajadores).val(),
			},
			nomina: trab.nomina,
		}
		firebase.database().ref(rama_bd_trabajadores + "/" + trabajador_seleccionado).update(trabajador);
		loadTablaTrabajadores();
		alert("Cambios registrados");
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