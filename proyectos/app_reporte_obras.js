var id_button_generar_reporte_obras = "buttonGenerarRepObras"; //Botón
//var id_inges_ddlcheck_reporte_obras = "ingesRepObras"; //DropDown Checklist
//var id_obras_ddlcheck_reporte_obras = "obrasRepObras"; //DropDown Checklist
var id_fecha_inicio_reporte_obras = "fechaInicioRepObras"; //Datepicker
var id_fecha_final_reporte_obras = "fechaFinalRepObras"; //Datepicker
var id_rb_obras_si_reporte_obras = "obrasSiRepObras";
var id_rb_obras_no_reporte_obras = "obrasNoRepObras";
var id_rb_inges_si_reporte_obras = "ingesSiRepObras";
var id_rb_inges_no_reporte_obras = "ingesNoRepObras";
var id_ctx1_reporte_obras = "divGraph1RepObras"; //Div
var id_ctx2_reporte_obras = "divGraph2RepObras"; //Div
var id_ctxObra_reporte_obras = "divGraphObraRepObras"; //Div
var id_obras_checkbox_div_reporte_obras = "divCheckboxObraRepObras";//Div AQUI falta
var id_inges_checkbox_div_reporte_obras = "divCheckboxIngeRepObras";//Div AQUI falta

var rama_bd_inges = "personal";
var rama_bd_obras = "obras";
var rama_bd_registros = "proyectos/registros";

var colores_predeterminados = ["#FF34FF","#FF4A46","#008941","#006FA6","#A30059","#FFDBE5","#7A4900","#0000A6","#63FFAC","#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B","#000000","#FFFF00","#1CE6FF",];

var filtrando_inges = false;
var filtrando_obras = false;

$('#tabReporteObra').click(function() {
	//datePickers
	jQuery('#' + id_fecha_inicio_reporte_obras).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'}
    );
    jQuery('#' + id_fecha_final_reporte_obras).datetimepicker(
        {timepicker:false, weeks:true,format:'m.d.Y'},
    );

    loadRBObrasReporteObras();
    loadRBIngesReporteObras();

    /*
	//dropDownCheckBox de colabs y obras, default todos seleccionados
	firebase.database().ref(rama_bd_inges).orderByChild('nombre').on('child_added',function(snapshot){
        var inge = snapshot.val();
        //myData.push({id: req.nombre, label: req.nombre});        
        //$('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("reset",myData);
        $('#' + id_inges_ddlcheck_reporte_obras).dropdownCheckbox("append",{
            id: inge.uid, label: inge.nombre, isChecked: true
        });
    });

	firebase.database().ref(rama_bd_obras).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        //myData.push({id: req.nombre, label: req.nombre});        
        //$('#' + id_reqs_ddlcheck_presupuesto).dropdownCheckbox("reset",myData);
        $('#' + id_obras_ddlcheck_reporte_obras).dropdownCheckbox("append",{
            id: obra.nombre, label: obra.nombre, isChecked: true
        });
    });
    */

});

function loadRBObrasReporteObras(){

    var rb_obras_si = document.createElement('INPUT');
    rb_obras_si.type = "radio";
    rb_obras_si.name = "obras_rb";
    rb_obras_si.id = "obrasSiRepObras";
    rb_obras_si.checked = true;

    $('#' + id_obras_checkbox_div_reporte_obras).appendChild(rb_obras_si);
    
    var rb_obras_no = document.createElement('INPUT');
    rb_obras_no.type = "radio";
    rb_obras_no.name = "obras_rb";
    rb_obras_no.id = "obrasNoRepObras";
    rb_obras_no.checked = false;

    $('#' + id_obras_checkbox_div_reporte_obras).appendChild(rb_obras_no);
}

function loadRBIngesReporteObras(){

    var rb_inges_si = document.createElement('INPUT');
    rb_inges_si.type = "radio";
    rb_inges_si.name = "inges_rb";
    rb_inges_si.id = "ingesSiRepObras";
    rb_inges_si.checked = true;
    
    $('#' + id_inges_checkbox_div_reporte_obras).appendChild(rb_inges_si);

    var rb_inges_no = document.createElement('INPUT');
    rb_inges_no.type = "radio";
    rb_inges_no.name = "inges_rb";
    rb_inges_no.id = "ingesNoRepObras";
    rb_inges_no.checked = false;

    $('#' + id_inges_checkbox_div_reporte_obras).appendChild(rb_inges_no);
}

function loadObrasCBReporteObras(){
	if($('#' + id_rb_obras_no_reporte_obras).prop('checked')){
		firebase.database().ref(rama_bd_obras).on('child_added', function(snapshot){
			var obra = snapshot.val();
			var cb = document.createElement("INPUT");
			cb.setAttribute("type", "checkbox");
			cb.name = "obra";
			cb.value = obra.nombre;
			if(obra.nombre == "ZObra Prueba")
				cb.checked = false;
			else
				cb.checked = true;
		});
		filtrando_obras = true;
	} else {
		$('#' + id_obras_checkbox_div_reporte_obras).empty();
		loadRBObrasReporteObras();
		filtrando_obras = false;
	}
}

function loadIngesCBReporteObras(){
	if($('#' + id_rb_inges_no_reporte_obras).prop('checked')){
		firebase.database().ref(rama_bd_inges).once('value').then(function(snapshot){
			var inge = snapshot.val();
			if(snapshot.child("areas/proyectos").val()){
				var cb = document.createElement("INPUT");
				cb.setAttribute("type", "checkbox");
				cb.name = "inge";
				cb.value = inge.nombre;
				cb.checked = true;
			}
		});
		filtrando_inges = true;
	} else {
		$('#' + id_inges_checkbox_div_reporte_obras).empty();
		loadRBIngesReporteObras();
		filtrando_inges = false;
	}
}

//Botón generar en pag
$('#' + id_button_generar_reporte_obras).click(function() {
	$('#' + id_ctx1_reporte_obras).empty();
    $('#' + id_ctx2_reporte_obras).empty();
    $('#' + id_ctxObra_reporte_obras).empty();

	var datos = new Array();
	var labels = new Array();
	var labels_pptos = new Array();
	var datos_pptos = new Array();
	var otros = 0;
	var fecha_i;
    var fecha_i_timestamp;// = fecha_i.getTime();
    var fecha_f;
    var fecha_f_timestamp;

    if($('#' + id_fecha_final_reporte_obras).val() === ""){
    	if($('#' + id_fecha_inicio_reporte_obras).val() === ""){
    		//Si no se selecciona ninguna fecha se hacen los reportes con todos los valores
    		fecha_i = new Date(2018,8,1);
    		fecha_i_timestamp = fecha_i.getTime();
    		fecha_f = new Date();
    		fecha_f_timestamp = fecha_f.getTime();
    	} else {
    		//Si sólo se selecciona un día se utiliza la info de ese día en particular
    		fecha_i = new Date($('#' + id_fecha_inicio_reporte_obras).val());
    		fecha_i_timestamp = fecha_i.getTime();
	        fecha_f = "";
	        fecha_f_timestamp = fecha_i_timestamp + (24*3600*1000);
    	}
    } else {
    	fecha_i = new Date($('#' + id_fecha_inicio_reporte_obras).val());
    	fecha_i_timestamp = fecha_i.getTime();
        fecha_f = new Date($('#' + id_fecha_final_reporte_obras).val());
        fecha_f_timestamp = fecha_f.getTime() + (24*3600*1000); 
    }

    var inges_lista = [];//$('#' + id_inges_ddlcheck_reporte_obras).dropdownCheckbox("checked");
    var inges_checkbox = document.getElementsByName("inges");
    for(i=0;i<inges_checkbox.length;i++){
    	if(inges_checkbox[i].checked)
    		inges_lista.push(inges_checkbox[i]);
    }    

    var obras_lista = [];//$('#' + id_obras_ddlcheck_reporte_obras).dropdownCheckbox("checked");
    var obras_checkbox = document.getElementsByName("obras");
    for(i=0;i<obras_checkbox.length;i++){
    	if(obras_checkbox[i].checked)
    		obras_lista.push(obras_checkbox[i]);
    }
    
    for(i=0;i<obras_lista.length;i++){
        labels[i] = obras_lista[i].value;
        datos[i] = 0;
        //labels_pptos y datos_pptos corresponden a los pptos de la obra cuyo nombre esta en labels[i]
        labels_pptos[i] = new Array();
        datos_pptos[i] = new Array();
    }
    
    firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        //AQUI agregar procs
        snapshot.forEach(function(childSnapshot){
        	for(i=0;i<obras_lista.length;i++){
        		if(childSnapshot.val().nombre == obras_lista[i].value){
            		childSnapshot.child("presupuestos").forEach(function(presu_snapshot){
            			labels_pptos[i].push(presu_snapshot.val().nombre);
            			datos_pptos[i][labels_pptos[i].length - 1] = 0;
            		});
            		childSnapshot.child("procesos").forEach(function(proc_snapshot){
            			if(proc_snapshot.child("num_subprocesos").val() > 0){
            				proc_snapshot.child("subprocesos").forEach(function(subp_snapshot){
            					labels_pptos[i].push(proc_snapshot.val().nombre);
	            				datos_pptos[i][labels_pptos[i].length - 1] = 0;
            				});
            			} else {
	            			labels_pptos[i].push(proc_snapshot.val().nombre);
	            			datos_pptos[i][labels_pptos[i].length - 1] = 0;
	            		}
            		});
        		}
        	}
        });

		firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
	        snapshot.forEach(function(childSnapshot){
	        	var reg = childSnapshot.val();
	        	var filtro_inges = false;
				var filtro_obras = false;
	        	
	        	//Revisa si el registro pertenece al rango de fecha deseado. Sólo se revisan los demás filtros si el primero pasa
	        	if(fecha_i_timestamp < reg.checkin && reg.checkin < fecha_f_timestamp){
		        	var i = 0;
		        	if(filtrando_inges){
		        		//Revisa si el registro pertenece a un inge seleccionado
		        		while(i < inges_lista.length && filtro_inges == false){
		        			if(reg.inge == inges_lista[i].value)
		        				filtro_inges = true;
		        			else
		        				i++;
		        		}
		        	} else {
		        		filtro_inges = true;
		        	}
		        	//Sólo revisa los demás filtros si el primero se pasa, para evitar búsquedas innecesarias
		        	if(filtro_inges){
		        		//Si el reg es de Otros (o misc por el tiempo antes de que lo cambiaramos) se guarda pero en una variable aparte
		        		if(reg.obra == "Otros" || reg.obra == "Miscelaneo"){
		        			otros += reg.horas/3600000;
		        		} else {
			        		var j = 0;
			        		if(filtrando_obras){
			        			//Revisa si el registro pertenece a una obra seleccionada
			        			while(j < obras_lista.length && filtro_obras == false){
									if(("" + reg.obra) == obras_lista[j].value)
			        					filtro_obras = true;
			        				else
			        					j++;
			        			}
			        		} else {
			        			filtro_obras = true;
			        		}
			        		if(filtro_obras){
			        			datos[j] += reg.horas/3600000;
			        			var flag = false;
			        			var k = 0;
			        			var chamba = reg.presupuesto == "NA" ? reg.proceso : reg.presupuesto;
			        			while(k < labels_pptos[j].length && flag == false){
			        				if(labels_pptos[j][k] == chamba){
			        					datos_pptos[j][k] += reg.horas/3600000;
			        					flag = true;
			        				} else{
			        					k++;
			        				}

			        			}
							} else {
							}
		        		}
		        	}
	        	}

			});
			//console.log(labels_pptos);
			//console.log(datos_pptos);
			labels.push("Otros");
    		datos.push(otros);
			//<canvas id="myChart" width="400" height="400"></canvas>
			//var ctx = document.getElementById("myChart");
			var ctx1 = document.createElement('canvas');
			ctx1.id = 'ctx1RepCol';
			document.getElementById(id_ctx1_reporte_obras).appendChild(ctx1);

			var ctx2 = document.createElement('canvas');
			ctx2.id = 'ctx2RepCol';
			document.getElementById(id_ctx2_reporte_obras).appendChild(ctx2);

			var colors = [];

			for(i=0;i<datos.length;i++){
				colors[i] = colores_predeterminados[i];
			}

	        //Grafica de horas trabajadas en cada obra, sin contar Otros
	        var data1 = {
    			datasets: [{
					data: datos,
					backgroundColor: colors
    			}],

			    // These labels appear in the legend and in the tooltips when hovering different arcs
			    labels: labels
			}

	        window.myBar = new Chart(ctx1, {
			    type: 'pie',
			    data: data1,
			    options: {
        			title: {
    				    display: true,
    				    text: 'Horas trabajadas por obra'
					},
					responsive: true,
    			}
			});

			//Gráficas de horas por ppto de cada obra
			for(i = 0; i < labels.length - 1; i++){
				
				var flag = false;
				var j = 0;
				while(j<datos_pptos[i].length && flag == false){
					if(datos_pptos[i][j] != 0)
						flag = true;
					else
						j++;
				}
				if(flag){
					var colorsO = [];
					for(k=0;k<datos_pptos[i].length;k++){
						colorsO[k] = colores_predeterminados[k];
					}
					var ctxObra = document.createElement('canvas');
					ctxObra.id = 'ctxObraRepCol';
					document.getElementById(id_ctxObra_reporte_obras).appendChild(ctxObra);
	
					var dataObra = {
						datasets: [{
							data: datos_pptos[i],
							backgroundColor: colors
						}],
						labels: labels_pptos[i]
					}
	
					window.myBar = new Chart(ctxObra, {
						type: 'pie',
						data: dataObra,
						options: {
							title: {
								display: true,
								text: labels[i]
							},
							responsive: true,
							legend: {
								display: false
							},
						}
					})
				} else {
					var label_nulo = document.createElement('label');
					var t = document.createTextNode("La obra " + labels[i] + " no tiene horas registradas.\n");
					label_nulo.appendChild(t);
					document.getElementById(id_ctx2_reporte_obras).appendChild(label_nulo);
				}
				
			}

    		/*labels.push("Otros");
    		datos.push(otros);
    		//Grafica de horas trabajadas en cada obra, contando Otros
	        var data2 = {
    			datasets: [{
    			    data: datos
    			}],

			    // These labels appear in the legend and in the tooltips when hovering different arcs
			    labels: labels
			}

	        window.myBar = new Chart(ctx2, {
			    type: 'pie',
			    data: data2,
			    options: {
        			title: {
    				    display: true,
    				    text: 'Horas trabajadas por obra ("Otros" incluidos)'
    				}
    			}
			});*/

		});
    });

});