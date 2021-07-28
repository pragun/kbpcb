const fs = require('fs');
const JSZip = require('jszip');

const addFolder = (files, folder) => {
  fs.readdirSync(`${folder}`).forEach(file => {
    const fileName = `${folder}/${file}`;
    if (fs.lstatSync(`${fileName}`).isDirectory()) {
      addFolder(files, fileName);
    } else {
      files.push([fileName, fs.readFileSync(`${fileName}`, 'utf8')]);
    }
  });
}

const makeZip = (res, files) => {
  const zip = new JSZip();
  files.forEach(f => zip.file(f[0], f[1]));
  zip
    .generateNodeStream({streamFiles:true})
    .pipe(res)
    .on('finish', function () {
      res.end();
    });
};


const makeZipFile = (fname, files) => {
  const zip = new JSZip();
  files.forEach(f => zip.file(f[0], f[1]));
  zip
    .generateNodeStream({streamFiles:true})
    .pipe(fs.createWriteStream(fname))
    .on('finish', function () {
      console.log(fname + " written.");
    });
};

module.exports = { addFolder, makeZip, makeZipFile};
