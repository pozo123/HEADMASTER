
var id_obra_ddl_gestionar_ppto = "obraDdlGestionarScore";
var id_proceso_ddl_gestionar_score = "procesoDdlGestionarScore";
var form_gestionar_score = "formGestionarScore";

var id_button_terminado_terminar_score = "terminarButtonGestionarScore";

var terminado_gestionar_score;
var ppto_prog_kaizen_gestionar_score = 0;
var ppto_pag_kaizen_gestionar_score = 0;
var query;

tab_gestionar_score = "tabGestionarScore";

$('#' + tab_gestionar_score).click(function(){
	buttonTerminado(false);
	$('#' + form_gestionar_score).trigger("reset");
	$('#' + id_obra_ddl_gestionar_ppto).empty();

    var select = document.getElementById(id_obra_ddl_gestionar_ppto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);
    if(areas_usuario_global.administracion || creden_usuario_global < 3){
		for(key in nombre_obras){
	        if(!nombre_obras[key].terminada){
	            var option2 = document.createElement('OPTION');
	            option2.text = key;
	            option2.value = key;
	            select.appendChild(option2);
	        }
	    }
	}
});

$("#" + id_obra_ddl_gestionar_ppto).change(function(){
	buttonTerminado(false);
	$('#' + id_proceso_ddl_gestionar_score).empty();
    var select = document.getElementById(id_proceso_ddl_gestionar_score);
    var option = document.createElement('option');
	option.text = option.value = "";
	option.style = "display:none"
    select.appendChild(option);

	for(key in nombre_obras[$('#' + id_obra_ddl_gestionar_ppto + " option:selected").val()]["hojas"]){
		if(key != "MISC"){
	    	var option2 = document.createElement('OPTION');
	        option2.text = key + " (" + nombre_obras[$('#' + id_obra_ddl_gestionar_ppto + " option:selected").val()]["hojas"][key].nombre + ")";
	        option2.value = key;
	        select.appendChild(option2);
	    }
    }
});

$('#' + id_proceso_ddl_gestionar_score).change(function(){

	var proc = $('#' + id_proceso_ddl_gestionar_score + " option:selected").val();
	query = proc.split("-").length > 1 ? proc.split('-')[0] + "/subprocesos/" + proc : proc;
	
	gestionarProceso(query);
	fillGestionarScoreTable();
});

// Función para terminar proceso, necesito como se modifica Kaiz
function gestionarProceso(query){
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar_ppto + " option:selected").val() + "/procesos/" + query).once('value').then(function(snapshot){

		ppto_prog_kaizen_gestionar_score = snapshot.child("kaizen/PROYECTOS/PPTO").val();
		ppto_pag_kaizen_gestionar_score = snapshot.child("kaizen/PROYECTOS/PAG").val(); // 0 si no se ha terminado

		if(snapshot.child("SCORE/terminado").val()){
			terminado_gestionar_score = true;	
		} else {
			terminado_gestionar_score = false;
		}
		buttonTerminado();
	});
};


$('#' + id_button_terminado_terminar_score).click(function(){
	if(!terminado_gestionar_score){
		trickleDownKaizen($('#' + id_obra_ddl_gestionar_ppto + " option:selected").val() , $('#' + id_proceso_ddl_gestionar_score + " option:selected").val(), "PROYECTOS/PAG", ppto_prog_kaizen_gestionar_score, true)
		terminado_gestionar_score = true;
	} else {
		trickleDownKaizen($('#' + id_obra_ddl_gestionar_ppto + " option:selected").val() , $('#' + id_proceso_ddl_gestionar_score + " option:selected").val(), "PROYECTOS/PAG", -1 * ppto_pag_kaizen_gestionar_score, true)
		terminado_gestionar_score = false;
	}
	
	firebase.database().ref(rama_bd_obras + "/" + $('#' + id_obra_ddl_gestionar_ppto + " option:selected").val() + "/procesos/" + query + "/SCORE/terminado").set(terminado_gestionar_score);
	buttonTerminado();
	alert('Actualización exitosa!')
});


function fillGestionarScoreTable(){
	// AQUI
};

function buttonTerminado(){
	if(terminado_gestionar_score){
		$('#' + id_button_terminado_terminar_score).removeClass('btn btn-outline-danger btn-block');
		$('#' + id_button_terminado_terminar_score).addClass('btn btn-outline-warning btn-block');
		$('#' + id_button_terminado_terminar_score).text('Desterminar');
	} else {
		$('#' + id_button_terminado_terminar_score).removeClass('btn btn-outline-warning btn-block');
		$('#' + id_button_terminado_terminar_score).addClass('btn btn-outline-danger btn-block');
		$('#' + id_button_terminado_terminar_score).text('Terminar');
	}
}