var rama_bd_tipos_presupuesto = "proyectos/tipos_presupuesto";
var rama_bd_generos = "proyectos/generos";
var rama_bd_obras = "test/obras";
var rama_bd_reqs = "proyectos/reqs";
var rama_bd_exclusiones = "proyectos/exclusiones";
var rama_bd_clientes = "clientes";
var rama_bd_registros = "test/proyectos/registros";

var id_datatable_clientes_bibliotecas = "dataTableClientes";
var id_datatable_exclusiones_bibliotecas = "dataTableExclusiones";
var id_datatable_generos_bibliotecas = "dataTableGeneros";
var id_datatable_tipos_presupuesto_bibliotecas = "dataTableTipos";
var id_datatable_reqs_bibliotecas = "dataTableReqs";
var id_datatable_obras_bibliotecas = "dataTableObras";
var id_datatable_inges_bibliotecas = "dataTableInges";
var id_datatable_presupuestos_bibliotecas = "dataTablePresu";
var id_datatable_atn_bibliotecas = "dataTableAtn";
var id_datatable_pagos_bibliotecas = "dataTablePagos";//AQUI

var id_tab_clientes_bibliotecas = "tabBibClientes"
var id_tab_colaborador_bibliotecas = "tabBibColaborador"
var id_tab_obras_bibliotecas = "tabBibObras"
var id_tab_presupuestos_bibliotecas = "tabBibPresupuestos"
var id_tab_atencion_bibliotecas = "tabBibAtencion"
var id_tab_reqsExcs_bibliotecas = "tabBibReqsExcs"
var id_tab_tiposGens_bibliotecas = "tabBibTiposGens"
var id_tab_pagos_bibliotecas = "tabBibPagos"//AQUI

var options_bibliotecas = { year: 'numeric', month: 'numeric', day: 'numeric' };

//_____MODAL CLIENTE______
var id_cliente_modal_editar_bibliotecas = "clienteModalEditar";

var id_clave_cliente_editar_bibliotecas = "claveClienteEditar";
var id_nombre_cliente_editar_bibliotecas = "nombreClienteEditar";
var id_tel_cliente_editar_bibliotecas = "telClienteEditar";
var id_dir_calle_cliente_editar_bibliotecas = "dir_calleClienteEditar";
var id_dir_numero_cliente_editar_bibliotecas = "dir_numeroClienteEditar";
var id_dir_colonia_cliente_editar_bibliotecas = "dir_coloniaClienteEditar";
var id_dir_delegacion_cliente_editar_bibliotecas = "dir_delegacionClienteEditar";
var id_dir_ciudad_cliente_editar_bibliotecas = "dir_ciudadClienteEditar";
var id_dir_cp_cliente_editar_bibliotecas = "dir_cpClienteEditar";

var id_editar_cliente_button_bibliotecas = "editarCliente";
//____MODAL REQS_____
var id_req_modal_editar_bibliotecas = "reqModalEditar";

var id_esencial_req_editar_bibliotecas = "claveReqEditar";
var id_nombre_req_editar_bibliotecas = "nombreReqEditar";

var id_label_req_eliminar_bibliotecas = "labelReqEliminar";

var id_eliminar_req_button_bibliotecas = "eliminarReq";
var id_editar_req_button_bibliotecas = "editarReq";
//____MODAL EXC_____
var id_exc_modal_editar_bibliotecas = "excModalEditar";

var id_nombre_exc_editar_bibliotecas = "nombreExcEditar";

var id_label_exc_eliminar_bibliotecas = "labelExcEliminar";

var id_eliminar_exc_button_bibliotecas = "eliminarExc";
var id_editar_exc_button_bibliotecas = "editarExc";
//____MODAL GENERO_____
var id_genero_modal_editar_bibliotecas = "generoModalEditar";

var id_codigo_genero_editar_bibliotecas = "codigoGeneroEditar";
var id_nombre_genero_editar_bibliotecas = "nombreGeneroEditar";

var id_label_genero_eliminar_bibliotecas = "labelGeneroEliminar";

var id_eliminar_genero_button_bibliotecas = "eliminarGenero";
var id_editar_genero_button_bibliotecas = "editarGenero";
//____MODAL TIPO_____
var id_tipo_modal_editar_bibliotecas = "tipoModalEditar";

var id_codigo_tipo_editar_bibliotecas = "codigoTipoEditar";
var id_nombre_tipo_editar_bibliotecas = "nombreTipoEditar";

var id_label_tipo_eliminar_bibliotecas = "labelTipoEliminar";

var id_eliminar_tipo_button_bibliotecas = "eliminarTipo";
var id_editar_tipo_button_bibliotecas = "editarTipo";
//_____MODAL OBRA______
var id_obra_modal_editar_bibliotecas = "obraModalEditar";

var id_clave_obra_editar_bibliotecas = "claveObraEditar";
var id_nombre_obra_editar_bibliotecas = "nombreObraEditar";
var id_cliente_obra_editar_bibliotecas = "clienteObraEditar";
var id_dir_calle_obra_editar_bibliotecas = "dir_calleObraEditar";
var id_dir_numero_obra_editar_bibliotecas = "dir_numeroObraEditar";
var id_dir_colonia_obra_editar_bibliotecas = "dir_coloniaObraEditar";
var id_dir_delegacion_obra_editar_bibliotecas = "dir_delegacionObraEditar";
var id_dir_ciudad_obra_editar_bibliotecas = "dir_ciudadObraEditar";
var id_dir_cp_obra_editar_bibliotecas = "dir_cpObraEditar";

var id_editar_obra_button_bibliotecas = "editarObra";
//_____MODAL INGE______
var id_inge_modal_editar_bibliotecas = "ingeModalEditar";

var id_creden_proyectista_inge_editar_radio_bibliotecas = "credenProyectistaIngeEditar";
var id_creden_admin_inge_editar_radio_bibliotecas = "credenAdminIngeEditar";
var id_especialidad_elec_inge_editar_checkbox_bibliotecas = "especialidadElecIngeEditar";
var id_especialidad_plom_inge_editar_checkbox_bibliotecas = "especialidadPlomIngeEditar";
var id_nombre_inge_editar_bibliotecas = "nombreIngeEditar";
var id_nickname_inge_editar_bibliotecas = "nicknameIngeEditar";
//var id_nickname_inge_editar_bibliotecas = "nicknameIngeEditar";

var id_editar_inge_button_bibliotecas = "editarInge";
//_____MODAL ATN______
var id_atn_modal_editar_bibliotecas = "atnModalEditar";

var id_nombre_atn_editar_bibliotecas = "nombreAtnEditar";
var id_email_atn_editar_bibliotecas = "emailAtnEditar";
var id_area_atn_editar_bibliotecas = "areaAtnEditar";
var id_celular_atn_editar_bibliotecas = "celularAtnEditar";
var id_extension_atn_editar_bibliotecas = "extensionAtnEditar";

var id_label_atn_eliminar_bibliotecas = "labelAtnEliminar";

var id_editar_atn_button_bibliotecas = "editarAtn";
var id_eliminar_atn_button_bibliotecas = "eliminarAtn";
//_____MODAL PRESUPUESTO______
/* var id_presu_modal_editar_bibliotecas = "presuModalEditar";

var id_nombre_presu_editar_bibliotecas = "nombrePresuEditar";
var id_horas_presu_editar_bibliotecas = "horasPresuEditar";
var id_precio_presu_editar_bibliotecas = "precioPresuEditar";
var id_clase_ddl_presu_editar_bibliotecas = "DDL_clasePresuEditar";

var id_editar_presu_button_bibliotecas = "editarPresu"; */
//_____MODAL PAGOS______
//AQUI
var id_pagos_modal_editar_bibliotecas = "pagosModalEditar";

var id_concepto_pagos_editar_bibliotecas = "conceptoPagosEditar";
var id_monto_pagos_editar_bibliotecas = "montoPagosEditar";
var id_imagen_pagos_editar_bibliotecas = "imagenPagosEditar";

var id_editar_pagos_button_bibliotecas = "editarPagos";
var id_descargar_pagos_button_bibliotecas = "descargarPagos";
//____FIN MODALES_____


var nombre_seleccionado;
var boton_editar_class;
var boton_eliminar_class;

/* function sleep(miliseconds) {
	var currentTime = new Date().getTime();
 
	while (currentTime + miliseconds >= new Date().getTime()) {
	}
 }
 */
 $(document).ready(function(){
	firebase.auth().onAuthStateChanged(user => {
		if(user) {
			var username = user.uid;
			firebase.database().ref(rama_bd_inges).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
				var ing = snapshot.val();
				if(ing.credenciales === 0 || ing.credenciales === 1 || ing.credenciales === 2){
					boton_editar_class = "class='editar btn btn-primary'";
					boton_eliminar_class = "class='editar btn btn-danger'";
				}
				else{
					boton_editar_class = "class='editar btn btn-primary hidden'";
					boton_eliminar_class = "class='editar btn btn-danger hidden'";
				}
			});
		}
	})
});
/* 
$(document).ready(function() {
	firebase.auth().onAuthStateChanged(user => {
		if(user) {
			var username = user.uid;
			firebase.database().ref(rama_bd_inges).orderByKey().equalTo(username).once('child_added').then(function(snapshot){
				var ing = snapshot.val();
				if(ing.credenciales === 0 || ing.credenciales === 1 || ing.credenciales === 2){
					boton_editar_class = "class='editar btn btn-primary'";
					boton_eliminar_class = "class='editar btn btn-danger'";
				}
				else{
					boton_editar_class = "class='editar btn btn-primary hidden'";
					boton_eliminar_class = "class='editar btn btn-danger hidden'";
				}
			});
		}
	})
}); */
// métodos para cargar las funciones cuando se den click en los tabs del panel lateral
$('#' + id_tab_clientes_bibliotecas).click(function(){
	loadTablaClientes();
});

$('#' + id_tab_reqsExcs_bibliotecas).click(function(){
	loadTablaExclusionesYReqs();
});

$('#' + id_tab_tiposGens_bibliotecas).click(function(){
	loadTablaGenerosYTipos();
});

$('#' + id_tab_obras_bibliotecas).click(function(){
	loadTablaObras();
});

$('#' + id_tab_colaborador_bibliotecas).click(function(){
	loadTablaInges();
});

$('#' + id_tab_presupuestos_bibliotecas).click(function(){
	loadTablaPresupuestos();
});

$('#' + id_tab_atencion_bibliotecas).click(function(){
	loadTablaAtn();
});

//AQUI
$('#' + id_tab_pagos_bibliotecas).click(function(){
	loadTablaPagos();
});

// -----------------------------------------------------------------------------------

function loadTablaClientes(){
	var datos_clientes = [];
	firebase.database().ref(rama_bd_clientes).orderByChild("nombre").on("child_added",function(snapshot){
		var cliente = snapshot.val();
		datos_clientes.push([cliente.nombre, cliente.clave, cliente.telefono, cliente.direccion.calle + ", No. " + cliente.direccion.numero + " Col. " + cliente.direccion.colonia + ", " + cliente.direccion.delegacion + ", " + cliente.direccion.ciudad + " CP " + cliente.direccion.cp]);
		var tabla_clientes = $('#'+ id_datatable_clientes_bibliotecas).DataTable({
            destroy: true,
			data: datos_clientes,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre",width: 150},
				{title: "Clave",width: 70},
				{title: "Telefono",width: 70},
				{title: "Direccion"},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#clienteModalEditar'><i class='fas fa-edit'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_cliente("#" + id_datatable_clientes_bibliotecas + " tbody", tabla_clientes);
	});
}

function editar_cliente(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);
			firebase.database().ref(rama_bd_clientes).orderByChild("nombre").equalTo(data[0]).once('child_added').then(function(snapshot){
				var clien = snapshot.val();
				$('#' + id_clave_cliente_editar_bibliotecas).val(clien.clave);
				$('#' + id_nombre_cliente_editar_bibliotecas).val(clien.nombre);
				$('#' + id_tel_cliente_editar_bibliotecas).val(clien.telefono);
				$('#' + id_dir_calle_cliente_editar_bibliotecas).val(clien.direccion.calle);
				$('#' + id_dir_numero_cliente_editar_bibliotecas).val(clien.direccion.numero);
				$('#' + id_dir_colonia_cliente_editar_bibliotecas).val(clien.direccion.colonia);
				$('#' + id_dir_delegacion_cliente_editar_bibliotecas).val(clien.direccion.delegacion);
				$('#' + id_dir_ciudad_cliente_editar_bibliotecas).val(clien.direccion.ciudad);
				$('#' + id_dir_cp_cliente_editar_bibliotecas).val(clien.direccion.cp);
			});
		nombre_seleccionado = data[0];
		}
	});
}

$('#' + id_editar_cliente_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_cliente_editar_bibliotecas).val();
	var cliente = {
		clave: $('#' + id_clave_cliente_editar_bibliotecas).val(),
		nombre: nom,
		telefono: $('#' + id_tel_cliente_editar_bibliotecas).val(),
		direccion: {
			calle: $('#' + id_dir_calle_cliente_editar_bibliotecas).val(),
			numero: $('#' + id_dir_numero_cliente_editar_bibliotecas).val(),
			colonia: $('#' + id_dir_colonia_cliente_editar_bibliotecas).val(),
			delegacion: $('#' + id_dir_delegacion_cliente_editar_bibliotecas).val(),
			ciudad: $('#' + id_dir_ciudad_cliente_editar_bibliotecas).val(),
			cp: $('#' + id_dir_cp_cliente_editar_bibliotecas).val(),
		}
	}
	if(nombre_seleccionado === nom){
		firebase.database().ref(rama_bd_clientes + "/" + nom).update(cliente);
	} else {
		firebase.database().ref(rama_bd_obras).orderByChild("cliente").equalTo(nombre_seleccionado).on('child_added',function(snapshot){
			var obra = snapshot.val()
			firebase.database().ref(rama_bd_obras + "/" + obra.nombre + "/cliente").set(nom);
		});
		firebase.database().ref(rama_bd_clientes).child(nombre_seleccionado).once('value').then(function(snapshot){
			var data = snapshot.val();
			data.nombre = nom;
			var update = {};
			update[nombre_seleccionado] = null;
			update[nom] = data;
			firebase.database().ref(rama_bd_clientes).update(update);
			firebase.database().ref(rama_bd_clientes + "/" + nom).update(cliente);
		});
	}
	loadTablaClientes();
	alert("Cambios registrados");
});

function loadTablaExclusionesYReqs(){
	var datos_exclusiones = [];
	firebase.database().ref(rama_bd_exclusiones).orderByChild("nombre").on("child_added",function(snapshot){
		var exc = snapshot.val();
		datos_exclusiones.push([exc.nombre]);
		var tabla_exclusiones = $('#'+ id_datatable_exclusiones_bibliotecas).DataTable({
            destroy: true,
			data: datos_exclusiones,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre"},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#excModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_exclusion("#" + id_datatable_exclusiones_bibliotecas + " tbody", tabla_exclusiones);
		eliminar_exclusion("#" + id_datatable_exclusiones_bibliotecas + " tbody", tabla_exclusiones);
	});

	var datos_reqs = [];
	firebase.database().ref(rama_bd_reqs).orderByChild("nombre").on("child_added",function(snapshot){
		var req = snapshot.val();
		datos_reqs.push([req.nombre, req.esencial]);
		var tabla_reqs = $('#'+ id_datatable_reqs_bibliotecas).DataTable({
            destroy: true,
			data: datos_reqs,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre"},
				{title: "Esencial"},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#reqModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_req("#" + id_datatable_reqs_bibliotecas + " tbody", tabla_reqs);
		eliminar_req("#" + id_datatable_reqs_bibliotecas + " tbody", tabla_reqs);
	});
}

function editar_exclusion(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			$('#' + id_nombre_exc_editar_bibliotecas).val(data[0]);
			nombre_seleccionado = data[0];
		}
		
		//console.log(data);
	});
}

var exc_eliminado;
function eliminar_exclusion(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			console.log(data);
			$('#' + id_label_exc_eliminar_bibliotecas).val(data[0]);
			exc_eliminado = data[0];
		}
		//console.log(data);
	});
}

function editar_req(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			console.log(data);	
			$('#' + id_nombre_req_editar_bibliotecas).val(data[0]);
			$('#' + id_esencial_req_editar_bibliotecas).val(data[1]);
			nombre_seleccionado = data[0];
		}
		
	});
}

var req_eliminado;
function eliminar_req(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			$('#' + id_label_req_eliminar_bibliotecas).text(data[0]);
			req_eliminado = data[0];
		}
		//console.log(data);
	});
}

$('#' + id_editar_exc_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_exc_editar_bibliotecas).val();
	var exc = {
		nombre: nom,
	}
	firebase.database().ref(rama_bd_exclusiones).orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		var ek = snapshot.key;
		firebase.database().ref(rama_bd_exclusiones + "/" +  ek).update(exc);
		loadTablaExclusionesYReqs();	
		alert("Cambios registrados");
	});
});

$('#' + id_eliminar_exc_button_bibliotecas).click(function(){
	firebase.database().ref(rama_bd_exclusiones).orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		snapshot.getRef().removeValue();
	});
});

$('#' + id_editar_req_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_req_editar_bibliotecas).val();
	var req = {
		esencial: $('#' + id_esencial_req_editar_bibliotecas).val(),
		nombre: nom,
	}
	firebase.database().ref(rama_bd_reqs).orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		var rk = snapshot.key;
		firebase.database().ref(rama_bd_reqs + "/" +  rk).update(req);
		loadTablaExclusionesYReqs();	
		alert("Cambios registrados");
	});
});

$('#' + id_eliminar_req_button_bibliotecas).click(function(){
	firebase.database().ref(rama_bd_reqs).orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		snapshot.getRef().removeValue();
	});
});


function loadTablaGenerosYTipos(){
	var datos_generos = [];
	firebase.database().ref(rama_bd_generos).orderByChild("nombre").on("child_added",function(snapshot){
		var gen = snapshot.val();
		datos_generos.push([gen.nombre, gen.codigo]);
		var tabla_generos = $('#'+ id_datatable_generos_bibliotecas).DataTable({
            destroy: true,
			data: datos_generos,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre"},
				{title: "Codigo"},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#generoModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_genero("#" + id_datatable_generos_bibliotecas + " tbody", tabla_generos);
		eliminar_genero("#" + id_datatable_generos_bibliotecas + " tbody", tabla_generos);
	});

	var datos_tipos_presupuesto = [];
	firebase.database().ref(rama_bd_tipos_presupuesto).orderByChild("nombre").on("child_added",function(snapshot){
		var tipo = snapshot.val();
		datos_tipos_presupuesto.push([tipo.nombre, tipo.codigo]);
		var tabla_tipos = $('#'+ id_datatable_tipos_presupuesto_bibliotecas).DataTable({
            destroy: true,
			data: datos_tipos_presupuesto,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre"},
				{title: "Codigo"},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#tipoModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_tipo("#" + id_datatable_tipos_presupuesto_bibliotecas + " tbody", tabla_tipos);
		eliminar_tipo("#" + id_datatable_tipos_presupuesto_bibliotecas + " tbody", tabla_tipos);
	});
}

function editar_genero(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);	
			$('#' + id_nombre_genero_editar_bibliotecas).val(data[0]);
			$('#' + id_codigo_genero_editar_bibliotecas).val(data[1]);
			nombre_seleccionado = data[0];
		}
		
	});
}

function eliminar_genero(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);	
			$('#' + id_label_genero_eliminar_bibliotecas).text(data[0]);
		}
	});
}

function editar_tipo(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);	
			$('#' + id_nombre_tipo_editar_bibliotecas).val(data[0]);
			$('#' + id_codigo_tipo_editar_bibliotecas).val(data[1]);
			nombre_seleccionado = data[0];
		}
	});
}

function eliminar_tipo(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);	
			$('#' + id_label_tipo_eliminar_bibliotecas).text(data[0]);
		}
	});
}

$('#' + id_editar_genero_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_genero_editar_bibliotecas).val();
	var genero = {
		codigo: $('#' + id_codigo_genero_editar_bibliotecas).val(),
		nombre: nom,
	}
	if(nombre_seleccionado === nom){
		firebase.database().ref(rama_bd_generos + "/" + nom).update(genero);
		loadTablaGenerosYTipos();
		alert("Cambios registrados");
	} else {
		firebase.database().ref(rama_bd_generos).child(nombre_seleccionado).once('value').then(function(snapshot){
			var data = snapshot.val();
			data.nombre = nom;
			var update = {};
			update[nombre_seleccionado] = null;
			update[nom] = data;
			firebase.database().ref(rama_bd_generos).update(update);
			firebase.database().ref(rama_bd_generos + "/" + nom).update(genero);
		});
		loadTablaGenerosYTipos();
		alert("Cambios registrados");
	}
});

$('#' + id_eliminar_genero_button_bibliotecas).click(function(){
	firebase.database().ref(rama_bd_generos).child($('#' + id_label_genero_eliminar_bibliotecas).text()).once('value').then(function(snapshot){
		snapshot.getRef().removeValue();
	});
	
	location.reload();
});

$('#' + id_editar_tipo_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_tipo_editar_bibliotecas).val();
	var tipo = {
		codigo: $('#' + id_codigo_tipo_editar_bibliotecas).val(),
		nombre: nom,
	}
	if(nombre_seleccionado === nom){
		firebase.database().ref(rama_bd_tipos_presupuesto + "/" + nom).update(tipo);
		loadTablaGenerosYTipos();
		alert("Cambios registrados");
	} else {
		firebase.database().ref(rama_bd_tipos_presupuesto).child(nombre_seleccionado).once('value').then(function(snapshot){
			var data = snapshot.val();
			data.nombre = nom;
			var update = {};
			update[nombre_seleccionado] = null;
			update[nom] = data;
			firebase.database().ref(rama_bd_tipos_presupuesto).update(update);
			firebase.database().ref(rama_bd_tipos_presupuesto + "/" + nom).update(tipo);
		});
		loadTablaGenerosYTipos();
		alert("Cambios registrados");
	}
});

$('#' + id_eliminar_tipo_button_bibliotecas).click(function(){
	firebase.database().ref(rama_bd_tipos_presupuesto).child($('#' + id_label_tipo_eliminar_bibliotecas).text()).once('value').then(function(snapshot){
		snapshot.getRef().removeValue();
	});

	location.reload();
});

function loadTablaObras(){
	var datos_obras = [];
	firebase.database().ref(rama_bd_obras).orderByChild("nombre").on("child_added",function(snapshot){
		var obra = snapshot.val();
		datos_obras.push([obra.nombre, obra.clave, obra.cliente, obra.direccion.calle + ", No. " + obra.direccion.numero + " Col. " + obra.direccion.colonia + ", " + obra.direccion.delegacion + ", " + obra.direccion.ciudad + " CP " + obra.direccion.cp]);
		var tabla_obras = $('#'+ id_datatable_obras_bibliotecas).DataTable({
            destroy: true,
			data: datos_obras,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre"},
				{title: "Clave"},
				{title: "Cliente"},
				{title: "Direccion", width: 500},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#obraModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
			],
            language: idioma_espanol,
		});
		editar_obra("#" + id_datatable_obras_bibliotecas + " tbody", tabla_obras);
	});
}

function editar_obra(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);
			firebase.database().ref(rama_bd_obras).orderByChild("nombre").equalTo(data[0]).once('child_added').then(function(snapshot){
				var obr = snapshot.val();
				$('#' + id_clave_obra_editar_bibliotecas).val(obr.clave);
				$('#' + id_nombre_obra_editar_bibliotecas).val(obr.nombre);
				$('#' + id_cliente_obra_editar_bibliotecas).val(obr.cliente);
				$('#' + id_dir_calle_obra_editar_bibliotecas).val(obr.direccion.calle);
				$('#' + id_dir_numero_obra_editar_bibliotecas).val(obr.direccion.numero);
				$('#' + id_dir_colonia_obra_editar_bibliotecas).val(obr.direccion.colonia);
				$('#' + id_dir_delegacion_obra_editar_bibliotecas).val(obr.direccion.delegacion);
				$('#' + id_dir_ciudad_obra_editar_bibliotecas).val(obr.direccion.ciudad);
				$('#' + id_dir_cp_obra_editar_bibliotecas).val(obr.direccion.cp);

				nombre_seleccionado = data[0];
			});
		
		}
	});
}

$('#' + id_editar_obra_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_obra_editar_bibliotecas).val();
	var obra = {
		clave: $('#' + id_clave_obra_editar_bibliotecas).val(),
		nombre: nom,
		cliente: $('#' + id_cliente_obra_editar_bibliotecas).val(),
		direccion: {
			calle: $('#' + id_dir_calle_obra_editar_bibliotecas).val(),
			numero: $('#' + id_dir_numero_obra_editar_bibliotecas).val(),
			colonia: $('#' + id_dir_colonia_obra_editar_bibliotecas).val(),
			delegacion: $('#' + id_dir_delegacion_obra_editar_bibliotecas).val(),
			ciudad: $('#' + id_dir_ciudad_obra_editar_bibliotecas).val(),
			cp: $('#' + id_dir_cp_obra_editar_bibliotecas).val(),
		}
	}
	if(nombre_seleccionado === nom){
		firebase.database().ref(rama_bd_obras + "/" + nom).update(obra);
		loadTablaObras();
		alert("Cambios registrados");
	} else {
		firebase.database().ref(rama_bd_registros).orderByChild("obra").equalTo(nombre_seleccionado).on('child_added',function(snapshot){
			var reg = snapshot.key;
			firebase.database().ref(rama_bd_registros + "/" + reg).update({obra: nom});
		});
		firebase.database().ref(rama_bd_inges).on('child_added',function(snapshot){
			var ing = snapshot.val();
			firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras").child(nombre_seleccionado).once('value').then(function(snapshot){
				var data = snapshot.val();
				if(!data){
					//Este inge no trabaja en esa obra
				} else {
					data.obra = nom;
					var update = {};
					update[nombre_seleccionado] = null;
					update[nom] = data;
					firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras").update(update);
					//firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras/" + nom).update(obra);
				}
			});
		});
		firebase.database().ref(rama_bd_obras).child(nombre_seleccionado).once('value').then(function(snapshot){
			var data = snapshot.val();
			data.nombre = nom;

			data.clave = $('#' + id_clave_obra_editar_bibliotecas).val();
			data.cliente = $('#' + id_cliente_obra_editar_bibliotecas).val();
			data.direccion.calle = $('#' + id_dir_calle_obra_editar_bibliotecas).val();
			data.direccion.numero = $('#' + id_dir_numero_obra_editar_bibliotecas).val();
			data.direccion.colonia = $('#' + id_dir_colonia_obra_editar_bibliotecas).val();
			data.direccion.delegacion = $('#' + id_dir_delegacion_obra_editar_bibliotecas).val();
			data.direccion.ciudad = $('#' + id_dir_ciudad_obra_editar_bibliotecas).val();
			data.direccion.cp = $('#' + id_dir_cp_obra_editar_bibliotecas).val();

			var update = {};
			update[nombre_seleccionado] = null;
			update[nom] = data;
			firebase.database().ref(rama_bd_obras).update(update);
			firebase.database().ref(rama_bd_obras + "/" + nom).update(obra);
		});
		loadTablaObras();
		alert("Cambios registrados");
	}
});

function loadTablaInges(){
	var datos_inges = [];
	firebase.database().ref(rama_bd_inges).orderByChild("nombre").on("child_added",function(snapshot){
		var inge = snapshot.val();
		var esp;
		if(inge.especialidad === 1)
			esp = "IE";
		else if(inge.especialidad === 2)
			esp = "IHS";
		else if(inge.especialidad === 3)
			esp = "IE - IHS";
		else 
			esp = "NA";
		datos_inges.push([inge.nombre, inge.nickname, inge.email, esp]);
		var tabla_inges = $('#'+ id_datatable_inges_bibliotecas).DataTable({
            destroy: true,
			data: datos_inges,
			dom: 'Bfrtip',
			buttons: ['excel'],
			columns: [
				{title: "Nombre"},
				{title: "Nombre Corto"},
				{title: "Email"},
				{title: "Especialidad"},
				{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#ingeModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
            ],
            language: idioma_espanol,
		});
		editar_inge("#" + id_datatable_inges_bibliotecas + " tbody", tabla_inges);
	});
}

function editar_inge(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(data[0]).once('child_added').then(function(snapshot){
				var ing = snapshot.val();
				console.log(ing);
				$('#' + id_nombre_inge_editar_bibliotecas).val(ing.nombre);
				$('#' + id_nickname_inge_editar_bibliotecas).val(ing.nickname);
				if(ing.credenciales === 0 || ing.credenciales === 1 || ing.credenciales === 2){
					$("#" + id_creden_admin_inge_editar_radio_bibliotecas).prop("checked", true);
					$("#" + id_creden_proyectista_inge_editar_radio_bibliotecas).prop("checked", false);
				} else if(ing.credenciales === 3){
					$("#" + id_creden_admin_inge_editar_radio_bibliotecas).prop("checked", false);
					$("#" + id_creden_proyectista_inge_editar_radio_bibliotecas).prop("checked", true);
				} else {
					$("#" + id_creden_admin_inge_editar_radio_bibliotecas).prop("checked", false);
					$("#" + id_creden_proyectista_inge_editar_radio_bibliotecas).prop("checked", false);
				}

				if(ing.especialidad === 1){
					$("#" + id_especialidad_elec_inge_editar_checkbox_bibliotecas).prop("checked", true);
					$("#" + id_especialidad_plom_inge_editar_checkbox_bibliotecas).prop("checked", false);
				} else if(ing.especialidad === 2){
					$("#" + id_especialidad_elec_inge_editar_checkbox_bibliotecas).prop("checked", false);
					$("#" + id_especialidad_plom_inge_editar_checkbox_bibliotecas).prop("checked", true);
				} else if(ing.especialidad === 3){
					$("#" + id_especialidad_elec_inge_editar_checkbox_bibliotecas).prop("checked", true);
					$("#" + id_especialidad_plom_inge_editar_checkbox_bibliotecas).prop("checked", true);
				} else {
					$("#" + id_especialidad_elec_inge_editar_checkbox_bibliotecas).prop("checked", false);
					$("#" + id_especialidad_plom_inge_editar_checkbox_bibliotecas).prop("checked", false);
				}
			});
		nombre_seleccionado = data[0];
		}	
	});
}

$('#' + id_editar_inge_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_inge_editar_bibliotecas).val();
	var espec;
    var creden;
    if(document.getElementById(id_especialidad_elec_inge_editar_checkbox_bibliotecas).checked === true){
        if(document.getElementById(id_especialidad_plom_inge_editar_checkbox_bibliotecas).checked === true){
            espec = 3; //especialidad ambas
        }
        else
            espec = 1; //especialidad elec
    }
    else if(document.getElementById(id_especialidad_plom_inge_editar_checkbox_bibliotecas).checked == true)
        espec = 2; //especialidad plom
    else espec = -1; //no ingresada

    if(document.getElementById(id_creden_admin_inge_editar_radio_bibliotecas).checked == true){
    	creden = 2;
    } else if(document.getElementById(id_creden_proyectista_inge_editar_radio_bibliotecas).checked == true){
		creden = 3;
	} else {
		creden = -1;
	}

	var inge = {
		especialidad: espec,
		nombre: nom,
		credenciales: creden,
		nickname: $('#' + id_nickname_inge_editar_bibliotecas).val(),
	}

	firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		var ing =  snapshot.val();
		if(nombre_seleccionado !== nom){
			firebase.database().ref(rama_bd_registros).orderByChild("inge").equalTo(nombre_seleccionado).on('child_added',function(snapshot){
				var reg = snapshot.key;
				firebase.database().ref(rama_bd_registros + "/" + reg ).update({inge: nom});
			});
		}
		firebase.database().ref(rama_bd_inges + "/" + ing.uid).update(inge);
		loadTablaInges();
		alert("Cambios registrados");
	});
	
});

function loadTablaPresupuestos(){
	var datos_presupuestos = [];
	firebase.database().ref(rama_bd_obras).orderByChild("nombre").on("child_added",function(snapshot){
		var obr = snapshot.val();
		firebase.database().ref(rama_bd_obras + "/" + obr.nombre + "/presupuestos").orderByChild("nombre").on("child_added",function(snapshot){
			var presupuesto = snapshot.val();
			var contrato;
			var terminado;
			var oculto;
			var clase;

			if(presupuesto.clase === "produccion")
				clase = "Producción";
			else if(presupuesto.clase === "miscelaneo")
				clase = "Misceláneo";
			else if(presupuesto.clase === "cliente")
				clase = "Cliente";
			else
				clase = "NA";

			if(presupuesto.oculto === true)
				oculto = "Oculto";
			else
				oculto = "No oculto";
			if(presupuesto.contrato === true)
				contrato = "Contrato";
			else
				contrato = "Presupuesto";
			if(presupuesto.terminado === true)
				terminado = "Terminado";
			else
				terminado = "No terminado";
			var atn = "";
			for(i=0;i<snapshot.child("atencion").numChildren();i++){
				atn = atn + snapshot.child("atencion/" +i).val().id + "\n";
			}
			var fecha_act;
			var cash = "$" + formatMoney(presupuesto.cash_presupuestado);
			if(presupuesto.timestamps.activacion === 0)
				fecha_act = "NA";
				else{
					fecha_act = new Date(presupuesto.timestamps.activacion).toLocaleDateString("es-ES", options_bibliotecas)
				}
				fecha_inicio = new Date(presupuesto.timestamps.startedAt).toLocaleDateString("es-ES", options_bibliotecas)
			//alert(atn);
			datos_presupuestos.push([presupuesto.nombre, obr.nombre, clase,cash, presupuesto.clave, contrato, terminado, oculto, presupuesto.horas_programadas, fecha_inicio, fecha_act, atn]);
			var tabla_presupuestos = $('#'+ id_datatable_presupuestos_bibliotecas).DataTable({
				destroy: true,
				scrollX: true,
				data: datos_presupuestos,
				dom: 'Bfrtip',
				buttons: ['excel'],
				columns: [
					{title: "Nombre"},
					{title: "Obra"},
					{title: "Clase"},
					{title: "Precio total"},
					{title: "Clave"},
					{title: "Contrato"},
					{title: "Terminado"},
					{title: "Oculto"},
					{title: "Horas programadas"},
					{title: "Fecha de creacion"},
					{title: "Fecha de activacion"},
					{title: "AT'N"},
					//{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#presuModalEditar'><i class='fas fa-edit'></i></button>"},
				],
	            language: idioma_espanol,
			});
			//editar_presupuesto("#" + id_datatable_presupuestos_bibliotecas + " tbody", tabla_presupuestos);
		});
	});
}

/* var obra_presu;
function editar_presupuesto(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			$('#' + id_clase_ddl_presu_editar_bibliotecas).empty();

			var select = document.getElementById(id_clase_ddl_presu_editar_bibliotecas);   
			var option2 = document.createElement('option');
    		option2.style = "display:none";
    		option2.text = option2.value = "NA";
    		select.appendChild(option2);
			
			firebase.database().ref(rama_bd_clase).orderByChild('nombre').on('child_added',function(snapshot){
        
				var clase = snapshot.val();
				var option = document.createElement('OPTION');
				option.text = clase.nombre; 
				option.value = clase.codigo;
				select.appendChild(option);
		
			});
			
			firebase.database().ref(rama_bd_obras).orderByKey().equalTo(data[1]).on('child_added',function(snapshot){
				var obra = snapshot.val();
				console.log(obra);
				$('#' + id_nombre_presu_editar_bibliotecas).val(data[0]);
				$('#' + id_clase_ddl_presu_editar_bibliotecas).val(data[2]);//AQUI
				$('#' + id_precio_presu_editar_bibliotecas).val(data[3]);
				$('#' + id_horas_presu_editar_bibliotecas).val(data[8]);
				obra_presu = obra.nombre;
			});
		nombre_seleccionado = data[0];
		}	
	});
} */

/* $('#' + id_editar_presu_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_presu_editar_bibliotecas).val();
	var cash_str = $('#' + id_precio_presu_editar_bibliotecas).val();
	var cash_sin_coma = cash_str.replace(",","");
	var cash_num = cash_sin_coma.replace("$","");
	var presu = {
		cash_presupuestado: parseFloat(cash_num),
		nombre: nom,
		horas_programadas: $('#' + id_horas_presu_editar_bibliotecas).val(),
		clase: $('#' + id_clase_ddl_presu_editar_bibliotecas + " option:selected").text(),
	}
	if(nombre_seleccionado === nom){
		firebase.database().ref(rama_bd_obras + "/" + obra_presu + "/presupuestos/" + nombre_seleccionado).update(presu);
		loadTablaPresupuestos();
		alert("Cambios registrados");
	} else {
		firebase.database().ref(rama_bd_registros).orderByChild("presupuesto").equalTo(nombre_seleccionado).on('child_added',function(snapshot){
			var reg = snapshot.key;
			firebase.database().ref(rama_bd_registros + "/" + reg).update({presupuesto: nom});
		});
		firebase.database().ref(rama_bd_inges).on('child_added',function(snapshot){
			var ing = snapshot.val();
			firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras/" + obra_presu).child(nombre_seleccionado).once('value').then(function(snapshot){
				var data = snapshot.val();
				if(!data){
					//Este inge no trabaja en ese presu
				} else {
					data.presupuesto = nom;
					var update = {};
					update[nombre_seleccionado] = null;
					update[nom] = data;
					firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras/" + ob.nombre).update(update);
					//firebase.database().ref(rama_bd_inges + "/" + ing.uid + "/obras/" + ob.nombre + "/" + nom).update(presu);
				}
			});
		});
		firebase.database().ref(rama_bd_obras + "/" + obra_presu + "/presupuestos").child(nombre_seleccionado).once('value').then(function(snapshot){
			var data = snapshot.val();
			data.nombre = nom;
			var update = {};
			update[nombre_seleccionado] = null;
			update[nom] = data;
			firebase.database().ref(rama_bd_obras + "/" + obra_presu + "/presupuestos").update(update);
			firebase.database().ref(rama_bd_obras + "/" + obra_presu + "/presupuestos/" + nom).update(presu);
			loadTablaPresupuestos();
			alert("Cambios registrados");
		});
	}
}); */

function loadTablaAtn(){
	var datos_atn = [];
	firebase.database().ref(rama_bd_clientes).orderByChild("nombre").on("child_added",function(snapshot){
		var clie = snapshot.val();
		firebase.database().ref(rama_bd_clientes + "/" + clie.nombre + "/atencion").orderByChild("nombre").on("child_added",function(snapshot){
			var atn = snapshot.val();
			datos_atn.push([atn.nombre, clie.nombre, atn.email, atn.area, atn.celular, atn.extension]);
			var tabla_atn = $('#'+ id_datatable_atn_bibliotecas).DataTable({
	            destroy: true,
				data: datos_atn,
				dom: 'Bfrtip',
				buttons: ['excel'],
				columns: [
					{title: "Nombre"},
					{title: "Cliente"},
					{title: "Email"},
					{title: "Area"},
					{title: "Celular"},
					{title: "Extension"},
					{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#atnModalEditar'><i class='fas fa-edit'></i></button> <button type='button' " + boton_eliminar_class + "><i class='fas fa-trash'></i></button>"},
				],
	            language: idioma_espanol,
			});
			editar_atn("#" + id_datatable_atn_bibliotecas + " tbody", tabla_atn);
			eliminar_atn("#" + id_datatable_atn_bibliotecas + " tbody", tabla_atn);
		});
	});
}

var cliente_atn;
function editar_atn(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			console.log(data);	
			$('#' + id_nombre_atn_editar_bibliotecas).val(data[0]);
			cliente_atn = data[1];
			$('#' + id_email_atn_editar_bibliotecas).val(data[2]);
			$('#' + id_area_atn_editar_bibliotecas).val(data[3]);
			$('#' + id_celular_atn_editar_bibliotecas).val(data[4]);
			$('#' + id_extension_atn_editar_bibliotecas).val(data[5]);
			
			nombre_seleccionado = data[0];
		}
	});
}

function eliminar_atn(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			//console.log(data);	
			$('#' + id_label_atn_eliminar_bibliotecas).text(data[0]);
			cliente_atn = data[1];
		}
	});
}

$('#' + id_editar_atn_button_bibliotecas).click(function(){
	var nom = $('#' + id_nombre_atn_editar_bibliotecas).val();
	var atn = {
		nombre: nom,
		email: $('#' + id_email_atn_editar_bibliotecas).val(),
		area: $('#' + id_area_atn_editar_bibliotecas).val(),
		celular: $('#' + id_celular_atn_editar_bibliotecas).val(),
		extension: $('#' + id_extension_atn_editar_bibliotecas).val(),
	}
	firebase.database().ref(rama_bd_clientes + "/" + cliente_atn + "/atencion").orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		var a = snapshot.key;
		firebase.database().ref(rama_bd_clientes + "/" + cliente_atn + "/atencion/" +  a).update(atn);
		loadTablaAtn();
		alert("Cambios registrados");
	});
});

$('#' + id_eliminar_atn_button_bibliotecas).click(function(){
	firebase.database().ref(rama_bd_clientes + "/" + cliente_atn + "atencion").orderByChild("nombre").equalTo(nombre_seleccionado).once('child_added').then(function(snapshot){
		snapshot.getRef().removeValue();
	});
	location.reload();
});

//AQUI
function loadTablaPagos(){
	var datos_pagos = [];
	firebase.database().ref(rama_bd_obras).orderByChild("nombre").on("child_added",function(snapshot){
		var obr = snapshot.val();
		firebase.database().ref(rama_bd_obras + "/" + obr.nombre + "/presupuestos").orderByChild("nombre").on("child_added",function(snapshot){
			var presupuesto = snapshot.val();
			firebase.database().red(rama_bd_obras + "/" + obr.nombre + "/presupuestos/" + presupuesto.nombre + "/pagos").on("child_added", function(snapshot){
				var pago = snapshot.val();
				var imagen;
				if(pago.imagen.url){
					imagen = "Sí";
				} else {
					imagen = "No";
				}
				datos_pagos.push([obr.nombre, presupuesto.nombre, pago.fecha_dia, pago.concepto, pago.monto, imagen, pago.cu]);

				var tabla_pagos = $('#'+ id_datatable_pagos_bibliotecas).DataTable({
					destroy: true,
					scrollX: true,
					data: datos_pagos,
					dom: 'Bfrtip',
					buttons: ['excel'],
					columns: [
						{title: "Obra"},
						{title: "Presupuesto"},
						{title: "Fecha"},
						{title: "Concepto"},
						{title: "Monto"},
						{title: "Imagen"},
						{title: "CU", class: "hidden"}, //AQUI, si truena borrar el hidden
						{defaultContent: "<button type='button' " + boton_editar_class + "data-toggle='modal' data-target='#presuModalEditar'><i class='fas fa-edit'></i></button>"},
					],
		            language: idioma_espanol,
				});
				editar_pagos("#" + id_datatable_pagos_bibliotecas + " tbody", tabla_pagos);
			});
			
		});
	});
}

//AQUI
var monto_pagos;
var obra_pago;
var ppto_pago;
var cu_pago;
function editar_pagos(tbody, table){
	$(tbody).on("click", "button.editar",function(){
		var data = table.row($(this).parents("tr")).data();
		if(data){
			console.log(data);	
			obra_pago = data[0];
			ppto_pago = data[1];
			$('#' + id_concepto_pagos_editar_bibliotecas).val(data[3]);
			$('#' + id_monto_pagos_editar_bibliotecas).val(data[4]);
			monto_pagos = data[4];
			cu_pago = data[6];			
		}
	});
}
//AQUI
$('#' + id_editar_pagos_button_bibliotecas).click(function(){
	var pago = {
		concepto: $('#' + id_concepto_pagos_editar_bibliotecas).val(),
		monto: $('#' + id_monto_pagos_editar_bibliotecas).val(),
	}
	firebase.database().ref(rama_bd_obras + "/" + obra_pago + "/presupuestos/" + ppto_pago + "/pagos/" + cu_pago).update(pago);
	//AQUI meter imagen
	if($('#' + id_monto_pagos_editar_bibliotecas).val() != monto_pagos){
		firebase.data().ref(rama_bd_obras + "/" + obra_pago + "/presupuestos").orderByKey().equalTo(ppto_pago).once("child_added").then(function(snapshot){
			var ppto = snapshot.val();
			var nuevo_cash = parseFloat(ppto.cash_pagado) - parseFloat(monto_pagos) + parseFloat($('#' + id_monto_pagos_editar_bibliotecas).val());
			firebase.database().ref(rama_bd_obras + "/" + obra_pago + "/presupuestos/" + ppto_pago + "/cash_pagado").update(nuevo_cash);
			loadTablaAtn();
		});
	} else {
		loadTablaAtn();
	}
	alert("Cambios registrados");
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