require('dotenv').config()
const readline = require('readline');

const students = require('./students.json')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const { format } = require('date-fns')
const nodemailer = require('nodemailer')

const pathToCalibri = './Calibri Regular.ttf'
const pathToCalibriBold = './Calibri Bold.ttf'
const pathToCalibriItalic = './Calibri Italic.ttf'


// numeros correlativos para las facturas (hay q modificarlo después para poner en interfaz)
let lastNumber = 1786

students.forEach((student, index) => {

   //incrementar nro de factura +1
    lastNumber++

    // Crear PDF
    const doc = new PDFDocument();

    // Nombre del PDF
    const fileName = `${student.ALUMNO}_20230${lastNumber}.pdf`

    //  fecha actual y formateo
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy')

    // flujo de escritura para guardar el PDF 
    const writeStream = fs.createWriteStream(fileName);

    // flujo de escritura al documento PDF
    doc.pipe(writeStream);

    // todo lo q es contenido del pdf
    doc.image('./logo.jpg', 50, 50, { width: 200, height: 90 })


    // Info debajo del logo
    doc.font(pathToCalibri).fillColor('gray').fontSize(10).text('www.oposicionesarquitectos.com', 70, 160)
    doc.font('Calibri').fillColor('blue').fontSize(9).text('info@oposicionesarquitectos.com', 70, 175, { link: 'mailto:info@oposicionesarquitectos.com', underline: true })
    

    // Info academia
    const rightColumnX = 350
    const rightColumnY = 100
    const rightColumnWidth = 200
    const rightColumnHeight = 20
  
    doc.font(pathToCalibriBold).fontSize(12).fillColor('black').text('OPOSICIONES ARQUITECTOS', rightColumnX, rightColumnY, { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 10 })
    doc.font(pathToCalibri).fontSize(11).fillColor('gray').text('CIF: B01983758', { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 5 })
    doc.font(pathToCalibri).fontSize(11).fillColor('gray').text('C/. Molino de la Navata, 59', { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 5 })
    doc.font(pathToCalibri).fontSize(11).fillColor('gray').text('28260 - Galapagar - Madrid', { align: 'right', width: rightColumnWidth, height: rightColumnHeight, lineGap: 5 })
    
    // Línea separadora
    doc.moveTo(50, 200).lineTo(550, 200).stroke()
    


    // Datos del alumno, nro factura...
    doc.font(pathToCalibriBold).fontSize(13).fillColor('black').text(` ${student.ALUMNO}`, 50, 220)
    doc.font(pathToCalibri).fontSize(11).fillColor('gray').text(`NIF: ${student.DNI}`, 70, 245)
    doc.font(pathToCalibriBold).fontSize(12).fillColor('black').text(`Num. Factura:  20230${lastNumber}`,400, 245 )
    doc.font(pathToCalibri).fontSize(11).fillColor('gray').text(`${student.DIRECCION}`, 70, 265)
    doc.font(pathToCalibriBold).fontSize(12).fillColor('black').text(`Fecha:  ${formattedDate}`, 400, 265)
    doc.font(pathToCalibri).fontSize(11).fillColor('gray').text(`${student.CODIGOPOSTAL} - ${student.CIUDAD} - ${student.PROVINCIA}`, 70, 285)

    // Concepto (palabra)
    doc.font(pathToCalibriBold).fontSize(12).fillColor('black').text('Concepto', 50, 320)

    // Línea separadora
    doc.moveTo(50, 340).lineTo(550, 340).stroke()

    // Descripción y curso (es el concepto)
   doc.font(pathToCalibri).fontSize(10).fillColor('gray').text(`${student.DESCRIPCION} ${student.CURSO}`, 50, 350)


    // Base imponible
    doc.font(pathToCalibriBold).fontSize(13).fillColor('black').text(`Base imponible          ${student['TOTAL A PAGAR']}`, 340, 460, { align: 'right' })
  

    // IVA
    doc.font(pathToCalibriBold).fontSize(13).fillColor('black').text('IVA (0%)            - €', 340, 480, { align: 'right' })

    // Línea separadora doble
    doc.moveTo(50, 510).lineTo(550, 510).stroke()
    doc.moveTo(50, 514).lineTo(550, 514).stroke()

    // Total a pagar
    doc.font(pathToCalibriBold).fontSize(16).fillColor('black').text(`Total (Euro)     ${student['TOTAL A PAGAR']} €`, 340, 530, { align: 'right'})
 

    // Pie de página
    doc.font(pathToCalibriItalic).fontSize(9).fillColor('gray').text(`"Enseñanza exenta de IVA Artículo 20 Uno 9º de la Ley 37/1992 de 28 de DICIEMBRE del Impuesto sobre el Valor Añadido"`, 50, 570, {align: 'center'} )
    doc.font(pathToCalibriItalic).fontSize(9).fillColor('gray').text("625 47 47 77 - info@oposicionesarquitectos.com www.oposicionesarquitectos.com",90,595, {align: 'center'} )
    doc.font(pathToCalibriItalic).fontSize(9).fillColor('gray').text("OPOSICIONES ARQUITECTOS - C/. Molino de la Navata, 59 28260 - Galapagar - Madrid", 85, 615, {align: 'center'})
   
    // texto final protección de datos, etc.
    const texto = "De acuerdo con lo establecido en el Reglamento (UE) 2016/679 de Protección de Datos de Carácter Personal (RGPD) procedemos a informarles que los datos personales que Ud. nos facilite serán tratados en nuestros sistemas de información con la finalidad de llevar a cabo la gestión interna del cliente. Todos o parte de los datos aportados serán comunicados a las administraciones públicas competentes. El titular de los datos se compromete a comunicar por escrito a OPOSICIONES ARQUITECTOS, S.L. cualquier modificación que se produzca en los datos aportados. usted podrá en cualquier momento ejercer sus derechos de acceso, rectificación, cancelación, oposición, limitación y portabilidad de datos en los términos establecidos en el RGPD mediante notificación escrita, adjuntando copia de su DNI o tarjeta identificativa, a OPOSICIONES ARQUITECTOS, S.L., con domicilio en Calle Molino de la Navata, 59 28260 Galapagar, o a nuestro correo info@oposicionesarquitectos.com Usted puede consultar nuestra política de Protección de Datos en www.oposicionesarquitectos.com";

    const textoSinSaltosDeLinea = texto.replace(/\n/g, '')
    
    doc.font(pathToCalibriItalic).fontSize(7).fillColor('black').text(textoSinSaltosDeLinea, 70, 655 ,{
      align: 'justify',
      width: 450,
      height: 300,
      lineGap: 3.5,
      indent: 10,
      ellipsis: true
    })
    

    
    // Finalizar elPDF
    doc.end()

    console.log(`Factura generada para ${student.ALUMNO}.`)

    // Registrar evento
    writeStream.on('finish', () => {
        console.log(`Factura guardada en el archivo: ${fileName}`);
    });

    writeStream.on('error', (error) => {
        console.error(`Error al guardar el archivo PDF: ${error}`)
    });
});

//ACÁ PARA ENVIAR TODOS LOS CORREOS


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'oposicionesarquitectosmadrid@gmail.com',
      pass: process.env.PASSWORD,
  },
  tls: {
      rejectUnauthorized: false,
  },
});

let lastNumberEmail = 1786;

const { es } = require('date-fns/locale');

// Obtener la fecha actual
const currentDate = new Date();

// Configurar en español para el formato de fecha
const esLocale = es;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  //para enviar el correo
  async function sendEmail(student) {

    const invoice = `${student.ALUMNO}_20230${lastNumberEmail}.pdf`;
    const recipient = student.EMAIL;
    const subject = 'Factura Oposiciones Arquitectos';
    const body = `Estimado/a ${student.ALUMNO}, adjunto encontrarás la factura correspondiente a ${format(currentDate, 'MMMM', { locale: esLocale })} de ${format(currentDate, 'yyyy')}.
  Un saludo`;
    const mailOptions = {
      from: 'Gestión académica Oposiciones Arquitectos <info@oposicionesarquitectos.com>',
      to: recipient,
      subject: subject,
      text: body,
      attachments: [
        {
          filename: invoice,
          path: `./${invoice}`,
        },
      ],
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(`Error al enviar el correo electrónico a: ${student.EMAIL}, ${student.ALUMNO}, factura Nro ${lastNumberEmail}`, err);
          reject(err);
        } else {
          console.log(`Correo electrónico enviado a: ${student.EMAIL} , ${student.ALUMNO}`, info.response);
          resolve();
        }
      });
    });
  }
  
  async function sendEmails() {
    for (const student of students) {
      lastNumberEmail++;
  
      if (student.ENVIAR === 'SI') {
        try {
          await sendEmail(student);
          await delay(20000); // Retardo de 20 segundos antes de enviar el siguiente correo
        } catch (error) {
          
        }
      }
    }
  }
  
  sendEmails();
  

const XLSX = require('xlsx');

//crear nueva hoja de cálculo
const workbook = XLSX.utils.book_new();


const worksheet = XLSX.utils.json_to_sheet([]);

// encabezados excel
const headers = ['Factura', 'Fecha', 'Cliente', 'Importe Neto', 'IVA', 'Importe Bruto'];
const headerRow = XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

let rowIndex = 2; // La primera fila se usa para los encabezados

let lastNumberList = 1786

students.forEach((student, index) => {

 lastNumberList++;

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'MM/dd/yyyy');
  const importeNeto = student['TOTAL A PAGAR'];
  const importeBruto = student['TOTAL A PAGAR'];

  const rowData = [`20230${lastNumberList}`, formattedDate, student.ALUMNO, importeNeto, '  -  €', importeBruto];
  const row = XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${rowIndex}` });
  rowIndex++;
});

// Agregar la hoja al libro de trabajo
XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');

// Guardar comoa rchivo excel
const excelFileName = 'facturas.xlsx';
XLSX.writeFile(workbook, excelFileName);

console.log(`Archivo Excel generado: ${excelFileName}`);

const excelMailOptions = {
    from: 'Gestión académica Oposiciones Arquitectos <info@oposicionesarquitectos.com>',
    to: 'ealvaro@oposicionesarquitectos.com',
    // to: "gmotto.oposicionesarquitectos@gmail.com",
    subject: 'LISTA',
    text: 'Adjunto lista de facturas',
    attachments: [
      {
        filename: excelFileName,
        path: `./${excelFileName}`
      }
    ]
  };
  
  transporter.sendMail(excelMailOptions, (err, info) => {
    if (err) {
      console.error('Error al enviar el archivo Excel por correo electrónico:', err);
    } else {
      console.log('Archivo Excel enviado por correo electrónico:', info.response);
    }
  });


 