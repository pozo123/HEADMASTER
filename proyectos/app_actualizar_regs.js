
var id_boton_chido = "botonChidoRegs";
var rama_bd_registros = "proyectos/registros";
var rama_bd_inges = "proyectos/inges";
var rama_bd_obras = "proyectos/obras";

$('#' + id_boton_chido).click(function(){
    
    /*
    //PRORRATEAR MISCELANEOS
    //FALTA DEFINIR LALA Y LELE
    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            var obra = obra_snap.val();
            var kaizen_total = obra.kaizen;
            var proc_misc = obra.procesos.MISC.kaizen;
            obra_snap.child("procesos").forEach(function(proc_snap){
                var proc = proc_snap.val();
                //lala = .PRODUCCION.COPEO.PREC... o para proporcion con venta?
                var proporcion = parseFloat(proc.kaizen.lala) / parseFloat(kaizen_total.lala);
                var aumento = parseFloat(proc_misc.lala) * proporcion;
                var valor_nuevo = parseFloat(proc.kaizen.lala) + aumento;
                //lele = nueva direccion (ej COSTO_MISC)
                console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele: " + valor_nuevo);
                //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele").set(valor_nuevo);
                if(proc.num_subprocesos > 0){
                    proc_snap.child("subprocesos").forEach(function(sub_snap){
                        var subp = sub_snap.val();
                        //lala = .PRODUCCION.COPEO.PREC... o para proporcion con venta?
                        var proporcion = parseFloat(proc.kaizen.lala) / parseFloat(kaizen_total.lala);
                        var aumento = parseFloat(proc_misc.lala) * proporcion;
                        var valor_nuevo = parseFloat(proc.kaizen.lala) + aumento;
                        //lele = nueva direccion (ej COSTO_MISC)
                        console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele: " + valor_nuevo);
                        //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/lele").set(valor_nuevo);
                    });
                }
            });
        });
    });
    */

    /*
    //AGREGAR PROFIT BRUTO Y NETO A TODAS LAS OBRAS, PROCESO Y SUBPROCESOS
    var profit_kaiz = {
        PROG: {
            BRUTO: 0,
            NETO: 0,
        },
        REAL: {
            BRUTO: 0,
            NETO: 0,
        },
    };
    firebase.database().ref(rama_bd_obras_magico).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            var obra = obra_snap.val();
            console.log(rama_bd_obras_magico + "/" + obra.nombre + "/kaizen/PROFIT");
            //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/kaizen/PROFIT").set(profit_kaiz);
            obra_snap.child("procesos").forEach(function(proc_snap){
                var proc = proc_snap.val();
                console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/PROFIT");
                //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/kaizen/PROFIT").set(profit_kaiz);
                if(proc.num_subprocesos > 0){
                    proc_snap.child("subprocesos").forEach(function(sub_snap){
                        var subp = sub_snap.val();
                        console.log(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/subprocesos/" + subp.clave + "/kaizen/PROFIT");
                        //firebase.database().ref(rama_bd_obras_magico + "/" + obra.nombre + "/procesos/" + proc.clave + "/subprocesos/" + subp.clave + "/kaizen/PROFIT").set(profit_kaiz);
                    });
                }
            });
        });
    });
    */

    /*
    //CAMBIAR REGISTROS "MISCELANEOS" POR "OTROS"
    var i = 0;
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            var flag = true;
            if(reg.obra == "Miscelaneo"){
                console.log("Registro " + i + ": " + reg.cu + " actualizado.");
                i++;
                var obj = "Otros";
                firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/obra").set(obj);
            }
        });
    });
    */

    //REGISTROS CON MAS DE 15 HORAS -> 9 HORAS
    /*
    var i = 0;
    firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            if(reg.horas/3600000 > 15){
                i++;
                console.log("Registro " + i + ": " + cu + " acotado.");
                //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/horas").set(9);
            }
        });
    });
    */

    //RESETEAR TODAS LAS HORAS TRABAJADAS DE LOS PPTOS A 0
    
/*     firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){
        snapshot.forEach(function(obra_snap){
            obra_snap.child("presupuestos").forEach(function(presu_snap){//CHECA QUE SI SEA ASI
                var presu = presu_snap.val();
                firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/horas_trabajadas").set(0);
                console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/horas_trabajadas" + " = 0");
                presu_snap.child("colaboradores_asignados/ie").forEach(function(col_snap){
                    var col = col_snap.key;
                    firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ie/" + col + "/horas_trabajadas").set(0);               
                    console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ie/" + col + "/horas_trabajadas" + " = 0");
                });
                presu_snap.child("colaboradores_asignados/ihs").forEach(function(col_snap){
                    var col = col_snap.key;
                    firebase.database().ref(rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ihs/" + col + "/horas_trabajadas").set(0);               
                    console.log("Modificando: " + rama_bd_obras + "/" + obra_snap.val().nombre + "/presupuestos/" + presu.nombre + "/colaboradores_asignados/ihs/" + col + "/horas_trabajadas" + " = 0");
                });
            });
        });
    });
     */
    
    //RESETAR TODAS LAS HORAS TRABAJADAS EN INGES/OBRAS/PPTO A 0
/*     firebase.database().ref(rama_bd_inges).once('value').then(function(snapshot){

        snapshot.forEach(function(inge_snap){
            inge_snap.child("obras").forEach(function(obra_snap){
                obra_snap.forEach(function(presu_snap){
                    if(presu_snap.key != "obra"){
                        firebase.database().ref(rama_bd_inges + "/" + inge_snap.key + "/obras/" + obra_snap.key + "/" + presu_snap.key + "/horas_trabajadas").set(0);
                        console.log("Modificando: " + rama_bd_inges + "/" + inge_snap.key + "/obras/" + obra_snap.key + "/" + presu_snap.key + "/horas_trabajadas");
                    }
                });
            });
        });
    });  */

    //VOLVER A CARGAR LAS HORAS TRABAJADAS A TODOS LOS PPTOS DESDE REGISTROS
    //1 de 2 lugares a actualizar:
    //horas_trabajadas en presu
    
    /* firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){

        var json = {};
        snapshot.forEach(function(obra_snap){
            var json_obra = {};
            obra_snap.child("presupuestos").forEach(function(presu_snap){
                json_obra[presu_snap.val().nombre] = 0;
            });
            json[obra_snap.val().nombre] = json_obra;
        });
        
        firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
            var count = 0;
            snapshot.forEach(function(childSnapshot){
                var regis = childSnapshot.val();
                count++;
                console.log(count);
                console.log(regis.obra);
                if(regis.obra != "Otros"){
                    console.log(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas")
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").once('value').then(function(snapshot){
                        
                        console.log("hola");
                        var horas_nuevas = 0;
                        var horas = snapshot.val();
                        console.log("horas de db " + horas)
                        if(horas != null){
                            horas_nuevas = horas + regis.horas/3600000;
                        } else {
                            horas_nuevas = regis.horas/3600000;
                        }
                        console.log("horas sumadas " + horas_nuevas)
                        json[regis.obra][regis.presupuesto] = json[regis.obra][regis.presupuesto] + horas_nuevas;
                        var horas_ppto = json[regis.obra][regis.presupuesto];
                        firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas").set(horas_ppto);
                        console.log(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/horas_trabajadas")
                    });
                    
                }
            });
        });
        
    }); */

    //2 de 2 lugares a actualizar:
    //horas_trabajadas en el colaborador especifico en colaboradores_asignados
/*     firebase.database().ref(rama_bd_obras).once('value').then(function(snapshot){

        var json = {};
        snapshot.forEach(function(obra_snap){
            var json_obra = {};
            obra_snap.child("presupuestos").forEach(function(presu_snap){
                var json_ppto = {
                    ie: {},
                    ihs: {},
                };
                presu_snap.child("colaboradores_asignados/ie").forEach(function(snap_ie){
                    if(snap_ie.val().nombre != null){
                        console.log(snap_ie.val());
                        json_ppto.ie[snap_ie.val().nombre] = 0; 
                    }
                });
                presu_snap.child("colaboradores_asignados/ihs").forEach(function(snap_ihs){
                    if(snap_ihs.val().nombre != null){
                        json_ppto.ihs[snap_ihs.val().nombre] = 0; 
                    }
                });
                json_obra[presu_snap.val().nombre] = json_ppto;
            });
            json[obra_snap.val().nombre] = json_obra;
        });
        
        firebase.database().ref(rama_bd_registros).once('value').then(function(snapshot){
            var count = 0;
            snapshot.forEach(function(childSnapshot){
                var regis = childSnapshot.val();
                if(regis.obra != "Otros"){
                    var esp = "ihs";
                    if(regis.esp == "ie"){
                        esp = "ie";
                    }
                    firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp).orderByChild("nombre").equalTo(regis.inge).once('value').then(function(snapshot){
                        snapshot.forEach(function(snap_inge){
                            var username = snap_inge.key;
                            var horas = snap_inge.val().horas_trabajadas;
                            var horas_nuevas = 0;
                            if(horas != null){
                                horas_nuevas = horas + regis.horas/3600000;
                            } else {
                                horas_nuevas = regis.horas/3600000;
                            }
                            json[regis.obra][regis.presupuesto][esp][regis.inge] += horas_nuevas;
                            var horas_ppto = json[regis.obra][regis.presupuesto][esp][regis.inge];
                            firebase.database().ref(rama_bd_obras + "/" + regis.obra + "/presupuestos/" + regis.presupuesto + "/colaboradores_asignados/" + esp + "/" + username + "/horas_trabajadas").set(horas_ppto);
                        })
                    });
                    
                }
            });
        });
        
    });
 */

        //ELIMINAR REGISTROS NUESTROS
        /*
        var i = 0;
    firebase.database().ref(rama_bd_registros).on('value',function(snapshot){
        snapshot.forEach(function(reg_snap){
            var reg = reg_snap.val();
            var flag = true;
            firebase.database().ref(rama_bd_inges).orderByChild("nombre").equalTo(reg.inge).once('child_added').then(function(ing_snapshot){
                var ing = ing_snapshot.val();
                if(flag === true && ing.credenciales === 0){
                    //firebase.database().ref(rama_bd_registros + "/" + reg.cu + "/esp").set(ing.esp_chamba);
                    var cu = reg.cu;
                    //console.log("Registro " + i + ": " + cu + " eliminado.");
                    firebase.database().ref(rama_bd_registros).child(cu).once('value').then(function(snapshot){
                        var update = {};
                        update[cu] = null;
                        //firebase.database().ref(rama_bd_registros).update(update);
                    });
                    flag = false;
                }
            });
        });
    });
    */
   
});