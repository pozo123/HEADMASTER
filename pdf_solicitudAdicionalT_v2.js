function generaSolicitudTerminada(imagenes_evidencia){
    var imagenes_tabla = [];
    var aux={};
    for(i=0;i<imagenes_evidencia.length;i++){
         aux = {
           image: imagenes_evidencia[i].url,
           alignment: 'center',
           width: 530.00,
           border: [false, false, false, false],
        };
        imagenes_tabla.push([aux]);
    };

    var contenido =  [
        //Imagenes
        {
            style: 'tableBody',
            table:{
                widths: ['*'],
                body: imagenes_tabla,
                unbreakable: true,
            },
            fontSize: 10,
        },
    ];

    var pdfSolicitudTerminada = {
        pageSize: 'LETTER',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 20, 20, 20, 20],
        content: contenido,
        styles: {
      		header: {
      			fontSize: 18,
      			bold: true,
      			margin: [0, 0, 0, 10]
      		},
      		subheader: {
      			fontSize: 16,
      			bold: true,
      			margin: [0, 10, 0, 5]
      		},
      		tableBody: {
      			margin: [0, 0, 0, 15]
      		},
      	},
    };
    return pdfSolicitudTerminada;
}
