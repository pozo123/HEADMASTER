var id_obras_ddl_dashboard_individual = "obrasDdlDashboardInd";


firebase.auth().onAuthStateChanged(user => {
    if(user) {
        var user_uid = user.uid;

        // Código para llenar el dropdown list de obras con filtro de obras asignadas
        var select = document.getElementById(id_obras_ddl_dashboard_individual);
        var option = document.createElement('option');
        option.style = "display:none";
        option.text = option.value = "";
        select.appendChild(option);
        console.log(rama_bd_personal + "/" + user_uid)
        firebase.database().ref(rama_bd_personal + "/" + user_uid).once('value').then(function(snapshot){
            var pers = snapshot.val();
                if(snapshot.child("areas/administracion").val() == true || pers.credenciales < 3){
                    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
                        snapshot.forEach(function(obraSnap){
                            var obra = obraSnap.val();
                            if(!obra.terminada){
                                var option2 = document.createElement('option');
                                option2.text = option2.value = obra.nombre; 
                                select.appendChild(option2);
                            }
                        });
                    });
                } else {
                var single = 0;
                firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
                    snapshot.forEach(function(childSnap){
                        if(!childSnap.child("terminada").val()){
                            childSnap.child("supervior").forEach(function(supSnap){
                                if(supSnap.key == user_uid && supSnap.child("acivo").val() == true){
                                    single++;
                                    var option2 = document.createElement('option');
                                    option2.text = option2.value = childSnap.child("nombre").val(); 
                                    select.appendChild(option2);
                                }
                            });
                        }
                    });
                    if(single == 1){
                        document.getElementById(id_obras_ddl_dashboard_individual).selectedIndex = 1;
                        $('#' + id_obras_ddl_dashboard_individual).addClass("hidden");
                    } else {
                        $('#' + id_obras_ddl_dashboard_individual).removeClass("hidden");
                    }
                });
            }
        });

        // ----------------------------------------------------------------------------
        
        var semana_actual = getWeek(new Date().getTime())[0];
        var year_actual = getWeek(new Date().getTime())[1];

    }
});