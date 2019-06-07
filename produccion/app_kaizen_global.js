var id_gantt_div_global = "kaizenGlobalDiv";
var id_total_venta_global = "totalVentaGlobal";
var id_total_profit_real_bruto_global = "totalProfitRealGlobal";
var id_total_profit_prog_bruto_global = "totalProfitProgGlobal";
var id_total_profit_real_neto_global = "totalProfitNetoRealGlobal";
var id_total_profit_prog_neto_global = "totalProfitNetoProgGlobal";
var id_editable_cb_global = "editableGlobal";

var rama_bd_obras_magico = "obras";
var rama_bd_personal = "personal";

var css = ["gtaskblue", "gtaskred", "gtaskgreen", "gtaskyellow", "gtaskpurple", "gtaskpink"];
var username;
var aut;
var display_obras = [];
var supervisores = [];

$(document).ready(function(){
	username = uid_usuario_global;
	firebase.database().ref(rama_bd_personal + "/" + username).once('value').then(function(snapshot){
		var pers = snapshot.val();
		if(snapshot.child("areas/administracion") == true || pers.credenciales < 3){
			aut = "gerente";
			drawKG();
		} else {
			firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
				snapshot.forEach(function(childSnap){
					childSnap.child("supervisor").forEach(function(supSnap){
						if(supSnap.key == username && supSnap.child("activo").val()){
							display_obras[display_obras.length] = obra.nombre;
						}
					});
				});
				aut = "supervisor";
				drawKG();
			});
		}
	});
	firebase.database().ref(rama_bd_personal).once('value').then(function(snapshot){
		snapshot.forEach(function(childSnap){
			if(childSnap.child("areas/produccion").val()){
				supervisores.push({id: supervisores.length, name: childSnap.val().nombre});
			}
		});
	});
});

function editValue(list, task, event, cell, column) {
  console.log(this);
  const found = list.find(item => item.pID == task.getOriginalID());
  if (!found) {
    return;
  }
  else {
    found[column] = event ? event.target.value : '';
  }
}

function drawKG(){
	var g = new JSGantt.GanttChart(document.getElementById(id_gantt_div_global), 'month');
	const vEditable = document.querySelector('#' + id_editable_cb_global + ':checked') ? true : false;
	const vUseSort = false;//?? Creo que es por fecha

	//No tenían var, pero pues si no truena... no?
	var delay = 100;//Cuanto se tarda en esconderse el mouseover text
	//var vUseSingleCell = 0;//document.getElementById('useSingleCell').value;
    //var vShowRes = 0;//document.querySelector('#vShowRes:checked') ? 1 : 0;
    var vShowCost = 0;//document.querySelector('#vShowCost:checked') ? 1 : 0;
    //var vShowComp = 0;//document.querySelector('#vShowComp:checked') ? 1 : 0;
    //var vShowDur = 0;//document.querySelector('#vShowDur:checked') ? 1 : 0;
    //var vShowStartDate = 0;//document.querySelector('#vShowStartDate:checked') ? 1 : 0;
    //var vShowEndDate = 0;//document.querySelector('#vShowEndDate:checked') ? 1 : 0;
    var vShowPlanStartDate = 0;//document.querySelector('#vShowPlanStartDate:checked') ? 1 : 0;
    var vShowPlanEndDate = 0;//document.querySelector('#vShowPlanEndDate:checked') ? 1 : 0;
    var vShowTaskInfoLink = 0;//document.querySelector('#vShowTaskInfoLink:checked') ? 1 : 0;
    var vShowEndWeekDate = 0;//document.querySelector('#vShowEndWeekDate:checked') ? 1 : 0;
    var vAdditionalHeaders = { // Add data columns to your table
		inicio: {
			title: 'Inicio (sem)'
		},
		final: {
			title: 'Final (sem)'
		}
	};
	g.setOptions({
      vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,            
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to display dates in the "Major" header of the "Day" view
      vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
      vMonthMinorDateDisplayFormat: 'mon - Week',
      vLang: 'es',
      //vUseSingleCell, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
      //vShowRes,
      vShowCost,
      //vShowComp,
      //vShowDur,
      //vShowStartDate,
      //vShowEndDate,
      vShowPlanStartDate,
      vShowPlanEndDate,
      //vAdditionalHeaders,
      vEventsChange: {
        taskname: editValue.bind(this, jsonObj),
        res: editValue.bind(this, jsonObj),
        dur: editValue.bind(this, jsonObj),
        comp: editValue.bind(this, jsonObj),
        start: editValue.bind(this, jsonObj),
        end: editValue.bind(this, jsonObj),
        planstart: editValue.bind(this, jsonObj),
        planend: editValue.bind(this, jsonObj),
        cost: editValue.bind(this, jsonObj)
      },
      vResources: supervisores,
      //vEventClickRow: console.log,
      vShowTaskInfoLink, // Show link in tool tip (0/1)
      vShowEndWeekDate,  // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vTooltipDelay: delay,
      //vDebug,
      //vEditable,
      vUseSort,
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
    });

	/*g.setOptions({
		vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
		vQuarterColWidth: 36,
		vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
		vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to dates in the "Major" header of the "Day" view
		vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
		vLang: 'es',//'en'
		vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
		vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily
		vAdditionalHeaders: vAdditionalHeaders,
		vUseSingleCell: 10000, // Set the threshold cell per table row (Helps performance for large data.
		vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers,
	});*/


	firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
		var i = 1;
		var total_venta = 0;
		var total_profit_real_bruto = 0;
		var total_profit_real_neto = 0;
		var total_profit_prog_bruto = 0;
		var total_profit_prog_neto = 0;
		snapshot.forEach(function(obraSnap){
			var obra = obraSnap.val();
			var autorizar = false;
			if(aut == "supervisor"){
				var i_d=0;
				while(i_d<display_obras.length && autorizar == false){
					if(display_obras[i_d].val() == obra.nombre){
						autorizar = true;
					}
					i_d++;
				}
			}
			if(aut == "gerente" || autorizar == true){
				var comp = (100 * parseFloat(obra.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(obra.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO)).toFixed(2); 
				var cost = parseFloat(obra.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(obra.kaizen.ADMINISTRACION.ANTICIPOS.PPTO);
				var f_i = new Date(obra.fechas.fecha_inicio_teorica);
				var f_f = new Date(obra.fechas.fecha_final_teorica);
				var sup = "";
				obraSnap.child("supervisor").forEach(function(supSnap){
					var superv = supSnap.val();
					if(superv.activo == true){
						sup = sup + superv.nombre + ". ";
					}
				});
				console.log(f_i.toISOString().substring(0, 10));
				g.AddTaskItemObject({
					pID: i,
					pName: obra.nombre,
					pStart: f_i.toISOString().substring(0, 10), //fechas[i].f_i.toISOString().substring(0,10),
					pEnd: f_f.toISOString().substring(0, 10), //fechas[i].f_f.toISOString().substring(0,10),
					pPlanStart: "",//fecha_inicio_real? o al reves?
					pPlanEnd: "",//fecha_final_real? o al reves?
					pClass: "ggroupblack",
					pLink: "",
					pMile: 0,
					pRes: sup,
					pComp: comp, 
					pGroup: 1, //0-> no grupo, 1-> grupo
					pParent: 0, //id parent. 0-> este es el parent
					pOpen: 0,
					pDepend: "", //Para flechitas si hay dependencia entre procesos
					pCaption: "",
					pCost: cost,
					inicio: getWeek(f_i.getTime())[0],
					final: getWeek(f_f.getTime())[0],
				});
				total_venta = total_venta + cost;
				total_profit_prog_bruto = total_profit_prog_bruto + parseFloat(obra.kaizen.PROFIT.PROG.BRUTO);
				total_profit_prog_neto = total_profit_prog_neto + parseFloat(obra.kaizen.PROFIT.PROG.NETO);
				total_profit_real_bruto = total_profit_real_bruto + parseFloat(obra.kaizen.PROFIT.REAL.BRUTO);
				total_profit_real_neto = total_profit_real_neto + parseFloat(obra.kaizen.PROFIT.REAL.NETO);
				var j = 0;
				var id_obra = i;
				obraSnap.child("procesos").forEach(function(childSnapshot){
					i++;
					var proc = childSnapshot.val();
					var comp_proc = (100 *parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO)).toFixed(2); 
					var cost_proc = parseFloat(proc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(proc.kaizen.ADMINISTRACION.ANTICIPOS.PPTO);
					var f_i_p = new Date(proc.fechas.fecha_inicio_teorica);
					var f_f_p = new Date(proc.fechas.fecha_final_teorica);
					console.log( f_i_p.toISOString().substring(0, 10));
					g.AddTaskItemObject({
						pID: i,
						pName: proc.clave,
						pStart: f_i_p.toISOString().substring(0, 10),//fechas[i].f_i_p.toISOString().substring(0,10),
						pEnd: f_f_p.toISOString().substring(0, 10),//fechas[i].f_f_p.toISOString().substring(0,10),
						pPlanStart: "",//fecha_inicio_real? o al reves?
						pPlanEnd: "",//fecha_final_real? o al reves?
						pClass: css[j%6],
						pLink: "",
						pMile: 0,
						pRes: sup,//supervisor obra,
						pComp: comp_proc,
						pGroup: 1, //0-> no grupo, 1-> grupo
						pParent: id_obra, //id parent. 0-> este es el parent
						pOpen: 0,
						pDepend: "", //Para flechitas si hay dependencia entre procesos
						pCaption: "",
						pCost: cost_proc,
					});
					if(proc.subprocesos != ""){
						var k = 0;
						var id_proc = i;
						childSnapshot.child("subprocesos").forEach(function(subProcSnap){
							i++;
							var subproc = subProcSnap.val();
							var comp_subp = (100 * parseFloat(subproc.kaizen.ADMINISTRACION.ESTIMACIONES.EST) / parseFloat(subproc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO)).toFixed(2); 
							var cost_subp = parseFloat(subproc.kaizen.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(subproc.kaizen.ADMINISTRACION.ANTICIPOS.PPTO);
							//var costo_subproc = parseFloat(subproc.ADMINISTRACION.ESTIMACIONES.PPTO) + parseFloat(subproc.ADMINISTRACION.ANTICIPOS.PPTO);
							f_i_s = new Date(subproc.fechas.fecha_inicio_teorica);
							f_f_s = new Date(subproc.fechas.fecha_final_teorica);
							console.log(f_i_s.toISOString().substring(0, 10));
							g.AddTaskItemObject({
								pID: i,
								pName: subproc.clave,
								pStart: f_i_s.toISOString().substring(0, 10),//fechas[i].f_i_s.toISOString().substring(0,10),
								pEnd: f_f_s.toISOString().substring(0, 10),//fechas[i].f_f_s.toISOString().substring(0,10),
								pPlanStart: "",//fecha_inicio_real? o al reves?
								pPlanEnd: "",//fecha_final_real? o al reves?
								pClass: css[(6-k)%6],
								pLink: "",
								pMile: 0,
								pRes: sup,//obra.supervisor,
								pComp: comp_subp,
								pGroup: 1, //0-> no grupo, 1-> grupo
								pParent: id_proc, //id parent. 0-> este es el parent
								pOpen: 0,
								pDepend: "", //Para flechitas si hay dependencia entre procesos
								pCaption: "",
								pCost: cost_subp,
							});
							k++;
						});
					}
					j++;
				});
				i++;
			}
		});
		g.Draw();
		$('#' + id_total_profit_prog_bruto_global).text("$" + formatMoney(total_profit_prog_bruto));
		$('#' + id_total_profit_prog_neto_global).text("$" + formatMoney(total_profit_prog_neto));
		$('#' + id_total_profit_real_bruto_global).text("$" + formatMoney(total_profit_real_bruto));
		$('#' + id_total_profit_real_neto_global).text("$" + formatMoney(total_profit_real_neto));
	});
	//g.setShowRes(0);
	//g.setShowDur(0);
	//g.setShowComp(0);
	//g.setShowStartDate(0);
	//g.setShowEndDate(0);
	//g.setAdditionalHeaders({ inicio: { title: 'Inicio (sem)' } });//checar si sintaxis sí es así
	//g.setAdditionalHeaders({ final: { title: 'Final (sem)' } });//checar si sintaxis sí es así

}