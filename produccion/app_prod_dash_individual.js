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

        var aut = (areas_usuario_global.administracion || creden_usuario_global < 3);
        var single = 0;
        for(key in nombre_obras){
            console.log(nombre_obras[key]);
            var obra = nombre_obras[key];
            var aut_local = false;
            if(!obra.terminada){
                if(!aut){
                    for(sup in obra.supervisor){
                        if(sup == uid_usuario_global && obra.supervisor[sup].activo){
                            aut_local = true;
                            single++;
                        }
                    }
                }
                if(aut || aut_local){
                    var option2 = document.createElement('OPTION');
                    option2.text = key;
                    option2.value = key;
                    select.appendChild(option2);
                }
            }
        }
        if(single == 1){
            document.getElementById(id_obras_ddl_dashboard_individual).selectedIndex = 1;
            $('#' + id_obras_ddl_dashboard_individual).addClass("hidden");
        } else {
            $('#' + id_obras_ddl_dashboard_individual).removeClass("hidden");
        }

        // ----------------------------------------------------------------------------
        
        var semana_actual = getWeek(new Date().getTime())[0];
        var year_actual = getWeek(new Date().getTime())[1];

    }
});