function generaPresupuestoAdicional(vista_previa, obra_ppto, clave_adic, titulo_ppto, nombre_ppto, atencion, insumos_json, porcentaje_indirecto, anticipo, exc_lista, reqs_lista, tiempoEntrega, fisc_bool, banc_bool, iva_bool, indirectos_bool, fecha_ppto, imagenes_evidencia){
    var obra = obra_ppto.nombre;
    var direccion = obra_ppto.direccion;
    var cliente = obra_ppto.cliente;
    var anticipo_str;
    if(anticipo == 0){
        anticipo_str = "100% contra entrega";
    } else if(anticipo == 100){
        anticipo_str = "100% anticipo";
    } else {
        anticipo_str = anticipo + "% anticipo, resto contra avance";
    }

    porcentaje_anticipo = parseFloat(anticipo) * 0.01;

    var reqs_str = "";
    for(key in reqs_lista){
        reqs_str = reqs_str + "-" + reqs_lista[key] + "\n";
    }
    if(reqs_str == ""){
        reqs_str = "NA";
    }

    var exc_str = "";
    for(key in exc_lista){
        exc_str = exc_str + "-" + exc_lista[key] + "\n";
    }
    if(exc_str == ""){
        exc_str = "NA";
    }

    var atn_str = atencion;

    var logo;

    if(vista_previa){
        obra = "DOCUMENTO NO VÁLIDO";
        logo ={
            text: "DOCUENTO NO VÁLIDO",
            width: 70,
            height: 50,
            alignment: 'left',
        }
    } else {
        obra = obra.toUpperCase();
        logo = {
            image: 'data:image/png;base64,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',
            width: 100,
            height: 71,
            alignment: 'left',
        }
    }
    //________________________________________________________________________________________

    var tituloF = "";
    var tituloB = "";
    var terminosFiscales = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";
    var terminosBancarios = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";
    var fiscales = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";
    var bancarios = "\n" + "\n" +"\n" +"\n" +"\n" +"\n" +"\n" + "\n";

    if(fisc_bool){
        tituloF = "Datos de Facturación"
        terminosFiscales = "Nombre de la empresa:" + "\n" +
        "Contacto:" + "\n" +
        "Teléfono:" + "\n" +
        "Email:" + "\n" +
        "Dirección:" + "\n" + "\n" +
        "RFC:";

        fiscales = "Head Administraciones, S.A. de C.V." + "\n" + "\n"+
        "C.P. Luis Cortés" + "\n" +
        "62737900" + "\n" +
        "luis@headingenieria.mx" + "\n" +
        "Av. Constituyentes 561 Int. 101a, Col. América, Miguel Hidalgo, Ciudad de México, C.P. 11820" + "\n" +
        "HAD160523HH3";
    }

    if(banc_bool){
        tituloB = "Datos Bancarios"
        terminosBancarios ="Nombre del beneficiaro:" + "\n" +
        "Banco:" + "\n" +
        "Número de cuenta:" + "\n" +
        "CLABE:" + "\n" +
        "Tipo de cuenta:" + "\n";

        bancarios = "Head Administraciones, S.A. de C.V." + "\n" + "\n"+
        "Banco Mifel, S.A." + "\n" +
        "1600279218" + "\n" +
        "042180016002792181" + "\n" +
        "Moneda Nacional" + "\n";
    }
    var bod_head = [
        [
            {
                colSpan:4,
                border: [false, false, false, false],
                text: obra,
                bold: true,
                //color:'#2C3F5A',
                margin: [0,5],
                fontSize:10,
            },
            '',
            '',
            '',
            {
                colSpan:2,
                border: [false, false, false, false],
                text: nombre_ppto,
                bold: true,
                margin: [0,5],
                fontSize: 12,
                alignment: 'center',
            },
            '',
        ],
        [
            {
                rowSpan:4,
                colSpan:4,
                border: [false, false, false, false],
                text: direccion.calle + ", No. " + direccion.numero + "\n" +
                "col. " + direccion.colonia + "\n" + direccion.ciudad + ", \n" +
                direccion.estado + ", " + direccion.cp,
                margin: [0,5],
                fontSize:8,
            },
            '',
            '',
            '',
            {
                colSpan:1, rowSpan:2,
                border: [false, false, false, false],
                text: 'CLAVE: ',
                margin: [0,1],
                fontSize: 8,
                alignment: 'right',
            },
            {   colSpan:1, rowSpan:2,
                border: [false, false, false, false],
                text: clave_adic,
                bold: true,
                margin: [0,1],
                fontSize: 8,
                alignment: 'left',
            },
        ],
        [
            '',
            '',
            '',
            '',
            '',
            '',
        ],
        [
            '',
            '',
            '',
            '',
            {
                colSpan:1,
                border: [false, false, false, false],
                text: 'CLIENTE: ',
                margin: [0,1],
                fontSize: 8,
                alignment: 'right',
            },
            {   colSpan:1,
                border: [false, false, false, false],
                text: cliente,
                bold: true,
                margin: [0,1],
                fontSize: 8,
                alignment: 'left',
            },
        ],
        [
            '',
            '',
            '',
            '',
            {
                colSpan:1,
                border: [false, false, false, false],
                text: 'AT \' N: ',
                margin: [0,1],
                fontSize: 8,
                alignment: 'right',
            },
            {   colSpan:1,
                border: [false, false, false, false],
                text:  atn_str,
                bold: true,
                margin: [0,1],
                fontSize: 11,
                alignment: 'left',
            },
        ],
        [
            {
                colSpan:6,
                border: [false, false, false, false],
                text: ['A continuación enviamos a su amable consideración el presupuesto adicional ',
                 {text: titulo_ppto.toUpperCase(), bold: true, fontSize: 9},
                 " a efectuarse en el edificio ubicado en la dirección arriba indicada."],
                margin: [0,5],
                fontSize: 10,
                alignment: 'justify',
            },
            '',
            '',
            '',
            '',
            '',
        ],
    ];
    var bod = [
      [
        { colSpan:6,
          border: [true, true, true, true],
          text: 'DESCRIPCIÓN DEL PRESUPUESTO',
          bold: true,
          margin: [0,1],
          fillColor: '#ffff93',
          alignment: 'center',
          fontSize: 10,},
        '',
        '',
        '',
        '',
        '',
      ],
    ];
    var aux = [];
    aux = [
      {
        text:"UNIDAD",
        alignment:'left',
        fontSize: 10,
      },
      {
        text:"CANTIDAD",
        alignment:'left',
        fontSize: 10,
      },
      {
        colSpan:2,
        text:"DESCRIPCION",
        alignment:'left',
        fontSize: 10,
      },
      '',
      {
        text:"P.U.",
        alignment:'left',
        fontSize: 10,
      },
      {
        text:"IMPORTE",
        alignment:'left',
        fontSize: 10,
      },
    ];
    bod.push(aux);
    var total = 0;
    for(key in insumos_json){
        total += insumos_json[key].precio_cliente * insumos_json[key].cantidad;
        aux = [
          {
            text:insumos_json[key].unidad,
            alignment:'left',
            fontSize: 9,
          },
          {
            text:insumos_json[key].cantidad,
            alignment:'left',
            fontSize: 9,
          },
          {
            colSpan:2,
            text:insumos_json[key].descripcion,
            alignment:'left',
            fontSize: 9,
          },
          '',
          {
            text:formatMoney(insumos_json[key].precio_cliente),
            alignment:'right',
            fontSize: 9,
          },
          {
            text: formatMoney(insumos_json[key].cantidad * insumos_json[key].precio_cliente),
            alignment:'right',
            fontSize: 9,
          },
        ];
        bod.push(aux);
        console.log(insumos_json[key].precio_cliente);
        console.log(insumos_json[key].precio_lista);
    }

    var costo_directo = total;
    var costo_indirecto = (indirectos_bool?costo_directo*(porcentaje_indirecto*0.01):0);
    var subtotal=costo_directo+costo_indirecto;

    var bod_tot = [];
    if(indirectos_bool){
      bod_tot = [
          [
              {
                  colSpan:2,
                  border: [false, true, false, false],
                  text: '',
                  margin: [0,0],
                  alignment: 'center',
                  fontSize: 8,
              },
              '',
              {
                  colSpan:2,
                  border: [false, true, true, false],
                  text: 'Costo directo',
                  margin: [0,0],
                  alignment: 'right',
                  fontSize: 10,
              },
              '',
              {
                  colSpan:2,
                  border: [true, true, true, true],
                  text: formatMoney(costo_directo),
                  bold: true,
                  margin: [0,0],
                  alignment: 'right',
                  fontSize: 10,
              },
              '',
          ],
          [
              {
                  colSpan:2,
                  border: [false, false, false, false],
                  text: '',
                  margin: [0,0],
                  alignment: 'center',
                  fontSize: 8,
              },
              '',
              {
                  colSpan:2,
                  border: [false, false, true, false],
                  text: 'Costo indirecto',
                  margin: [0,0],
                  alignment: 'right',
                  fontSize: 10,
              },
              '',
              {
                  colSpan:2,
                  border: [true, true, true, true],
                  text: formatMoney(costo_indirecto),
                  bold: true,
                  margin: [0,0],
                  alignment: 'right',
                  fontSize: 10,
              },
              '',
          ],
        ];
    }

    var bod_tot_2 = [
        [
            {
                colSpan:2,
                border: [false, !indirectos_bool, false, false],
                text: '',
                margin: [0,0],
                alignment: 'center',
                fontSize: 8,
            },
            '',
            {
                colSpan:2,
                border: [false, !indirectos_bool, true, false],
                text: 'Subtotal',
                margin: [0,0],
                alignment: 'right',
                fontSize: 10,
            },
            '',
            {
                colSpan:2,
                border: [true, true, true, true],
                text: formatMoney(subtotal),
                bold: true,
                margin: [0,0],
                alignment: 'right',
                fontSize: 12,
            },
            '',
        ],
        [
            {
                colSpan:2,
                border: [false, false, false, false],
                text: '',
                margin: [0,0],
                alignment: 'center',
                fontSize: 8,
            },
            '',
            {
                colSpan:2,
                border: [false, false, true, false],
                text: 'I.V.A',
                margin: [0,0],
                alignment: 'right',
                fontSize: 10,
            },
            '',
            {
                colSpan:2,
                border: [true, true, true, true],
                text: formatMoney(subtotal*0.16),
                bold:true,
                margin: [0,0],
                alignment: 'right',
                fontSize: 12,
            },
            '',
        ],
        [
            {
                colSpan:2,
                border: [false, false, false, false],
                text: '',
                margin: [0,0],
                alignment: 'center',
                fontSize: 8,
            },
            '',
            {
                colSpan:2,
                border: [false, false, true, false],
                text: 'TOTAL',
                bold:true,
                margin: [0,0],
                alignment: 'right',
                fontSize: 10,
            },
            '',
            {
                colSpan:2,
                border: [true, true, true, true],
                text: formatMoney(subtotal*1.16),
                bold: true,
                margin: [0,0],
                alignment: 'right',
                fontSize: 14,
            },
            '',
        ],
    ];

    bod = bod.concat(bod_tot.concat(bod_tot_2));

    var bod_exc = exc_str == "NA" ? [[{colSpan: 6, border: [false, false, false, false], margin: [0,2], text: ""},'','','','','']] : [
        [
            {
                colSpan:6,
                border: [true, true, true, true],
                text: 'EXCLUSIONES',
                bold: true,
                margin: [0,2],
                fillColor: '#ffff93',
                alignment: 'center',
                fontSize: 10,
            },
            '',
            '',
            '',
            '',
            '',
        ],
        [
            {
                colSpan:6,
                border: [true, true, true, true],
                text: exc_str,
                margin: [0,5],
                fontSize:10,
            },
            '',
            '',
            '',
            '',
            '',
        ],
        [
            {
                colSpan: 6,
                border: [false, false, false, false],
                margin: [0,2],
                text: "",
            },
            '',
            '',
            '',
            '',
            '',
        ],
    ];

    var bod_req = reqs_str == "NA" ? [[{colSpan: 6, border: [false, false, false, false], margin: [0,2], text: ""},'','','','','']] : [
        [
            {
                colSpan: 6,
                border: [false, false, false, true],
                margin: [0,2],
                text: "",
            },
            '',
            '',
            '',
            '',
            '',
        ],
        [
            {   colSpan:6,
                border: [true, true, true, true],
                text: 'REQUERIMIENTOS ANTES DE INICIAR',
                bold: true,
                margin: [0,1],
                fillColor: '#ffff93',
                alignment: 'center',
                fontSize: 10,
            },
            '',
            '',
            '',
            '',
            '',
        ],
        [
            {
                colSpan:6,
                border: [true, true, true, true],
                text: reqs_str,
                margin: [0,5],
                fontSize:8,
            },
            '',
            '',
            '',
            '',
            '',
        ],
        [
            {
                colSpan: 6,
                border: [false, true, false, false],
                margin: [0,2],
                text: "",
            },
            '',
            '',
            '',
            '',
            '',
        ],
    ];
    var bod_tot_letra = [
      [
          {
              colSpan: 6,
              border: [false, false, false, true],
              margin: [0,2],
              text: "",
          },
          '',
          '',
          '',
          '',
          '',
      ],
      [
          {
              border: [true, true, true, true],
              text: 'IMPORTE CON IVA',
              margin: [0,2],
              fillColor: '#dddddd',
              alignment: 'center',
              fontSize: 8,
          },
          {
              colSpan:5,
              border: [true, true, true, true],
              text: numeroALetras((subtotal*1.16).toFixed(2)),
              bold: true,
              margin: [0,1],
              fillColor: '#dddddd',
              alignment: 'center',
              fontSize: 12,
          },
          '',
          '',
          '',
          '',
      ],
    ];

    var bod_condiciones = [
        [
            {
                colSpan:2,
                border: [false, false, false, false],
                text: '',
                margin: [0,5],
                alignment: 'center',
                fontSize: 8,
            },
            '',
            {
                colSpan:4,
                border: [false, false, false, false],
                text: 'Condiciones Comerciales: ',
                bold:true,
                margin: [0,10],
                alignment: 'left',
                fontSize: 10,
            },
            '',
            '',
            '',
        ],
        [
            {
                colSpan:6,
                border: [false, false, false, false],
                text: anticipo_str,
                margin: [0,3],
                alignment: 'center',
                fontSize: 10,
            },
            '',
            '',
            '',
            '',
            '',

        ],
        [
            {
                colSpan:6,
                border: [false, false, false, false],
                text: 'Precios incluyen IVA' + '\n' + 'Precios expresados en moneda nacional.',
                margin: [0,5],
                bold:true,
                alignment: 'left',
                fontSize: 8,
                //color :"#6FAFB4"
            },
            '',
            '',
            '',
            '',
            '',
        ],

        [
            {
                colSpan:6,
                border: [false, false, false, false],
                text: 'TIEMPO DE ENTREGA: ' + tiempoEntrega,
                bold: true,
                margin: [0,5],
                alignment: 'left',
                fontSize: 8,
            },
            '',
            '',
            '',
            '',
            '',
        ],
        [
            {
                colSpan:6,
                border: [false, false, false, false],
                text: 'El tiempo requerido para la elaboración de los trabajos anteriores es a partir de la fecha de recepción del anticipo y del 100% de los requerimientos solicitados.',
                margin: [0,3],
                alignment: 'left',
                fontSize: 8,
            },
            '','','','','',
        ],
        /*
        [
            {
                colSpan:6,
                border: [false, false, false, false],
                text: '' + "\n",
                margin: [0,2],
                alignment: 'left',
                fontSize: 10,
            },
            '',
            '',
            '',
            '',
            '',
        ],
        */
        [
            {
                colSpan:3,
                rowSpan:2,
                border: [false, false, false, false],
                text: 'Cliente',
                margin: [0,30],
                alignment: 'center',
                fontSize: 10,
                bold: true,
            },
            '',
            '',
            {
                colSpan:3,
                rowSpan:2,
                border: [false, false, false, false],
                text: 'Contratista',
                margin: [0,40],
                alignment: 'center',
                fontSize: 10,
                bold: true,
            },
            '',
            '',
        ],
        ['','','','','',''],
        [
            {
                colSpan:3,
                border: [false, false, false, false],
                text: '______________________________________',
                margin: [0,6],
                alignment: 'center',
                fontSize: 8,
            },
            '','',
            {
                colSpan:3,
                border: [false, false, false, false],
                text: '______________________________________',
                margin: [0,6],
                alignment: 'center',
                fontSize: 8,
            },
            '','',

        ],
        [
            {
                colSpan:3,
                border: [false, false, false, false],
                text: atn_str,
                margin: [0,3],
                alignment: 'center',
                fontSize: 10,
            },
            '','',
            {
                colSpan:3,
                border: [false, false, false, false],
                text: 'Arq. Miguel E. Bravo Dufau' +"\n" +"\n" +"\n" +"\n",
                margin: [0,3],
                alignment: 'center',
                fontSize: 10,
            },
            '','',
        ],
        iva_bool?[
            {
                colSpan:6,
                border: [false, false, false, false],
                text: 'Con base en el Decreto publicado en el D.O.F el pasado 26 de marzo de 2015 por el que se otorgan medidas de apoyo a la vivienda y otras medidas fiscales, sobre la contratación parcial para la construcción de Desarrollos Inmobiliarios de “casa habitación” exentos de IVA, únicamente se podrá facturar IVA EXENTO si cumple con lo siguiente:\n'
                    + '\t- El nombre del propietario debe ser el que aparece en la Licencia de Construcción y a ese mismo nombre se debe facturar.\n'
                    + '\t- El prestador del servicio debe proporcionar la mano de obra y materiales\n'
                    + '\t- El cliente debe realizar ante el SAT anualmente el formato 61\n'
                    + '\t- Expedir comprobantes fiscales que amparen únicamente los servicios parciales de construcción de inmuebles destinados a casa habitación, que contengan:\n'
                    + '\t\ta.    El domicilio del inmueble en el que se proporcionen los servicios parciales de construcción.\n'
                    + '\t\tb.    El número de permiso, licencia o autorización de construcción correspondiente que le haya proporcionado el prestador de los servicios parciales de construcción, el cual deberá coincidir con el señalado en la manifestación a que se refiere el Art. 9º Fracc II de la Ley del IVA y el Art. 29 del Reglamento del IVA.' + '\n' + '\n',
                margin: [0,3],
                alignment: 'left',
                fontSize: 8,
            },
            '','','','','',
        ]:[{colSpan: 6, border: [false, false, false, false], margin: [0,2], text: ""},'','','','',''],

        [
            {
                colSpan:3,
                border: [false, false, false, false],
                text: tituloB,
                bold: true,
                margin: [0,3],
                alignment: 'center',
                fontSize: 8,
            },
            '','',
            {
                colSpan:3,
                border: [false, false, false, false],
                text: tituloF,
                bold: true,
                margin: [0,3],
                alignment: 'center',
                fontSize: 8,
            },
            '',
            '',
        ],
        [
            {
                colSpan:1,
                border: [false, false, false, false],
                text: terminosBancarios,
                margin: [0,2],
                alignment: 'left',
                fontSize: 7,
            },
            {
                colSpan:2,
                border: [false, false, false, false],
                text: bancarios,
                margin: [0,2],
                alignment: 'left',
                fontSize: 7,
            },
            '',
            {
                colSpan:1,
                border: [false, false, false, false],
                text: terminosFiscales,
                margin: [0,2],
                alignment: 'left',
                fontSize: 7,
            },
            {
                colSpan:2,
                border: [false, false, false, false],
                text: fiscales,
                margin: [0,2],
                alignment: 'left',
                fontSize: 7,
            },
            '',
        ],
    ];

    var cont =  [
        //Header
        {
            table:{
                widths: ['*', 120, '*', '*','*',120],
                body: bod_head,
            },
        },
        //Exclusiones
        {
            table:{
                widths: ['*', 120, '*', '*','*',120],
                body: bod_exc,
            },
            unbreakable:true,
        },
        //Insumos
        {
            table:{
                widths: ['auto', 'auto', '*', 'auto','auto','auto'],
                body: bod,
            },
        },
        //Totales
        /*
        {
            table:{
                widths: ['*', 120, '*', '*','*',120],
                body:bod_tot,
                unbreakable: true,
            },
        },
        */
        //Letra
        {
            table:{
                widths: ['*', 120, '*', '*','*',120],
                body:bod_tot_letra,
            },
            unbreakable: true,
        },
        //Reqs
        {
            table:{
                widths: ['*', 120, '*', '*','*',120],
                body: bod_req,
            },
            unbreakable: true,
        },

        //Condiciones Comerciales
        {
            table:{
                widths: ['*', 120, '*', '*','*',120],
                body:bod_condiciones,
            },
            unbreakable:true,
        },
    ];

    var imagenes_tabla = [];
    // imagenes_evidencia = [logo.image];
    var aux={};
    for(i=0;i<imagenes_evidencia.length;i++){
        // console.log(imagenes_evidencia[i]);
         aux = {
           image: imagenes_evidencia[i],
           alignment: 'center',
           width: 520.00,
           border: [false, false, false, false],
        };
        imagenes_tabla.push([aux]);
    };

    cont.push(
        {
            table:{
                widths: ['*'],
                body: imagenes_tabla,
                unbreakable: true,
            },
        }
    );


    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var fecha = fecha_ppto.toLocaleDateString("es-MX",options);
    fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    fecha = "\n" + fecha + "\n"+ "CDMX";

    var pdfPresupuesto = {
        pageSize: 'LETTER',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 40, 102, 40, 40],
        footer: function(currentPage,pageCount) {
            return { fontSize:8,alignment: 'center', text:'Av. Constituyentes 561 Int. 101a, Col. América, Miguel Hidalgo, Ciudad de México, C.P. 11820, Tel. 6273 7900.       Página ' + currentPage.toString() + " de " + pageCount};
        },
        header:function(currentPage, pageCount) {
            return{
                columns: [
                    logo,
                    {
                        text: fecha ,
                        fontSize: 8,
                        alignment: 'right',
                    },
                ],
                margin: [40, 20],
            };
        },
        content: cont,
    };
    return pdfPresupuesto;
}
