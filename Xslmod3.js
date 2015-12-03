module.exports = function () {
var fs = require('fs');
var xmldoc = require('xmldoc');
var file = 'rasp_schema.xml';
var mkdirp = require('mkdirp');
var xml = [];
var sdir = './seed_schemas';
var hdir = './iControl_REST_API_Reference';

mkdirp(sdir, function (err) {
	if (err) {console.log('could not make directory');}
	fs.readFile(file, function (err, xml) {
        if (err) throw err;
        var document = new xmldoc.XmlDocument(xml);
        var kmd = (document.descendantWithPath('children')).childrenNamed('mode');
        var cmd = (document.descendantWithPath('children')).childrenNamed('cli_cmd_mode');
        var len = kmd.length;
        var clen = cmd.length;
        for (i=0; i<len; i++) {
	        var fnm = kmd[i].childNamed('name').val;
            fs.writeFile(sdir + '/' + fnm + '.xml', kmd[i], function (err) {
                if (err) throw err;
            });
			console.log('Module XML: ' + fnm);
        }
        for (j=0; j<clen; j++) {
	        var fnm = cmd[j].childNamed('name').val;
	        fs.writeFile('./seed_schemas/' + fnm + '.xml', cmd[j], function (err) {
                if (err) throw err;
            });
			console.log('Module XML: ' + fnm);
        } 
    });
});

mkdirp(hdir, function (err) {
	if (err) {console.log('could not make directory');}
});

};                   
                 