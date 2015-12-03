module.exports = function () {
var fs = require('fs');
var rimraf = require('rimraf'); 
var NDR = 5;

//var wx = ['all', 'all', 'analytics', 'apm', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'ltm', 'net', 'pem', 'security', 'sys', 'util', 'vcmp', 'wam', 'wom'];
var wx = ['all', 'all', 'analytics', 'apm', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'ltm', 'net', 'pem', 'security', 'sys', 'util', 'vcmp', 'wam', 'wom'];
var Ln = wx.length; 

for (var m = 2; m < Ln; m++) {
    var mod = wx[m];
	
    function mkpf(mod, NDR, cb) {
  	    var fs = require('fs');
        var mkdirp = require('mkdirp');
	    var pcsf = './' + mod + '_schema_files';
	    var pssf = './' + mod + '_process_schema_files';
        mkdirp.sync(pcsf);
        mkdirp.sync(pssf);	
	    var data = fs.readFileSync('./seed_schemas/' + mod + '.xml', 'utf8');
	    fs.writeFileSync(pcsf + '/' + mod + '.xml', data, 'utf8');
	    fs.writeFileSync(pssf + '/' + mod + '.xml', data,  'utf8');   	
        cb();	
    }

    function mvSD(mod, NDR, cb) {
        var fs = require('fs');	
        var FDR = NDR-1;
        var pscdir = './' + mod + '_process_schema_files/' + mod + '_schema_files_' + FDR;
        var np_pscdir = './' + mod + '_process_schema_files/np_' + mod + '_schema_files_' + FDR;
        var tardir = './' + mod + '_schema_files/' + mod + '_schema_files';
        var np_tardir = './' + mod + '_schema_files/np_' + mod + '_schema_files';
        var tar = './' + mod + '_schema_files/' + mod + '.xml';
 
        fs.rename(pscdir, tardir, function (err) {
            if (err) {throw err;}
//    	    console.log('Move final schema files dir');
	    });
	
	    fs.rename(np_pscdir, np_tardir, function (err) {
            if (err) {throw err;}
//    	    console.log('Move final np schema files dir');
	    });

// remove process files dir				
		rimraf('./' + mod + '_process_schema_files', function(err) {
			if (err) { throw err; }
			// done
		});	
		console.log('Junk XML: ' + mod); 
	    cb();
    }

    function doall(cb) {
//	    console.log('\nProcessing schema-topic files.');
	    cb();
    }		

    function logComplete(mod) {
        console.log('Topic XML: ' + mod);
    }

    function colSD(mod, NDR, cb) {
        var xmldoc = require('xmldoc');
        var fs = require('fs');
        var diveSync = require("diveSync");
        var mkdirp = require('mkdirp');
        var shmdir = './' + mod + '_schema_files/';
        mkdirp.sync(shmdir);

        for (rep=0; rep<NDR; rep++) {
    	    var newdir = './' + mod + '_process_schema_files/' + mod + '_schema_files_' + rep;
    	    var np_newdir = './' + mod + '_process_schema_files/np_' + mod + '_schema_files_' + rep;
    	    mkdirp.sync(newdir);
    	    mkdirp.sync(np_newdir);
		
            diveSync(mod + '_process_schema_files', {recursive: true}, function(err, file) {
                if (err) {console.log(err);}
                var xml = fs.readFileSync(file, {encoding: 'utf-8'});
                var document = new xmldoc.XmlDocument(xml);
                var endp = document.childrenNamed('path');
                var typ = document.childNamed('type').val;
                var chd = false;

                if ((typ=='command')||(typ=='association')) {
                    if (document.descendantWithPath('cli_cmd.children')) {chd = true;}
                    if (chd) {
                        var ka = (document.descendantWithPath('cli_cmd.children')).childrenNamed('keyword');
                        var asa = (document.descendantWithPath('cli_cmd.children')).childrenNamed('association');
                        var aa = (document.descendantWithPath('cli_cmd.children')).childrenNamed('association_list');
                        var pa = (document.descendantWithPath('cli_cmd.children')).childrenNamed('property');
                    }

                    if (!chd) {
      	                var ka = [];
    	                var asa = [];
    	                var aa = [];
    	                var pa = []
                    }
                }   

                if (typ=='mode') {
                    var ka = (document.descendantWithPath('cli_cmd_mode.children')).childrenNamed('command');
                    var asa =(document.descendantWithPath('cli_cmd_mode.children')).childrenNamed('mode');
                    var aa = [];
                    var pa = [];
                }

                if (typ=='cli_cmd_mode') {
                    var ka = (document.descendantWithPath('children')).childrenNamed('command');
                    var asa =(document.descendantWithPath('children')).childrenNamed('mode');
                    var aa = [];
                    var pa = [];
                }

                if (typ=='property') {
                    var ka = (document.descendantWithPath('children')).childrenNamed('keyword');
                    var asa = (document.descendantWithPath('children')).childrenNamed('association');
                    var aa = (document.descendantWithPath('children')).childrenNamed('association_list');
                    var pa = (document.descendantWithPath('children')).childrenNamed('property');
                }

                var fn = document.childNamed('path').val;
                fn = fn.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
                var i = 0;
                var len = ka.length; 
                var n = [len];
                var p = [len];  
                var test = false;

                if (len >= 1) {
                    for (i=0; i<len; i++) {
                        if (ka[i]) {
                            n[i] = ka[i].childNamed('name').val;
                            p[i] = 0;
                            if (ka[i].childNamed('public')) {
                                p[i] = ka[i].childNamed('public').val;
       	                        if (p[i]>0) {fs.writeFileSync(newdir + '/' + fn + '_' + n[i] + '.xml', ka[i]);} 
                            }		  
                            if ((!(p[i]>0))&&(typ=='command')) {test = ka[i].childNamed('children');}
                            if (test) {fs.writeFileSync(np_newdir + '/np_' + fn + '_' + n[i] + '.xml', ka[i])}
                        }
                    }
                }

                i=0;
                var asalen = asa.length; // Number of associations
                n = [asalen];
                p = [asalen];  
                test = false;

                if (asalen >= 1) {
                    for (i=0; i<asalen; i++) {
                        if (asa[i]) {
                            n[i] = asa[i].childNamed('name').val;
                            p[i] = 0;
                            if (asa[i].childNamed('public')) {
                                p[i] = asa[i].childNamed('public').val;
           	                    if (p[i]>0) {fs.writeFileSync(newdir + '/'  + fn + '_' + n[i] + '.xml', asa[i]);} 
                            }		  
                            if ((!(p[i]>0))&&((typ=='command')||(typ=='association')||(typ=='association_list')||(typ=='property'))) {
						        test = ((asa[i].childNamed('children')) || (asa[i].descendantWithPath('cli_cmd').childNamed('children')));
       		                }
                            if (test && (!(p[i]>0))) {fs.writeFileSync(np_newdir + '/np_' + fn + '_' + n[i] + '.xml', asa[i])}
                        }
                    }
                }

                i=0;
                var aalen = aa.length; 
                var n = [aalen];
                p = [aalen];  
                test = false;

                if (aalen >= 1) {
                    for (i=0; i<aalen; i++) {
                        if (aa[i]) {
                            n[i] = aa[i].childNamed('name').val;
                            p[i] = 0;
                            if (aa[i].childNamed('public')) {
                                p[i] = aa[i].childNamed('public').val;
    	                        if (p[i]>0) {fs.writeFileSync(newdir + '/'  + fn + '_' + n[i] + '.xml', aa[i]);} 
                            }		  
                            if ((!(p[i]>0))&&((typ=='command')||(typ=='property'))) {test = aa[i].childNamed('children');}
                            if (test && (!(p[i]>0))) {fs.writeFileSync(np_newdir + '/np_' + fn + '_' + n[i] + '.xml', aa[i])}
                        }
                    }
                }

                i=0;
                var plen = pa.length; // Associated Properties
                var n = [plen];

                if (plen >= 1) {
                    for (i=0; i<plen; i++) {
                        if (pa[i]) {
                            n[i] = pa[i].childNamed('name').val;
                            p[i] = 0;
                            if (pa[i].childNamed('public')) {
                                p[i] = pa[i].childNamed('public').val;
             	                if (p[i]>0) {fs.writeFileSync(newdir + '/' + fn + '_' + n[i] + '.xml', pa[i]);} 
                            }		  
                            if ((!(p[i]>0))&&((typ=='command')||(typ=='association'))) {test = pa[i].childNamed('children');}
                            if (test && (!(p[i]>0))) {fs.writeFileSync(np_newdir + '/np_' + fn + '_' + n[i] + '.xml', pa[i])}
                        }
                    }
                }
 //           console.log(fn);
            });
        }
        cb();
    }

    doall(function () {
	    mkpf(mod, NDR, function () {
            colSD(mod, NDR, function () {
                mvSD(mod, NDR, function () {
					logComplete(mod);
                });
		    });	
        });
    });
}

}