
tab_gestionar_score = "tabGestionarScore"

$('#' + tab_kaizen_ppto).click(function(){
	$('#' + form_kaizen_ppto).trigger("reset");
	$('#' + id_obra_ddl_kaizen_ppto).empty();
    var select = document.getElementById(id_obra_ddl_kaizen_ppto);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

	var aut = (areas_usuario_global.administracion || creden_usuario_globalfalse < 3);

    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnap){
        	var obra = childSnap.val();
        	var aut_local = false;
        	if(!obra.terminada){
	        	if(aut || aut_local){
			        var option2 = document.createElement('OPTION');
			        option2.text = obra.nombre;
			        option2.value = obra.nombre;
			        select.appendChild(option2);
			    }
        	}
        });
    });
});