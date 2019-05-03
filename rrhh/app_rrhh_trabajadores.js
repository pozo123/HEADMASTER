var id_nombre_trabajador = "trabajadorNombre";//textfield *necesario
var id_puesto_ddl_trabajador = "trabajadorPuesto";//ddl *necesario
var id_obra_ddl_trabajador = "trabajadorObra";//ddl
var id_id_trabajador = "trabajadorId";//textfield
var id_generar_id_trabajador = "trabajadorGenerarId";//checkbox
var id_sueldo_base_trabajador = "trabajadorSueldoBase";//textfield *necesario
var id_destajista_ddl_trabajador = "trabajadorDestajista";//NUEVO ddl
var id_fecha_antiguedad_trabajador = "trabajadorFechaAntiguedad";//datepicker
var id_especialidad_ddl_trabajador = "trabajadorEspecialidad";//ddl *necesario
var id_activo_trabajador = "trabajadorActivo";//checkbox
var id_clave_pagadora_trabajador = "trabajadorClavePagadora";//textfield *necesario
//claves
var id_RFC_trabajador = "trabajadorRFC";//textfield *necesario
var id_IMSS_trabajador = "trabajadorIMSS";//textfield *necesario
var id_CURP_trabajador = "trabajadorCURP";//textfield *necesario
//info_personal
var id_fecha_nacimiento_trabajador = "trabajadorFechaNacimiento";//datepicker
var id_estado_civil_ddl_trabajador = "trabajadorEstadoCivil";//ddl
var id_sexo_trabajador = "trabajadorSexo";//textfield
var id_domicilio_trabajador = "trabajadorDomicilio";//textfield
//datos_bancarios
var id_banco_trabajador = "trabajadorBanco";//textfield *necesario
var id_cuenta_trabajador = "trabajadorCuenta";//textfield *necesario
var id_clabe_trabajador = "trabajadorClabe";//textfield *necesario
//tallas
var id_camisa_trabajador = "trabajadorCamisa";//textfield
var id_pantalon_trabajador = "trabajadorPantalon";//textfield
var id_zapatos_trabajador = "trabajadorZapatos";//textfield

var id_groupId_trabajador = "groupIdTrabajador"
var id_registrar_button_trabajador = "registrarTrabajador";//button

var rama_bd_trabajadores = "produccion/trabajadores";
var rama_bd_destajistas = "produccion/destajistas";
var rama_bd_obras_prod = "produccion/obras";

var id_tab_trabajadores = "tabTrabajadores";

$('#' + id_tab_trabajadores).click(function(){
	$('#' + id_especialidad_ddl_trabajador).empty();
	$('#' + id_puesto_ddl_trabajador).empty();
	$('#' + id_obra_ddl_trabajador).empty();
	$('#' + id_estado_civil_ddl_trabajador).empty();
	$('#' + id_groupId_trabajador).val("");
	$('#' + id_groupId_trabajador).addClass('hidden');
	
	$("#" + id_generar_id_trabajador).prop("checked", true);

	jQuery('#' + id_fecha_antiguedad_trabajador).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
	);
	
	jQuery('#' + id_fecha_nacimiento_trabajador).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    
    var select_obra = document.getElementById(id_obra_ddl_trabajador); 
	var select_esp = document.getElementById(id_especialidad_ddl_trabajador); 
	var select_puesto = document.getElementById(id_puesto_ddl_trabajador); 
	var select_edoc = document.getElementById(id_estado_civil_ddl_trabajador); 
	var select_dest = document.getElementById(id_destajista_ddl_trabajador); 

	var options_esp = ["ALM", "EMP", "IE", "IHS", "OE", "RTC", "UHS"]; 
	var options_puesto = ["Almacenista", "Ayudante", "Ayudante General", "Empacadora", "Encargado", "Medio Oficial", "Oficial", "Supervisor", "Supervisor de Obra"]; 
	var options_edoc = ["Casado/a", "Soltero/a", "Viudo/a", "Union Libre", "Divorciado/a"]; 
	
	var option3 = document.createElement('option');
	option3.style = "display:none";
	option3.text = option3.value = "";
	select_obra.appendChild(option3);
	var option4 = document.createElement('option');
	option4.style = "display:none";
	option4.text = option4.value = "";
	select_esp.appendChild(option4);
	var option5 = document.createElement('option');
	option5.style = "display:none";
	option5.text = option5.value = "";
	select_puesto.appendChild(option5);
	var option6 = document.createElement('option');
	option6.style = "display:none";
	option6.text = option6.value = "";
	select_edoc.appendChild(option6);
	var option7 = document.createElement('option');
	option7.style = "display:none";
	option7.text = option7.value = "";
	select_dest.appendChild(option7);

	for(var i=0; i<options_esp.length; i++){
		var opt = options_esp[i];
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = opt;
	    select_esp.appendChild(el);
	}

	for(var i=0; i<options_puesto.length; i++){
	    var opt = options_puesto[i];
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = opt;
	    select_puesto.appendChild(el);
	}

	for(var i=0; i<options_edoc.length; i++){
	    var opt = options_edoc[i];
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = opt;
	    select_edoc.appendChild(el);
	}

    firebase.database().ref(rama_bd_obras_prod).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option8 = document.createElement('OPTION');
        option8.text = obra.nombre;
        option8.value = obra.nombre;
        select_obra.appendChild(option8);
    });

    firebase.database().ref(rama_bd_destajistas).orderByChild('nombre').on('child_added',function(snapshot){
        var dest = snapshot.val();
        var option9 = document.createElement('OPTION');
        option9.text = dest.nombre;
        option9.value = dest.nombre;
        select_dest.appendChild(option9);
    });
});

$('#' + id_generar_id_trabajador).change(function(){
	if($('#' + id_generar_id_trabajador).prop('checked')){
		$('#' + id_groupId_trabajador).val("");
		$('#' + id_groupId_trabajador).addClass('hidden');
	} else {
		$('#' + id_groupId_trabajador).removeClass('hidden');
	}
});

$('#' + id_registrar_button_trabajador).click(function () {
    if($('#' + id_destajista_ddl_trabajador + " option:selected").val() == "" ||($('#' + id_id_trabajador).val() == "" && $('#' + id_generar_id_trabajador).is(':checked')) ||$('#' + id_clabe_trabajador).val() == "" ||$('#' + id_cuenta_trabajador).val() == "" ||$('#' + id_banco_trabajador).val() == "" ||$('#' + id_CURP_trabajador).val() == "" ||$('#' + id_IMSS_trabajador).val() == "" ||$('#' + id_RFC_trabajador).val() == "" ||$('#' + id_clave_pagadora_trabajador).val() == "" ||$('#' + id_especialidad_ddl_trabajador + " option:selected").val() == "" ||$('#' + id_sueldo_base_trabajador).val() == "" ||$('#' + id_puesto_ddl_trabajador + " option:selected").val() == "" || $('#' + id_nombre_trabajador).val() == ""){
        alert("Llena todos los campos requeridos");
    } else {
    	var trabajador = {
			nombre: $('#' + id_nombre_trabajador).val(),
			id_trabajador: "",
			obra_asignada: {
				0: $('#' + id_obra_ddl_trabajador + " option:selected").val(),
			},
			puesto: $('#' + id_puesto_ddl_trabajador + " option:selected").val(),
			sueldo_base: $('#' + id_sueldo_base_trabajador).val(),
			jefe: $('#' + id_destajista_ddl_trabajador + " option:selected").val(),
			fecha_antiguedad: new Date($('#' + id_fecha_antiguedad_trabajador).val()).getTime(),
			especialidad: $('#' + id_especialidad_ddl_trabajador + " option:selected").val(),
			activo: $('#' + id_activo_trabajador).is(':checked'),
			clave_pagadora: $('#' + id_clave_pagadora_trabajador).val(),
			claves: {
				RFC: $('#' + id_RFC_trabajador).val(),
				IMSS: $('#' + id_IMSS_trabajador).val(),
				CURP: $('#' + id_CURP_trabajador).val(),
			},
			info_personal: {
				fecha_nacimiento: new Date($('#' + id_fecha_nacimiento_trabajador).val()).getTime(),
				estado_civil: $('#' + id_estado_civil_ddl_trabajador + " option:selected").val(),
				sexo: $('#' + id_sexo_trabajador).val(),
				domicilio: $('#' + id_domicilio_trabajador).val(),
			},
			datos_bancarios: {
				banco: $('#' + id_banco_trabajador).val(),
				cuenta: $('#' + id_cuenta_trabajador).val(),
				clabe: $('#' + id_clabe_trabajador).val(),
			},
			tallas: {
				camisa: $('#' + id_camisa_trabajador).val(),
				pantalon: $('#' + id_pantalon_trabajador).val(),
				zapatos: $('#' + id_zapatos_trabajador).val(),
			},
		}
		firebase.database().ref(rama_bd_trabajadores + "/num_trabajadores_id").once('value').then(function(snapshot){
			var num_trabajadores = parseInt(snapshot.val());
			var id_trabajador;
			if($('#' + id_generar_id_trabajador).is(':checked')){
				id_trabajador = num_trabajadores + 1;
				trabajador["id_trabajador"] = id_trabajador;
				firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador).set(trabajador);
				firebase.database().ref(rama_bd_trabajadores + "/num_trabajadores_id").set(id_trabajador);
				alert("Alta exitosa!");
	    	} else {
	    		id_trabajador = $('#' + id_id_trabajador).val();
				trabajador["id_trabajador"] = id_trabajador;
	    		firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador).once('value').then(function(snapshot){
	    			if(snapshot.val() != null){
	    				alert("Ya existe un trabajador con ese ID");
	    			} else {
	    				if(id_trabajador > num_trabajadores){
							firebase.database().ref(rama_bd_trabajadores + "/num_trabajadores_id").set(id_trabajador);
	    				}
						firebase.database().ref(rama_bd_trabajadores + "/" + id_trabajador).set(trabajador);
						alert("Alta exitosa!");
	    			}
	    		});
	    	}
		});
    }
});