const students = require('./students.json')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const { format } = require('date-fns')


// ejemplo números correlativos para las facturas
let lastNumber = 12

students.forEach((student, index) => {

   //incrementa en 1 el nro de factura cada vez q hace una durante el bucle
    lastNumber++

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Definir el nombre del archivo PDF con nombre de alumno y nro de factura
    const fileName = `factura_${lastNumber}_${student.ALUMNO.replace(/ /g, '_')}.pdf`

    //  fecha actual y formateo
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy');

    // flujo de escritura para guardar el PDF en disco
    const writeStream = fs.createWriteStream(fileName);

    // flujo de escritura al documento PDF
    doc.pipe(writeStream);

    // todo lo q es contenido del pdf
    doc.image('./logo.jpg', 50, 50, { width: 200, height: 90 });


    // Info debajo del logo
    doc.fontSize(10).text('www.oposicionesarquitectos.com', 70, 160);
    doc.fillColor('blue').fontSize(10).text('info@oposicionesarquitectos.com', 70, 175, { link: 'mailto:info@oposicionesarquitectos.com', underline: true });
    

    // Info academia
    const rightColumnX = 350;
    const rightColumnY = 100;
    const rightColumnWidth = 200;
    const rightColumnHeight = 20;
  
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black').text('OPOSICIONES ARQUITECTOS', rightColumnX, rightColumnY, { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 10 });
    doc.font('Helvetica').fontSize(10).fillColor('black').text('CIF: B01983758', { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 5 });
    doc.font('Helvetica').fontSize(10).fillColor('black').text('C/. Molino de la Navata, 59', { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 5 });
    doc.font('Helvetica').fontSize(10).fillColor('black').text('28260 - Galapagar - Madrid', { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 5 });
    
    // Línea separadora
    doc.moveTo(50, 200).lineTo(550, 200).stroke();
    


    // Datos del alumno
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black').text(` ${student.ALUMNO}`, 50, 220);
    doc.font('Helvetica').fontSize(10).fillColor('black').text(`NIF: ${student.DNI}`, 70, 245);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('black').text(`Num. Factura: ${lastNumber}`,400, 245 )
    doc.font('Helvetica').fontSize(10).fillColor('black').text(`${student.DIRECCION}`, 70, 265);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('black').text(`Fecha: ${formattedDate}`, 400, 265);
    doc.font('Helvetica').fontSize(10).fillColor('black').text(`${student.CODIGOPOSTAL} - ${student.CIUDAD} - ${student.PROVINCIA}`, 70, 285);

    // Concepto (palabra)
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black').text('Concepto', 50, 320);

    // Línea separadora
    doc.moveTo(50, 340).lineTo(550, 340).stroke();

    // Descripción y curso (es el concepto)
   doc.font('Helvetica').fontSize(10).fillColor('black').text(`${student.DESCRIPCION} - ${student.CURSO}`, 50, 350);


    // Base imponible
    doc.font('Helvetica-Bold').fontSize(10).fillColor('black').text(`Base imponible     ${student['TOTAL A PAGAR']}`, 360, 480, { align: 'right' });
  

    // IVA
    doc.font('Helvetica-Bold').fontSize(10).fillColor('black').text('IVA (0%)       - €', 340, 500, { align: 'right' });

    // Línea separadora doble
    doc.moveTo(50, 517).lineTo(550, 517).stroke();
    doc.moveTo(50, 520).lineTo(550, 520).stroke();

    // Total a pagar
    doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text(`Total (Euro)     ${student['TOTAL A PAGAR']}`, 340, 530, { align: 'right'});
 

    // Pie de página
    doc.font('Helvetica').fontSize(8).fillColor('gray').text(`"Enseñanza exenta de IVA Artículo 20 Uno 9o de la Ley 37/1992 de 28 de DICIEMBRE del Impuesto sobre el Valor Añadido"`, 50, 570, {align: 'center'} )
    doc.font('Helvetica').fontSize(8).fillColor('gray').text("625 47 47 77 - info@oposicionesarquitectos.com www.oposicionesarquitectos.com",100,590, {align: 'center'} )
    doc.font('Helvetica').fontSize(8).fillColor('gray').text("OPOSICIONES ARQUITECTOS - C/. Molino de la Navata, 59 28260 - Galapagar - Madrid", 100, 610, {align: 'center'})
   
    // texto final protección de datos, etc.
    const texto = "De acuerdo con lo establecido en el Reglamento (UE) 2016/679 de Protección de Datos de Carácter Personal (RGPD) procedemos a informarles que los datos personales que Ud. nos facilite serán tratados en nuestros sistemas de información con la finalidad de llevar a cabo la gestión interna del cliente. Todos o parte de los datos aportados serán comunicados a las administraciones públicas competentes. El titular de los datos se compromete a comunicar por escrito a OPOSICIONES ARQUITECTOS, S.L. cualquier modificación que se produzca en los datos aportados. usted podrá en cualquier momento ejercer sus derechos de acceso, rectificación, cancelación, oposición, limitación y portabilidad de datos en los términos establecidos en el RGPD mediante notificación escrita, adjuntando copia de su DNI o tarjeta identificativa, a OPOSICIONES ARQUITECTOS, S.L., con domicilio en Calle Molino de la Navata, 59 28260 Galapagar, o a nuestro correo info@oposicionesarquitectos.com Usted puede consultar nuestra política de Protección de Datos en www.oposicionesarquitectos.com";

    const textoSinSaltosDeLinea = texto.replace(/\n/g, '');
    
    doc.font('Helvetica').fontSize(7).fillColor('black').text(textoSinSaltosDeLinea, 70, 645 ,{
      align: 'justify',
      width: 450,
      height: 300,
      lineGap: 5,
      indent: 50,
      ellipsis: true
    });
    
    // Finalizar el documento PDF
    doc.end();

    console.log(`Factura generada para ${student.ALUMNO}.`);

    // Registrar eventos para manejar el finalizado de la escritura del PDF
    writeStream.on('finish', () => {
        console.log(`Factura guardada en el archivo: ${fileName}`);
    });

    writeStream.on('error', (error) => {
        console.error(`Error al guardar el archivo PDF: ${error}`);
    });
});