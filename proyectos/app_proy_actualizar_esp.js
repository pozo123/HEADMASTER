var id_rb_ie_esp = "ieRbEsp";//Mismo name
var id_rb_ihs_esp = "ihsRbEsp";//Mismo name

var id_actualizar_button_esp = "actualizarButtonEsp";

var rama_bd_personal = "personal";

var tab_actualizar_esp = "tabActualizarEsp";

var user;

$('#' + tab_actualizar_esp).click(function(){
	user = firebase.auth().currentUser.uid;
	firebase.database().ref(rama_bd_personal + "/" + user).once('value').then(function(snapshot){
		if(snapshot.child("esp").exists()){
			var esp = snapshot.child("esp").val();
			if(esp == "ie"){
                document.getElementById(id_rb_ie_esp).checked = true;
            }
            else if(esp == "ihs"){
                document.getElementById(id_rb_ihs_esp).checked = true;
            }
		} else {
			alert("No tienes especialidad asignada");
		}
	});
});

$('#' + id_actualizar_button_esp).click(function(){
	var esp;
	if(document.getElementById(id_rb_ie_esp).checked){
		esp = "ie";
	} else {
		esp = "ihs";
	}
	firebase.database().ref(rama_bd_personal + "/" + user + "/esp").set(esp);
	alert("Especialidad actualizada");
});