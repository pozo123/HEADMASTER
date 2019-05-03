var id_key_atributo = "keyAtributo";
var id_value_atributo = "valueAtributo";
var id_div_atributo = "divAtributo";
var id_tab_atributo = "tabAtributo";
var id_actualiar_button_atributo = "actualizarButtonAtributo";

var num_ddls = 0;
var reference = "";

$('#' + id_tab_atributo).click(function(){
	var div = document.getElementById(id_div_atributo);
	createDdl();
});

function updateRef(){
	ref = "";
	for(i=1;i<num_ddls;i++){
		if(i == 1){
			ref = $('#ddl_' + i + " option:selected").val();
		} else {
			ref = ref + "/" + $('#ddl_' + i + " option:selected").val();
		}
	}
}

function createDdl(){
	updateRef();
	firebase.database().ref(reference).once('value').then(function(snapshot){
		if(snapshot.val() != null){
			num_ddls++;
			var ddl = document.createElement('select');
			ddl.id = "ddl_" + num_ddls;
			var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    ddl.appendChild(option);
			snapshot.forEach(function(childSnap){
				var child = childSnap.key;
				var option2 = document.createElement('OPTION');
    			option2.text = child;
    			option2.value = child;
    			ddl.appendChild(option2);
			});
			div.appendChild(ddl);
			$("#" + ddl.id).change(function(){
				var nuevo_num = parseFloat((this.id).substring(5, this.id.length));
				for(i = nuevo_num + 1; i < num_ddls; i++){
					var elem = document.getElementById("ddl_" + i);
	          		elem.parentNode.removeChild(elem);
				}
				num_ddls = nuevo_num;
				createDdl();
			});
		} else {
			alert("Error de referencia");
			var option = document.createElement('option');
		    option.style = "display:none";
		    option.text = option.value = "";
		    option.selected = true;
		    document.getElementById("ddl_" + num_ddls).appendChild(option);
		}
	});
}

$('#' + id_actualiar_button_atributo).click(function(){
	updateRef();
	firebase.database().ref(referencia).once('value').then(function(snapshot){
		snapshot.forEach(function(childSnap){
			var val = $('#' + id_value_atributo).val();
			console.log(referencia + "/" + childSnap.key + "/" + $('#' + id_key_atributo).val() + ": " + val);
			//firebase.database().ref(referencia + "/" + childSnap.key + "/" + $('#' + id_key_atributo).val()).set(val);
		});
	});
});