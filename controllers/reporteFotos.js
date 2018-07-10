var request = require('request');
const fs = require('fs');
const handlebars = require('handlebars');
const async = require('async');
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
          'contents': '<div style="text-align: center;">Author: Marc Bachmann</div>'
        },
        'footer': {
          'height': '28mm',
          'contents': {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
          }
        },

      }

      /* pdf.create(html, options).toBuffer(function (err, buffer) {
        res.contentType("application/pdf");
        res.send(buffer);
      }); */
      pdf.create(html, options).toFile('./businesscard.pdf', function (err, respuesta) {
        if (err) return console.log(err);
        console.log(respuesta); // { filename: '/app/businesscard.pdf' }
        res.send(html);
      });
    });
  }
}


function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}