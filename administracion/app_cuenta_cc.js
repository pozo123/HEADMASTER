var id_familia_ddl_cc = "familiaDdlCC";
var id_nodo_cb_cc = "nodoCheckBoxCC";//Son los nombres de una familia nueva
var id_nombre_cc = "nombreCC";
var id_clave_cc = "claveCC";
var id_div_cc = "divCC";

var id_button_registrar_cc = "registrarCC";

var rama_bd_cc = "administracion/centro_de_costos";

var num_nodos = 0; //num nodos DESPUES de la familia
var num_hojas = 0;
$('#tabCuentaCC').click(function(){
	var select = document.getElementById(id_familia_ddl_cc) ;
    var option = document.createElement('option');
    //option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_cc).on('child_added',function(snapshot){
        var familia = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = familia.nombre;
        option2.value = familia.clave;
        select.appendChild(option2);
    });
});//Chance hay que meter todo al tab?

$("#" + id_nodo_cb_cc).change(function(){
      if(this.checked == true){
        if($("#" + id_familia_ddl_cc).val() == "" && ($("#" + id_nombre_cc).val() == "" || $("#" + id_clave_cc).val() == "")){
          alert("Llena todos los campos necesarios");
          this.checked = false;
        } else{
          agregaNodo();
        }
      } else {
          $('#' + id_div_cc).empty();
          num_nodos = 0;
      }
  });

function agregaNodo(){
	num_nodos++;
	var div = document.getElementById(id_div_cc);
	var row = document.createElement('div');
	row.id = "row_" + num_nodos;
	var familia;
	if($('#' + id_familia_ddl_cc + " option:selected").val() == ""){
		familia = $('#' + id_nombre_cc).val();
	} else { 
		familia = $('#' + id_familia_ddl_cc + " option:selected").text();
	}
	var ref = rama_bd_cc + "/" + familia;
	for(i=1;i<=num_nodos;i++){
    if($("#ddl_" + i).val() == null){
      ref = ref + "/" + $('#nom' + i).val();
    } else{
  		if($('#ddl_' + i + " option:selected").val() == ""){
  			ref = ref + "/" + $('#nom' + i).val();
  		} else {
  			ref = ref + "/" + $('#ddl_' + i + " option:selected").text();
  		}
    }
	}
	//Define ref dependiendo de i, haces un concatenar de strings. Si hay valor en el ddl lo tomas, si no el de nombre
	firebase.database().ref(ref).once('value').then(function(snapshot){
		//Poblar ddl si hay children, si no ni lo crees
		var nodo = snapshot.val();
		if(nodo != null){
			if(nodo.children != ""){
				var ddl = document.createElement('select');
				ddl.id = "ddl_" + num_nodos;
				var option = document.createElement('option');
			    option.style = "display:none";
			    option.text = option.value = "";
			    ddl.appendChild(option);
				snapshot.child("children").forEach(function(childSnap){
					var kid = childSnap.val();
    			var option2 = document.createElement('OPTION');
    			option2.text = kid.nombre;
    			option2.value = kid.clave;
    			ddl.appendChild(option2);
				});
				row.appendChild(ddl);
			}
		}
		var nom = document.createElement('input');
		nom.type = "text";
		nom.id = "nom_" + num_nodos;
		var cla = document.createElement('input');
		cla.type = "text";
		cla.id = "cla_" + num_nodos;
		row.appendChild(nom);
		row.appendChild(cla);

		var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "check_" + num_nodos;
    check.value = num_nodos;
    check.innerHTML = "Nodo/Hoja";
    row.appendChild(check);
    //console.log(check.id);

    var check_hoja = document.createElement('input');
    check_hoja.type = "checkbox";
    check_hoja.id = "check_h_" + num_nodos + "_0";
    check_hoja.value = num_nodos;
    row.appendChild(check_hoja);
    //console.log(check_hoja.id);
    div.appendChild(row);//Tiene que appendearse antes de declarar la change function o no jala

    $('#' + check.id).change(function(){
      if(this.checked == true){
        if($("#ddl_" + this.value).val() == null){
	        if($("#nom_" + this.value).val() == "" || $("#cla_" + this.value).val() == ""){
	          alert("Llena todos los campos necesarios");
	          this.checked = false;
	        } else {
	          document.getElementById("nom_" + this.value).disabled = true;
	          document.getElementById("cla_" + this.value).disabled = true;
	          document.getElementById("check_h_" + this.value + "_0").disabled = true;
	          agregaNodo();
	        }
        } else { 
          if($("#ddl_" + this.value).val() == "" && ($("#nom_" + this.value).val() == "" || $("#cla_" + this.value).val() == "")){
            alert("Llena todos los campos necesarios");
            this.checked = false;
          } else {
            document.getElementById("ddl_" + this.value).disabled = true;
            document.getElementById("nom_" + this.value).disabled = true;
            document.getElementById("cla_" + this.value).disabled = true;
            document.getElementById("check_h_" + this.value + "_0").disabled = true;
            agregaNodo();
          }
        }
      } else {
        for(var i_r = parseInt(this.value) + 1;i_r<=num_nodos;i_r++){
          var elem = document.getElementById("row_" + i_r);
          elem.parentNode.removeChild(elem);
        }
        //if($("#ddl_" + this.value).val() == null){
          document.getElementById("ddl_" + this.value).disabled = false;
        //}
        document.getElementById("nom_" + this.value).disabled = false;
        document.getElementById("cla_" + this.value).disabled = false;
        document.getElementById("check_h_" + this.value + "_0").disabled = false;
        num_nodos = this.value;
      }
    });

    $('#' + check_hoja.id).change(function(){
      if(this.checked == true){
        document.getElementById("check_" + this.value).disabled = true;
        if($("#ddl_" + this.value).val() != null){
          document.getElementById("ddl_" + this.value).disabled = true;
        }
        agregaHoja();
      } else {
        for(var i_h = 1;i_h<=num_hojas;i_h++){
          var elem = document.getElementById("div_hoja_" + i_h);
          elem.parentNode.removeChild(elem);
        }
        document.getElementById("check_" + this.value).disabled = false;
        if($("#ddl_" + this.value).val() != null){
          document.getElementById("ddl_" + this.value).disabled = false;
        }
        num_hojas = 0;
      }
    });
	});
}

function agregaHoja(){
    num_hojas++;
    var div_hoja = document.createElement('div');
    div_hoja.id = "div_hoja_" + num_hojas;

    var nom = document.createElement('input');
    nom.type = "text";
    nom.id = "nom_hoja_" + num_hojas;
    var cla = document.createElement('input');
    cla.type = "text";
    cla.id = "cla_hoja_" + num_hojas;
    div_hoja.appendChild(nom);
    div_hoja.appendChild(cla);

    var check_hoja = document.createElement('input');
    check_hoja.type = "checkbox";
    check_hoja.id = "check_hoja_" + num_hojas;
    check_hoja.value = num_hojas;
    div_hoja.appendChild(check_hoja);
    console.log(check_hoja.id);
    document.getElementById("row_" + num_nodos).appendChild(div_hoja);//Append antes de la change function o no jala
    $('#' + check_hoja.id).change(function(){
      if(this.checked == true){
        agregaHoja();
      } else {
        for(var i_h = parseInt(this.value) + 1;i_h<=num_hojas;i_h++){
          var elem = document.getElementById("div_hoja_" + i_h);
          elem.parentNode.removeChild(elem);
        }
        num_hojas = this.value;
      }
    });
}
//Si alguno de los nodos anteriores tiene registros tengo que distribuirlos entre las hojas nuevas
//Eso implica poder dar de alta varias hojas a la vez. Ver qué onda con eso luego

/*
$('#' + id_button_registrar_cc).click(function(){
	if($('#' + id_familia_ddl_cc + " option:selected").val() == "" && (!$('#' + id_nombre_cc).val() || !$('#' + id_clave_cc).val())){
		alert("Llena todos los campos");
	} else { 
		if($("#" + id_nodo_cb_cc).checked == false){
			var name = $('#' + id_nombre_cc).val();
			var clave = $('#' + id_clave_cc).val();
			if(!name || !clave){
				alert("Llena todos los campos");
			} else {
				var year_actual = getWeek(new Date().getTime())[1];
				var y = {};

			    for(i=year_actual;i>2017;i--){
			    	y[i] = 0;
			    }
				var familia = {
					nombre: name,
					clave: clave,
					years: y,
					children: "",
				}
				firebase.database().ref(rama_bd_cc + "/" + name).set(familia);
			}

		} else {

		}
		var cuenta = {
			nombre: ,
			clave: ,
			total_cuenta: 0,
      ppto_cuenta: 0,
      forma_pago: "",
      formato_fecha: "",
      areas_lectura: {},
      areas_edicion: {},
      children: "",
			/*registros: {
				2019:{
					total_year: 0,
				}
			}
		}
		firebase.database().ref(rama_bd_cc + "/" + $('#' + id_familia_ddl_cc + " option:selected").val() + $('#' + id_nombre_cc).val()).set(cuenta);
		alert("Alta exitosa");
	}
});*/


/*
//PARA W3SCHOOLS

<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
var id_familia_ddl_cc = "familiaDdlCC";
var id_nodo_cb_cc = "nodoCheckBoxCC";
var id_nombre_cc = "nombreCC";
var id_clave_cc = "claveCC";
var id_div_cc = "divCC";

var num_nodos = 0; //num nodos DESPUES de la familia
var num_hojas = 0; //num hojas EXTRA a la cuenta creada
$(document).ready(function(){
  var select = document.getElementById(id_familia_ddl_cc) ;
    var option = document.createElement('option');
    //option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

  for(i=1;i<5;i++){
      var option2 = document.createElement('OPTION');
      option2.text = i;
      option2.value = i;
      select.appendChild(option2);
    }
  $("#" + id_nodo_cb_cc).change(function(){
      if(this.checked == true){
        if($("#" + id_familia_ddl_cc).val() == "" && ($("#" + id_nombre_cc).val() == "" || $("#" + id_clave_cc).val() == "")){
          alert("Llena todos los campos necesarios");
          this.checked = false;
        } else{
          agregaNodo();
        }
      } else {
          $('#' + id_div_cc).empty();
          num_nodos = 0;
      }
  });

  function agregaNodo(){
    num_nodos++;
    var div = document.getElementById(id_div_cc);
    var row = document.createElement('div');
    row.id = "row_" + num_nodos;
    var ddl = document.createElement('select');
    ddl.id = "ddl_" + num_nodos;
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    ddl.appendChild(option);
    for(i=1;i<5;i++){
      var option2 = document.createElement('OPTION');
      option2.text = i;
      option2.value = i;
      ddl.appendChild(option2);
    }       
    row.appendChild(ddl);

    var nom = document.createElement('input');
    nom.type = "text";
    nom.id = "nom_" + num_nodos;
    var cla = document.createElement('input');
    cla.type = "text";
    cla.id = "cla_" + num_nodos;
    row.appendChild(nom);
    row.appendChild(cla);

    var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "check_" + num_nodos;
    check.value = num_nodos;
    check.innerHTML = "Nodo/Hoja";
    row.appendChild(check);
    console.log(check.id);

    var check_hoja = document.createElement('input');
    check_hoja.type = "checkbox";
    check_hoja.id = "check_h_" + num_nodos + "_0";
    check_hoja.value = num_nodos;
    row.appendChild(check_hoja);
    console.log(check_hoja.id);
    div.appendChild(row);//Tiene que appendearse antes de declarar la change function o no jala

    $('#' + check.id).change(function(){
      if(this.checked == true){
        if(($("#ddl_" + this.value).val() == null || $("#ddl_" + this.value).val() == "") && ($("#nom_" + this.value).val() == "" || $("#cla_" + this.value).val() == "")){
          alert("Llena todos los campos necesarios");
          this.checked = false;
        } else {
          document.getElementById("ddl_" + this.value).disabled = true;
          document.getElementById("nom_" + this.value).disabled = true;
          document.getElementById("cla_" + this.value).disabled = true;
          document.getElementById("check_h_" + this.value + "_0").disabled = true;
          agregaNodo();
        }
      } else {
        for(var i_r = parseInt(this.value) + 1;i_r<=num_nodos;i_r++){
          var elem = document.getElementById("row_" + i_r);
          elem.parentNode.removeChild(elem);
        }
        document.getElementById("ddl_" + this.value).disabled = false;
        document.getElementById("nom_" + this.value).disabled = false;
        document.getElementById("cla_" + this.value).disabled = false;
        document.getElementById("check_h_" + this.value + "_0").disabled = false;
        num_nodos = this.value;
      }
    });

    $('#' + check_hoja.id).change(function(){
      if(this.checked == true){
        document.getElementById("check_" + this.value).disabled = true;
        document.getElementById("ddl_" + this.value).disabled = true;
        agregaHoja();
      } else {
        for(var i_h = 1;i_h<=num_hojas;i_h++){
          var elem = document.getElementById("div_hoja_" + i_h);
          elem.parentNode.removeChild(elem);
        }
        document.getElementById("check_" + this.value).disabled = false;
        document.getElementById("ddl_" + this.value).disabled = false;
        num_hojas = 0;
      }
    });
  }

  function agregaHoja(){
    num_hojas++;
    var div_hoja = document.createElement('div');
    div_hoja.id = "div_hoja_" + num_hojas;

    var nom = document.createElement('input');
    nom.type = "text";
    nom.id = "nom_hoja_" + num_hojas;
    var cla = document.createElement('input');
    cla.type = "text";
    cla.id = "cla_hoja_" + num_hojas;
    div_hoja.appendChild(nom);
    div_hoja.appendChild(cla);

    var check_hoja = document.createElement('input');
    check_hoja.type = "checkbox";
    check_hoja.id = "check_hoja_" + num_hojas;
    check_hoja.value = num_hojas;
    div_hoja.appendChild(check_hoja);
    console.log(check_hoja.id);
    document.getElementById("row_" + num_nodos).appendChild(div_hoja);//Append antes de la change function o no jala
    $('#' + check_hoja.id).change(function(){
      if(this.checked == true){
        agregaHoja();
      } else {
        for(var i_h = parseInt(this.value) + 1;i_h<=num_hojas;i_h++){
          var elem = document.getElementById("div_hoja_" + i_h);
          elem.parentNode.removeChild(elem);
        }
        num_hojas = this.value;
      }
    });
  }
});
</script>
</head>
<body>
<form action="">
<select id="familiaDdlCC">
</select>
<input type="checkbox" id="nodoCheckBoxCC"></input>
<input type="text" id="nombreCC"></input>
<input type="text" id="claveCC"></input>
<div id="divCC"></div>

</form>

</body>
</html>
*/

//Con "nuevo" (según yo en firebase no hace falta porque reivso si xiste)
/*
<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
var id_familia_ddl_cc = "familiaDdlCC";
var id_nodo_cb_cc = "nodoCheckBoxCC";
var id_nombre_cc = "nombreCC";
var id_clave_cc = "claveCC";
var id_div_cc = "divCC";

var nuevo = false;

var num_nodos = 0; //num nodos DESPUES de la familia
var num_hojas = 0; //num hojas EXTRA a la cuenta creada
$(document).ready(function(){
  var select = document.getElementById(id_familia_ddl_cc) ;
    var option = document.createElement('option');
    //option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

  for(i=1;i<5;i++){
      var option2 = document.createElement('OPTION');
      option2.text = i;
      option2.value = i;
      select.appendChild(option2);
    }
  $("#" + id_nodo_cb_cc).change(function(){
      if(this.checked == true){
        if($("#" + id_familia_ddl_cc).val() == "" && ($("#" + id_nombre_cc).val() == "" || $("#" + id_clave_cc).val() == "")){
          alert("Llena todos los campos necesarios");
          this.checked = false;
        } else{
          agregaNodo();
        }
      } else {
          $('#' + id_div_cc).empty();
          num_nodos = 0;
      }
  });

  function agregaNodo(){
    num_nodos++;
    var div = document.getElementById(id_div_cc);
    var row = document.createElement('div');
    row.id = "row_" + num_nodos;
    if(!nuevo){
      var ddl = document.createElement('select');
      ddl.id = "ddl_" + num_nodos;
      var option = document.createElement('option');
      option.style = "display:none";
      option.text = option.value = "";
      ddl.appendChild(option);
      for(i=1;i<5;i++){
        var option2 = document.createElement('OPTION');
        option2.text = i;
        option2.value = i;
        ddl.appendChild(option2);
      }       
      row.appendChild(ddl);
    }

    var nom = document.createElement('input');
    nom.type = "text";
    nom.id = "nom_" + num_nodos;
    var cla = document.createElement('input');
    cla.type = "text";
    cla.id = "cla_" + num_nodos;
    row.appendChild(nom);
    row.appendChild(cla);

    var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "check_" + num_nodos;
    check.value = num_nodos;
    check.innerHTML = "Nodo/Hoja";
    row.appendChild(check);
    console.log(check.id);

    var check_hoja = document.createElement('input');
    check_hoja.type = "checkbox";
    check_hoja.id = "check_h_" + num_nodos + "_0";
    check_hoja.value = num_nodos;
    row.appendChild(check_hoja);
    console.log(check_hoja.id);
    div.appendChild(row);//Tiene que appendearse antes de declarar la change function o no jala

    $('#' + check.id).change(function(){
      if(this.checked == true){
        if(nuevo){
          if($("#nom_" + this.value).val() == "" || $("#cla_" + this.value).val() == ""){
            alert("Llena todos los campos necesarios");
            this.checked = false;
          } else {
            document.getElementById("nom_" + this.value).disabled = true;
            document.getElementById("cla_" + this.value).disabled = true;
            document.getElementById("check_h_" + this.value + "_0").disabled = true;
            agregaNodo();
          }
        } else {
          if(($("#ddl_" + this.value).val() == null || $("#ddl_" + this.value).val() == "") && ($("#nom_" + this.value).val() == "" || $("#cla_" + this.value).val() == "")){
            alert("Llena todos los campos necesarios");
            this.checked = false;
          } else {
            if($("#ddl_" + this.value).val() == ""){
              nuevo = true;
            }
            document.getElementById("ddl_" + this.value).disabled = true;
            document.getElementById("nom_" + this.value).disabled = true;
            document.getElementById("cla_" + this.value).disabled = true;
            document.getElementById("check_h_" + this.value + "_0").disabled = true;
            agregaNodo();
          }
        }
      } else {
        if(document.getElementById("ddl_" + this.value) != null){
          nuevo = false;
        }
        for(var i_r = parseInt(this.value) + 1;i_r<=num_nodos;i_r++){
          var elem = document.getElementById("row_" + i_r);
          elem.parentNode.removeChild(elem);
        }
        if(!nuevo){
          document.getElementById("ddl_" + this.value).disabled = false;
        }
        document.getElementById("nom_" + this.value).disabled = false;
        document.getElementById("cla_" + this.value).disabled = false;
        document.getElementById("check_h_" + this.value + "_0").disabled = false;
        num_nodos = this.value;
      }
    });

    $('#' + check_hoja.id).change(function(){
      if(this.checked == true){
        document.getElementById("check_" + this.value).disabled = true;
        if(!nuevo){
          document.getElementById("ddl_" + this.value).disabled = true;
        }
        agregaHoja();
      } else {
        for(var i_h = 1;i_h<=num_hojas;i_h++){
          var elem = document.getElementById("div_hoja_" + i_h);
          elem.parentNode.removeChild(elem);
        }
        document.getElementById("check_" + this.value).disabled = false;
        if(!nuevo){
          document.getElementById("ddl_" + this.value).disabled = false;
        }
        num_hojas = 0;
      }
    });
  }

  function agregaHoja(){
    num_hojas++;
    var div_hoja = document.createElement('div');
    div_hoja.id = "div_hoja_" + num_hojas;

    var nom = document.createElement('input');
    nom.type = "text";
    nom.id = "nom_hoja_" + num_hojas;
    var cla = document.createElement('input');
    cla.type = "text";
    cla.id = "cla_hoja_" + num_hojas;
    div_hoja.appendChild(nom);
    div_hoja.appendChild(cla);

    var check_hoja = document.createElement('input');
    check_hoja.type = "checkbox";
    check_hoja.id = "check_hoja_" + num_hojas;
    check_hoja.value = num_hojas;
    div_hoja.appendChild(check_hoja);
    console.log(check_hoja.id);
    document.getElementById("row_" + num_nodos).appendChild(div_hoja);//Append antes de la change function o no jala
    $('#' + check_hoja.id).change(function(){
      if(this.checked == true){
        agregaHoja();
      } else {
        for(var i_h = parseInt(this.value) + 1;i_h<=num_hojas;i_h++){
          var elem = document.getElementById("div_hoja_" + i_h);
          elem.parentNode.removeChild(elem);
        }
        num_hojas = this.value;
      }
    });
  }
});
</script>
</head>
<body>
<form action="">
<select id="familiaDdlCC">
</select>
<input type="checkbox" id="nodoCheckBoxCC"></input>
<input type="text" id="nombreCC"></input>
<input type="text" id="claveCC"></input>
<div id="divCC"></div>

</form>

</body>
</html>
*/