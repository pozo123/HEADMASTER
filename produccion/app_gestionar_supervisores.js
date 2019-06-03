var id_obras_ddl_supervisores = "obraDdlSupervisores";
var id_supervisores_ddl_supervisores = "supervisoresDdlSupervisores";
var id_div_obra_supervisores = "divObraSupervisores";
var id_div_supervisor_supervisores = "divSupervisorSupervisores";

var rama_bd_obras_magico = "obras";
var rama_bd_personal = "personal";
//rama_bd_supervisores
//rama_bd_obras_prod
$('#tabGestionarSup').click(function(){

    /*
    var select = document.getElementById(id_supervisores_ddl_supervisores) ;
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_personal).orderByChild('nombre').on('child_added',function(snapshot){
        var sup = snapshot.val();
        if(snapshot.child("areas/produccion").val() && sup.activo){
            var option2 = document.createElement('OPTION');
            option2.text = sup.nombre;
            option2.value = sup.uid;
            select.appendChild(option2);
        }
    });*/

    var select2 = document.getElementById(id_obras_ddl_supervisores) ;
    var option3 = document.createElement('option');
    option3.style = "display:none";
    option3.text = option3.value = "";
    select2.appendChild(option3);

    firebase.database().ref(rama_bd_obras_magico).orderByChild('nombre').on('child_added',function(snapshot){
        var obra = snapshot.val();
        if(!obra.terminada){
            var option4 = document.createElement('OPTION');
            option4.text = obra.nombre;
            option4.value = obra.nombre;
            select2.appendChild(option4);
        }
    });   
});

$('#' + id_obras_ddl_supervisores).change(function(){
    loadSupsGestSup();
});

function loadSupsGestSup(){
    var div = document.getElementById(id_div_obra_supervisores);
    //document.getElementById(id_supervisores_ddl_supervisores).selectedIndex = 0;
    //$('#' + id_supervisores_ddl_supervisores).empty();
    $('#' + id_div_obra_supervisores).html('');
    var nombre_obra = $('#' + id_obras_ddl_supervisores + " option:selected").val();
    firebase.database().ref(rama_bd_obras_magico + "/" + nombre_obra).once('value').then(function(snapshot){
        var obra = snapshot.val();
        snapshot.child("supervisor").forEach(function(childSnap){
            if(childSnap.child("activo").val()){
                var row = document.createElement('div');
                row.className = "form-group row";
                var col1 = document.createElement('div');
                col1.className = "col-lg-6";
                var col2 = document.createElement('div');
                col2.className = "col-lg-6";
                var label = document.createElement('label');
                label.innerHTML = childSnap.val().nombre;
                var button = document.createElement('button');
                button.id = childSnap.key;
                button.innerHTML = "Eliminar";
                button.className = "btn btn-outline-danger btn-block";
                button.onclick =function(){
                    var fal = false;
                    firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/supervisor/" + this.id + "/activo").set(fal);
                    alert("Eliminado");
                    loadSupsGestSup();
                };
                col1.appendChild(label);
                col2.appendChild(button);
                row.appendChild(col1);
                row.appendChild(col2);
                div.appendChild(row);
            }
        });
    });

    var select = document.getElementById(id_supervisores_ddl_supervisores);//document.createElement('select');
    var option = document.createElement('option');
    option.style = "display:none";
    option.text = option.value = "";
    select.appendChild(option);

    firebase.database().ref(rama_bd_personal).orderByChild('nombre').on('child_added',function(snapshot){
        var sup = snapshot.val();
        if(snapshot.child("areas/produccion").val() && sup.activo){
            var option2 = document.createElement('OPTION');
            option2.text = sup.nombre;
            option2.value = sup.uid;
            select.appendChild(option2);
        }
    });
    //var divButton = document.createElement('div');
    //divButton.className = "form-row";
    var row1 = document.createElement('div');
    row1.className = "form-group row";
    var buttonAdd = document.createElement('button');
    buttonAdd.innerHTML = "Agregar";
    buttonAdd.className = "btn btn-outline-success btn-block";
    buttonAdd.onclick = function(){
        var sup_uid = $('#' + id_supervisores_ddl_supervisores + ' option:selected').val();
        if(sup_uid == ""){
            alert("Selecciona un supervisor");
        } else {
            var sup = {
                nombre: $('#' + id_supervisores_ddl_supervisores + ' option:selected').text(),
                activo: true,
            }
            firebase.database().ref(rama_bd_obras_magico + "/" + nombre_obra + "/supervisor/" + sup_uid).set(sup);
            alert("Agregado");
            loadSupsGestSup();
        }
    };

    //div.appendChild(select);
    row1.appendChild(buttonAdd);
    div.appendChild(row1);
    //div.appendChild(divButton);
};

/*
$('#' + id_supervisores_ddl_supervisores).change(function() {
    var div = document.getElementById(id_div_supervisor_supervisores);
    document.getElementById(id_obras_ddl_supervisores).selectedIndex = 0;
    $('#' + id_div_supervisor_supervisores).empty();
    var sup_uid = $('#' + id_supervisores_ddl_supervisores + " option:selected").val();
    firebase.database().ref(rama_bd_personal + "/" + sup_uid).once('value').then(function(snapshot){
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
});*/