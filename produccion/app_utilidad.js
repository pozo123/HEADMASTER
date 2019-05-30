var id_obra_ddl_utilidad = "obraDdlUtilidad";
var id_proceso_ddl_utilidad = "procesoDdlUtilidad";

var id_proyectos_utilidad = "proyectosUtilidad";
var id_suministros_utilidad = "suministrosUtilidad";
var id_copeo_utilidad = "copeoUtilidad";

var id_precio_venta_utilidad = "precioVentaUtilidad";

var id_profit_cantidad_utilidad = "profitCantidadUtilidad";
var id_profit_porcentaje_utilidad = "profitPorcentajeUtilidad";

var id_button_load_utilidad = "loadButtonUtilidad";

var rama_bd_personal = "personal";
var rama_bd_obras_magico = "obras";

$('#tabUtilidad').click(function(){
	$('#' + id_obra_ddl_utilidad).empty();
    var select = document.getElementById(id_obra_ddl_utilidad);
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

	var user = firebase.auth().currentUser.uid;
	var aut = false;
	firebase.database().ref(rama_bd_personal + "/" + user).once('value').then(function(snapshot){
		if(snapshot.child("areas/administracion").val() || parseInt(snapshot.child("credenciales").val()) < 3){
			aut = true;
		}
	});

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
        	if(!aut){
        		snapshot.child("supervisor").forEach(function(childSnap){
        			if(childSnap.key == user && childSnap.child("activo").val()){
        				aut = true;
        			}
        		});
        	}
        	if(aut){
		        var option2 = document.createElement('OPTION');
		        option2.text = obra.nombre;
		        option2.value = obra.nombre;
		        select.appendChild(option2);
		    }
        }
    });
});

$("#" + id_obra_ddl_utilidad).change(function(){
	$('#' + id_proceso_ddl_utilidad).empty();
    var select = document.getElementById(id_proceso_ddl_utilidad);
    var option = document.createElement('option');
    option.text = option.value = "Global";
    select.appendChild(option);

    firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_utilidad + " option:selected").val() +"/procesos").orderByChild('nombre').on('child_added',function(snapshot){
        var proc = snapshot.val();
        var option2 = document.createElement('OPTION');
        option2.text = proc.clave;
        option2.value = proc.clave;
        select.appendChild(option2);
    });
	loadValuesObra();
});
function loadValuesObra(){
	
    firebase.database().ref(rama_bd_obras_magico).orderByKey().equalTo($('#' + id_obra_ddl_utilidad + " option:selected").val()).once('value').then(function(snapshot){
    	snapshot.forEach(function(obra_snap){
    		var obra = obra_snap.val();
    		var costos_suministros = obra.kaizen.PRODUCCION.SUMINISTROS.OdeC;
    		if(costos_suministros == 0)
    			costos_suministros = obra.kaizen.PRODUCCION.SUMINISTROS.CUANT;
    		var costos_copeo = obra.kaizen.PRODUCCION.COPEO.COPEO;
    		if(costos_copeo == 0)
    			costos_copeo = obra.kaizen.PRODUCCION.COPEO.PREC;
    		var costos_proyectos = obra.kaizen.PROYECTOS.PPTO;
    		var costos = costos_proyectos + costos_copeo + costos_suministros;
    		$('#' + id_suministros_utilidad).val(costos_suministros);
    		$('#' + id_copeo_utilidad).val(costos_copeo);
    		$('#' + id_proyectos_utilidad).val(costos_proyectos);

    		var precio = obra.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO + obra.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
    		$('#' + id_precio_venta_utilidad).val(precio);

    		$('#' + id_profit_cantidad_utilidad).val(precio*(1-porcentaje_indirectos)-costos);
    		$('#' + id_profit_porcentaje_utilidad).val(100*parseFloat($('#' + id_profit_cantidad_utilidad).val())/(porcentaje_indirectos*precio + costos));
    	});
    });
};

$("#" + id_proceso_ddl_utilidad).change(function(){
});

function loadValuesProceso(){
	if($('#' + id_proceso_ddl_utilidad + " option:selected").val() == "Global"){
	    firebase.database().ref(rama_bd_obras_magico).orderByKey().equalTo($('#' + id_obra_ddl_utilidad + " option:selected").val()).once('value').then(function(snapshot){
	    	snapshot.forEach(function(obra_snap){
	    		var obra = obra_snap.val();
	    		var costos_suministros = obra.kaizen.PRODUCCION.SUMINISTROS.OdeC;
	    		if(costos_suministros == 0)
	    			costos_suministros = obra.kaizen.PRODUCCION.SUMINISTROS.CUANT;
	    		var costos_copeo = obra.kaizen.PRODUCCION.COPEO.COPEO;
	    		if(costos_copeo == 0)
	    			costos_copeo = obra.kaizen.PRODUCCION.COPEO.PREC;
	    		var costos_proyectos = obra.kaizen.PROYECTOS.PPTO;
	    		var costos = costos_proyectos + costos_copeo + costos_suministros;
	    		$('#' + id_suministros_utilidad).val(costos_suministros);
	    		$('#' + id_copeo_utilidad).val(costos_copeo);
	    		$('#' + id_proyectos_utilidad).val(costos_proyectos);

	    		var precio = obra.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO + obra.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
	    		$('#' + id_precio_venta_utilidad).val(precio);

	    		$('#' + id_profit_cantidad_utilidad).val(precio*(1-porcentaje_indirectos)-costos);
	    		$('#' + id_profit_porcentaje_utilidad).val(100*parseFloat($('#' + id_profit_cantidad_utilidad).val())/(porcentaje_indirectos*precio + costos));
	    	});
	    });
	} else {
		firebase.database().ref(rama_bd_obras_magico + "/" + $('#' + id_obra_ddl_utilidad + " option:selected").val() + "/procesos/" + $('#' + id_proceso_ddl_utilidad + " option:selected").val()).once('value').then(function(snapshot){
	    	snapshot.forEach(function(proc_snap){
	    		var proc = proc_snap.val();
	    		var costos_suministros = proc.kaizen.PRODUCCION.SUMINISTROS.OdeC;
	    		if(costos_suministros == 0)
	    			costos_suministros = proc.kaizen.PRODUCCION.SUMINISTROS.CUANT;
	    		var costos_copeo = proc.kaizen.PRODUCCION.COPEO.COPEO;
	    		if(costos_copeo == 0)
	    			costos_copeo = proc.kaizen.PRODUCCION.COPEO.PREC;
	    		var costos_proyectos = proc.kaizen.PROYECTOS.PPTO;
	    		var costos = costos_proyectos + costos_copeo + costos_suministros;
	    		$('#' + id_suministros_utilidad).val(costos_suministros);
	    		$('#' + id_copeo_utilidad).val(costos_copeo);
	    		$('#' + id_proyectos_utilidad).val(costos_proyectos);

	    		var precio = proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO + proc.kaizen.ADMINISTRACION.ANTICIPOS.PPTO;
	    		$('#' + id_precio_venta_utilidad).val(precio);

	    		$('#' + id_profit_cantidad_utilidad).val(precio*(1-porcentaje_indirectos)-costos);
	    		$('#' + id_profit_porcentaje_utilidad).val(100*parseFloat($('#' + id_profit_cantidad_utilidad).val())/(porcentaje_indirectos*precio + costos));
	    	});
	    });
	}
};

$('#' + id_button_load_utilidad).click(function(){
	if($('#' + id_proceso_ddl_utilidad + " option:selected").val() == "Global"){
		loadValuesObra();
	} else {
		loadValuesProceso();
	}
});

function loadProfits(){
	var costos = parseFloat($('#' + id_proyectos_utilidad).val()) + parseFloat($('#' + id_copeo_utilidad).val()) + parseFloat($('#' + id_suministros_utilidad).val());
	var precio = parseFloat($('#' + id_precio_venta_utilidad).val());

	var u = precio*(1-porcentaje_indirectos)-costos;//Si hay utilidad en Costo indirecto: IGUAL
	$('#' + id_profit_cantidad_utilidad).val(u);
	$('#' + id_profit_porcentaje_utilidad).val(100*u/costos);//Si hay utilidad en Costo indirecto: (100*(u/(porcentaje_indirectos*precio + costos)))
	highLight(id_profit_porcentaje_utilidad);
	highLight(id_profit_cantidad_utilidad);
}

$("#" + id_copeo_utilidad).change(function(){
	loadProfits();
});

$("#" + id_suministros_utilidad).change(function(){
	loadProfits();
});

$("#" + id_proyectos_utilidad).change(function(){
	loadProfits();
});

$("#" + id_precio_venta_utilidad).change(function(){
	loadProfits();
});

$("#" + id_profit_porcentaje_utilidad).change(function(){
	var costos = parseFloat($('#' + id_proyectos_utilidad).val()) + parseFloat($('#' + id_copeo_utilidad).val()) + parseFloat($('#' + id_suministros_utilidad).val());
	var ut_p = parseFloat($("#" + id_profit_porcentaje_utilidad).val())/100;
	var pv = (costos*(1+ut_p)/(1-porcentaje_indirectos));//Si hay utlidad en Costo indirecto: (costos * (1 + ut_p))/(1 - porcentaje_indirectos * (1 + ut_p));
	$('#' + id_precio_venta_utilidad).val(pv);
	$('#' + id_profit_cantidad_utilidad).val(pv*(1 - porcentaje_indirectos) - costos);//Si hay utlidad en Costo indirecto: IGUAL
	highLight(id_precio_venta_utilidad);
	highLight(id_profit_cantidad_utilidad);
});

$("#" + id_profit_cantidad_utilidad).change(function(){
	var costos = parseFloat($('#' + id_proyectos_utilidad).val()) + parseFloat($('#' + id_copeo_utilidad).val()) + parseFloat($('#' + id_suministros_utilidad).val());
	var u = parseFloat($("#" + id_profit_cantidad_utilidad).val());
	var pv = (u + costos)/(1-porcentaje_indirectos);//Si hay utilidad en Costo indirecto: IGUAL
	$('#' + id_precio_venta_utilidad).val(pv);
	$('#' + id_profit_porcentaje_utilidad).val(100*u/costos);//Si hay utilidad en Costo indirecto: (100*u/(pv - u));
	highLight(id_precio_venta_utilidad);
	highLight(id_profit_porcentaje_utilidad);
});