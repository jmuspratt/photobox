const scanLibrary = require('../../scanLibrary.js');

module.exports = function() {
    const lib = scanLibrary('src/album-assets/');
    return lib;
};