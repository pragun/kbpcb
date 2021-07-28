const fs = require('fs');
const path = require('path');
const util = require('util');
const formidable = require('formidable')

require('./src/id');

const parseLayout = require('./src/layout');
const genSchematics = require('./src/schematics');
const genKiCad = require('./src/kicad');

const { addFolder, makeZip, makeZipFile } = require('./src/zip');

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('build <input_file> <output_file>', 'Create KiCAD Project from Keyboard Layout', {}, (argv) => {
        const name = path.basename(argv.input_file,'.json');
        console.log('Name ',name);
        console.log('Processing file:',argv.input_file);
        const options = {
            leds: false,
            x: 20,
            y: 20,
            optimize_matrix: true,
          };

        const kicad = genKiCad( fs.readFileSync(argv.input_file, 'utf8'), options);
        const zipFiles = [
                [`${name}.pro`, fs.readFileSync('templates/project.pro')],
                [`${name}.sch`, kicad[0]],
                [`${name}.kicad_pcb`, kicad[1]],
                [`sym-lib-table`, fs.readFileSync('templates/sym-lib-table')],
                [`fp-lib-table`, fs.readFileSync('templates/fp-lib-table')],
            ];

        addFolder(zipFiles, 'libraries/kicad_lib_tmk');
        addFolder(zipFiles, 'libraries/keyboard_parts.pretty');
        addFolder(zipFiles, 'libraries/MX_Alps_Hybrid.pretty');
        zip = makeZipFile(argv.output_file, zipFiles);
    })
    .demandCommand()
    .help()
    .argv;

