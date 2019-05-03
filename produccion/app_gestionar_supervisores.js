var id_obras_ddl_supervisores = "obraDdlSupervisores";
var id_supervisores_ddl_supervisores = "supervisoresDdlSupervisores";
var id_div_obra_supervisores = "divObraSupervisores";
var id_div_supervisor_supervisores = "divSupervisorSupervisores";

var rama_bd_obras_prod = "produccion/obras";
var rama_bd_obra_magico = "obras";
var rama_bd_supervisores = "produccion/colaboradores";

$('#tabGestionarSup').click(function(){

    var select = document.getElementById(id_supervisores_ddl_supervisores) ;
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_supervisores).orderByChild('nombre').on('child_added',function(snapshot){
        var sup = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = sup.nombre;
        option2.value = sup.uid;
        select.appendChild(option2);
    });

    var select2 = document.getElementById(id_obras_ddl_supervisores) ;
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option.value = "";
    select2.appendChild(option3);

    firebase.database().ref(rama_bd_obras_prod).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option4 = document.createElement('OPTION');
        option4.text = obra.nombre;
        option4.value = obra.nombre;
        select2.appendChild(option4);
    });   
});

$('#' + id_obras_ddl_supervisores).change(function(){
	var div = document.getElementById(id_div_obra_supervisores);
	$('#' + id_div_obra_supervisores).empty();
	var nombre_obra = $('#' + id_obras_ddl_supervisores + " option:selected").val();
	firebase.database().ref(rama_bd_obras_prod + "/" + nombre_obra).once('value').then(function(snapshot){
		var obra = snapshot.val();
		snapshot.child("supervisores").forEach(function(childSnap){
			var row = document.createElement('div');
			var label = document.createElement('label');
			label.innerHTML = childSnap.val().nombre;
			var button = document.createElement('button');
			button.id = childSnap.key;
			button.innerHTML = "Eliminar";
			button.click(function(){
				var fal = false;
				firebase.database().ref(rama_bd_supervisores + "/" + this.id + "/obras/" + obra.nombre + "/activa").set(fal);
                firebase.database().ref(rama_bd_obras_prod + "/" + obra.nombre + "/supervisor/" + this.id + "/activo").set(fal);
                firebase.database().ref(rama_bd_obra_magico + "/" + obra.nombre + "/supervisor/" + this.id + "/activo").set(fal);
			});
			row.appendChild(label);
			row.appendChild(button);
			div.appendChild(row);
		});
	});

	var select = document.createElement('select');
	select.id = "supParaObraDdl";
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_supervisores).orderByChild('nombre').on('child_added',function(snapshot){
        var sup = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = sup.nombre;
        option2.value = sup.uid;
        select.appendChild(option2);
    });

    var buttonAdd = document.createElement('button');
    buttonAdd.click(function(){
    	var obr = {
    		nombre: nombre_obra,
    		activa: true,
    	}
    	var sup_uid = $('#supParaObraDdl option:selected').val();
    	firebase.database().ref(rama_bd_supervisores + "/" + sup_uid + "/obras/" + nombre_obra).set(obr);
    	
    	var sup = {
    		nombre: $('#supParaObraDdl option:selected').text(),
    		activo: true,
    	}
        firebase.database().ref(rama_bd_obras_prod + "/" + nombre_obra + "/supervisor/" + sup_uid).set(sup);
        firebase.database().ref(rama_bd_obra_magico + "/" + nombre_obra + "/supervisor/" + sup_uid).set(sup);
    });

    div.appendChild(select);
    div.appendChild(buttonAdd);
});

$('#' + id_supervisores_ddl_supervisores).change(function() {
	var div = document.getElementById(id_div_supervisor_supervisores);
	$('#' + id_div_supervisor_supervisores).empty();
	var sup_uid = $('#' + id_supervisores_ddl_supervisores + " option:selected").val();
	firebase.database().ref(rama_bd_supervisores + "/" + sup_uid).once('value').then(function(snapshot){
		var supervisor = snapshot.val();
		snapshot.child("obras").forEach(function(childSnap){
			var row = document.createElement('div');
			var label = document.createElement('label');
			label.innerHTML = childSnap.val().nombre;
			var button = document.createElement('button');
			button.id = childSnap.val().nombre;
			button.innerHTML = "Eliminar";
			button.click(function(){
				var fal = false;
				firebase.database().ref(rama_bd_supervisores + "/" + supervisor.uid + "/obras/" + this.id + "/activa").set(fal);
                firebase.database().ref(rama_bd_obras_prod + "/" + this.id + "/supervisor/" + supervisor.uid + "/activo").set(fal);
                firebase.database().ref(rama_bd_obra_magico + "/" + this.id + "/supervisor/" + supervisor.uid + "/activo").set(fal);
			});
			row.appendChild(label);
			row.appendChild(button);
			div.appendChild(row);
		});
	});

	var select = document.createElement('select');
	select.id = "obraParaSupDdl";
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_prod).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = obra.nombre;
        option2.value = obra.nombre;
        select.appendChild(option2);
    });

    var buttonAdd = document.createElement('button');
    buttonAdd.click(function(){
    	var nombre_obra = $('#obraParaSupDdl option:selected').val();
    	var obr = {
    		nombre: nombre_obra,
    		activa: true,
    	}
    	firebase.database().ref(rama_bd_supervisores + "/" + sup_uid + "/obras/" + nombre_obra).set(obr);
    	var sup = {
    		nombre: $('#' + id_supervisores_ddl_supervisores +' option:selected').text(),
    		activo: true,
    	}
        firebase.database().ref(rama_bd_obras_prod + "/" + nombre_obra + "/supervisor/" + sup_uid).set(sup);
        firebase.database().ref(rama_bd_obra_magico + "/" + nombre_obra + "/supervisor/" + sup_uid).set(sup);
    });

    div.appendChild(select);
    div.appendChild(buttonAdd);
});