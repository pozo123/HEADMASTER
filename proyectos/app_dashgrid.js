var id_columns_dashgrid = "noColums";
var id_rows_dashgrid = "noRows";
var rama_bd_dashgrid = "proyectos/dashgrid";
var rama_bd_inges = "proyectos/inges";
var id_div_dashgrid = "divDashgrid";
var id_actualizar_button_dashgrid = "actualizarDashgrid";
var no_rows_dashgrid;
var no_columns_dashgrid;

//Este ponerselo en el onclick de la pestaña
/* $(document).ready(function() {
	firebase.database().ref(rama_bd_dashgrid).once('value').then(function(snapshot){
		var snap = snapshot.val();
        no_rows_dashgrid = snap.renglones;
		no_columns_dashgrid = snap.columnas;
        $('#' + id_rows_dashgrid).val(no_rows_dashgrid);
        $('#' + id_columns_dashgrid).val(no_columns_dashgrid);
        loadGrid(no_rows_dashgrid, no_columns_dashgrid);
	});
}); */

$('#tabDashgrid').click(function(){
	firebase.database().ref(rama_bd_dashgrid).once('value').then(function(snapshot){
		var snap = snapshot.val();
        no_rows_dashgrid = snap.renglones;
		no_columns_dashgrid = snap.columnas;
        $('#' + id_rows_dashgrid).val(no_rows_dashgrid);
        $('#' + id_columns_dashgrid).val(no_columns_dashgrid);
        loadGrid(no_rows_dashgrid, no_columns_dashgrid);
	});
});

$('#' + id_columns_dashgrid).change(function(){
    if($('#' + id_columns_dashgrid).val() === "")
        $('#' + id_columns_dashgrid).val(1);
    else if((12 % $('#' + id_columns_dashgrid).val()) != 0){
    	alert("El número de columnas debe ser divisor de 12 (1, 2, 3, 4, 6 o 12)")
    } else{
    	no_columns_dashgrid = $('#' + id_columns_dashgrid).val();
   		loadGrid(no_rows_dashgrid, no_columns_dashgrid);
    } 
});

$('#' + id_rows_dashgrid).change(function(){
    if($('#' + id_rows_dashgrid).val() === "")
        $('#' + id_rows_dashgrid).val(1);
    no_rows_dashgrid = $('#' + id_rows_dashgrid).val();
   loadGrid(no_rows_dashgrid, no_columns_dashgrid);
});

function loadGrid(no_rows, no_columns){
    var div = document.getElementById(id_div_dashgrid);
    $('#' + id_div_dashgrid).empty();
	for(var i=0;i<no_rows;i++){
		var row = document.createElement('div');
		for(var j=0;j<no_columns;j++){
			var box = document.createElement('select');
			box.id = "box_" + i + j;
			box.appendChild(new Option("",""));
			firebase.database().ref(rama_bd_inges).on('child_added',function(snapshot){
				var inge = snapshot.val();
				if(inge.permisos.perfil === true)
					box.appendChild(new Option(inge.nickname,inge.uid));
			});
            row.appendChild(box);
        }
        div.appendChild(row);
	}
}

$('#' + id_actualizar_button_dashgrid).click(function () {
	var update = {};
    update[rama_bd_dashgrid] = null;
	//Limpia la bd, pero chance no jala porque esta en raiz.. aguas, no te vaya a borrar todo
	firebase.database().ref().update(update);
    firebase.database().ref(rama_bd_dashgrid + "/columnas").set(no_columns_dashgrid);
    firebase.database().ref(rama_bd_dashgrid + "/renglones").set(no_rows_dashgrid);
	for(var i=0;i<no_rows_dashgrid;i++){
		for(var j=0;j<no_columns_dashgrid;j++){
			if($('#box_' + i + j + " option:selected").val() !== ""){
				var coordenadas = {
					ren: i,
					col: j,
					nombre: $('#box_' + i + j + " option:selected").text(),
                };
                firebase.database().ref(rama_bd_dashgrid + "/colaboradores/" + $('#box_' + i + j + " option:selected").val()).set(coordenadas);
			}
		}
	}
});