var id_codigo_genero = "codigoGenero";
var id_nombre_genero = "nombreGenero";
var id_codigo_tipo = "codigoTipo";
var id_nombre_tipo = "nombreTipo";

var id_agregar_button_genero = "agregarGenero";
var id_agregar_button_tipo = "agregarTipo";

var rama_bd_generos = "generos";
var rama_bd_tipos = "tipos_presupuesto";

$('#' + id_agregar_button_genero).click(function(){
	var genero = {
		nombre: $('#' + id_nombre_genero).val(),
		codigo: $('#' + id_codigo_genero).val(),
	}
	firebase.database().ref(rama_bd_generos + "/" + $('#' + id_nombre_genero).val()).set(genero);
});

$('#' + id_agregar_button_tipo).click(function(){
	var tipo = {
		nombre: $('#' + id_nombre_tipo).val(),
		codigo: $('#' + id_codigo_tipo).val(),
	}
	firebase.database().ref(rama_bd_tipos + "/" + $('#' + id_nombre_tipo).val()).set(tipo);
});