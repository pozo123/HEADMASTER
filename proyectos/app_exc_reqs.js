var id_nombre_exclusion = "nombreExclusion";
var id_nombre_req= "nombreReq";
var id_esencial_radio_req = "radioEsen";

var id_agregar_button_exclusion = "agregarExclusion";
var id_agregar_button_req = "agregarReq";

var rama_bd_exclusiones = "proyectos/exclusiones";
var rama_bd_reqs = "proyectos/reqs";

$('#' + id_agregar_button_exclusion).click(function(){
	var exc = {
		nombre: $('#' + id_nombre_exclusion).val(),
	}
	var num_exc = 0;
	firebase.database().ref(rama_bd_exclusiones).orderByKey().once('value',function(data){
		var exclu = data.val();
		num_exc = Object.keys(exclu).length + 1;
		firebase.database().ref(rama_bd_exclusiones + "/exc" + num_exc).set(exc);
    });
    
    alert('alta de exclusión exitosa!');
});

$('#' + id_agregar_button_req).click(function(){
	var esen;
	if(document.getElementById(id_esencial_radio_req).checked === true)
		esen = true;
	else
		esen = false;
	var req = {
		nombre: $('#' + id_nombre_req).val(),
		esencial: esen,
	}
	var num_req = 0;
	firebase.database().ref(rama_bd_reqs).orderByKey().once('value',function(data){
		var r = data.val();
		num_req = Object.keys(r).length + 1;
		firebase.database().ref(rama_bd_reqs + "/req" + num_req).set(req);
    });
    
    alert('alta de requisito exitosa!')
});