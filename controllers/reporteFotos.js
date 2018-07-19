
const fs = require('fs');
const handlebars = require('handlebars');
const pdf = require('html-pdf');


module.exports = {
  pdfImagenes: async (req, res, next) => {
    let id = req.params.id;
    let filename = id + '_' + new Date().getTime() + '.pdf';
    let archivos = [{
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216449041.jpg',
      txt: 'Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo Hola mundo'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216417243.jpg',
      txt: 'Hola mundo'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216426992.jpg',
      txt: 'hola mundo'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216440402.jpg',
      txt: 'abc'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216449041.jpg',
      txt: 'Hola mundo'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216417243.jpg',
      txt: 'Hola mundo'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216426992.jpg',
      txt: 'hola mundo'
    },
    {
      img: 'https://sytesafs.blob.core.windows.net/rutina515/1530216440402.jpg',
      txt: 'abc'
    }
    ];
    let logo = base64_encode('public/img/logo-pdf.png');
    var data = {
      logo: logo,
      empresa: 'Soluciones y Tratamiento Ecológico SA PI de CV',
      contacto: 'Luis Antonio Rodas Romero',
      correo: 'callcenter@systema.com',
      telefono: '018000502020',
      tipoReporte: 'Supervisión',
      planta: 'BA Ayotla',
      fotos: archivos,
      title: 'practical node.js',
      author: '@azat_co'
    }
    data.body = process.argv[2];

    fs.readFile('views/pdf-foto.html', 'utf-8', function (error, source) {
      var template = handlebars.compile(source);
      var html = template(data);
      // res.send(html);
      var options = {

        'format': 'Letter', // allowed units: A3, A4, A5, Legal, Letter, Tabloid

        // Page options
        'border': {
          'top': '1cm', // default is 0, units: mm, cm, in, px
          'right': '2cm',
          'bottom': '1cm',
          'left': '2cm'
        },
        'header': {
          'height': '45mm',
          'contents': `
            <table>
            <tr>
              <td width="20%">
                <img src="data:image/png;base64,${logo}" alt="Systesa" style="width: 100%;">
              </td>
              <td width="55%">
                <table>
                  <tr>
                    <td>Contacto:</td>
                    <td>${data.contacto}</td>
                  </tr>
                  <tr>
                    <td>Empresa:</td>
                    <td>${data.empresa}</td>
                  </tr>
                  <tr>
                    <td>Teléfono:</td>
                    <td>${data.telefono}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>${data.correo}</td>
                  </tr>
                </table>
              </td>
              <td width="25%">
                <table>
                  <tr>
                    <td>Tipo de reporte:</td>
                    <td>${data.tipoReporte}</td>
                  </tr>
                  <tr>
                    <td>PTAR:</td>
                    <td>${data.planta}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <hr style="height:2px;border:none;color:#333;background-color:#333;">
          `
        },
        'footer': {
          'height': '28mm',
          'contents': {
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          }
        },

      }

      pdf.create(html, options).toBuffer(function (err, buffer) {
        res.contentType("application/pdf");
        res.send(buffer);
      });
      /* pdf.create(html, options).toFile('./businesscard.pdf', function (err, respuesta) {
        if (err) return console.log(err);
        console.log(respuesta); // { filename: '/app/businesscard.pdf' }
        res.send(html);
      }); */
    });
  }
}


function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}
