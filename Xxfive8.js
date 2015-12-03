module.exports = function (shx) {
var fs = require('fs');

//var wx = ['all', 'all', 'analytics', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'net', 'pem', 'security', 'util', 'vcmp', 'wam', 'wom'];
var wx = ['all', 'all', 'analytics', 'apm', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'ltm', 'net', 'pem', 'security', 'sys', 'util', 'vcmp', 'wam', 'wom'];
var Ln = wx.length; 

for (var m = 2; m < Ln; m++) {
    var mod = wx[m];
	
function mkdr(mod, cb) {
    var mkdirp = require('mkdirp');
	var hcsf = './' + mod + '_html_files';
    mkdirp.sync(hcsf); 	
    cb();	
}

function mpgs(mod, shx, cb) { 
    var xmldoc = require('xmldoc');
    var diveSync = require("diveSync");

    diveSync(mod + '_schema_files', {recursive: true}, function(err, file) {
        if (err) {console.log(err);}
        var optc = 'OPTIONS, GET';

        var xml = fs.readFileSync(file, {encoding: 'utf-8'});
        var document = new xmldoc.XmlDocument(xml);
	    var endp = ' ';
	    var nm = ' ';
	    var abst = ' ';
	    var rmeth = ' ';
	    var typ = ' ';

	    if (document.childNamed('path')) {
		    endp = document.childNamed('path').val;}
        if (document.childNamed('name')) {
	        nm = document.childNamed('name').val;}
		if (document.childNamed('context_help')) {
   	        abst = document.childNamed('context_help').val;}
	    if (document.childNamed('help_text')) {
   	        abst = document.childNamed('help_text').val;}
	    if (document.childNamed('http_methods')) {
	        rmeth = document.childNamed('http_methods').val;}
	    if (document.childNamed('type')) {
	       typ = document.childNamed('type').val;}
        var chd = false;
        var pub = 0;
        var prv = [];
        var j = 0;

        var ptag = document.childNamed('public');
        if (ptag) {pub = document.childNamed('public').val;}

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
            var asa = (document.descendantWithPath('cli_cmd_mode.children')).childrenNamed('mode');
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

        var title = "mgmt/tm/" + endp;

        fn = endp;
        fn = fn.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');

        var sp = '</td><td>';

        var burl = '/mgmt/tm/';
        var urlc = burl + endp;
        var url = burl + endp + '/~[resource id]';

        var page = '<!DOCTYPE html><html lang="en"><head>';
		page = page + '<meta charset="utf-8" />';
		page = page + '<link href="bootstrap.min.css" rel="stylesheet" media="screen" />';
        page = page + '<title>'+ title + '</title>';
		page = page + '<!--[if lt IE 9]>';
		page = page + '<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>';
		page = page + '<![endif]-->';   
		page = page + '</head>';
        page = page + '<body><div class="container"><h1>' + title + '</h1>' + "\n";
        page = page + '<p>' + abst + '</p>' + "\n";

        if (pub>0) {
            page = page + '<h2>REST Endpoints</h2>' + "\n";
            page = page + '<dl class="dl-horizontal">';
            page = page + '<dt>Collection URI</dt>' + '<dd><code>' + urlc + '</code></dd>';
            page = page + '<dt>Collection Methods</dt>' +'<dd><code>' + optc + '</code></dd>';
            page = page + '<dt>Resource URI</dt>' +'<dd><code>' + url + '</code></dd>';
            page = page + '<dt>Resource Methods</dt>' + '<dd><code>' + rmeth + '</code></dd>';
            page = page + '<dt>Resource Natural Key</dt>' + '<dd><code>' + ' ' + '</code></dd>';
            page = page + '</dl>' + "\n";
        }

        if (!(pub>0)) {
            page = page + '<p>' + 'This object has the following members.</p>' + "\n";	
        }

        var len = ka.length; // Number
        if (len >= 1) {
            var n = [len];  // Name of JSON property
            var t = [len];  // JSON Type
            var d = [len];  // Default Value
            var h = [len];  // HTTP Methods Allowed
            var p = [len];  // marked public
            var r = [len];  // Required Property
            var des = [len]; // Description
            var link = [len];
            var s = 0; 
            var test = false;
            var k = 0;
            var plb = [];
   
            for (i=0; i<len; i++) {
                n[i] = ka[i].childNamed('name').val;
                link[i]=n[i];

                d[i] = " ";
                if (ka[i].childNamed('default')) {
                    d[i] = ka[i].childNamed('default').val;  
                }
	  
                h[i] = ' ';
                if (ka[i].childNamed('http_methods')) {
		            h[i] = 'read';
                    s = ka[i].childNamed('http_methods').val;
                    if (!(s.indexOf('PUT')<0) || !(s.indexOf('PATCH')<0)|| !(s.indexOf('DELETE')<0)|| !(s.indexOf('POST'))<0) {
                        h[i] = 'read/write';
                    }		 
                }
	  
                r[i] = 'optional';
                if (ka[i].childNamed('required')) {
                    r[i] = 'required';  
                }
	  
                p[i] = 0;
                if (ka[i].childNamed('public')) {
                    p[i] = ka[i].childNamed('public').val;
		            if (p[i]>0) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html\">' + n[i] + '</a>';} 
		        }	  
	  
                if ((!(p[i]>0))&&(typ=='command')) {test = ka[i].childNamed('children');}
                if (test) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html\">' + n[i] + '</a>';}
		 	  	  
                t[i] = 'string';
                if (ka[i].childNamed('json_type')) {
                    t[i] = ka[i].childNamed('json_type').val;  
                }
	  	  
                des[i] = ' ';
                if (ka[i].childNamed('context_help')) {
                    var srgc = ka[i].childNamed('context_help').val;
	  	            srgc = srgc.replace(/[<>]/g,' ');					
                }
                if (ka[i].childNamed('help_text')) {
                    var srgt = ka[i].childNamed('help_text').val;
					srgt = srgt.replace(/[<>]/g,' ');
               }
				if(srgt && srgc) {
					des[i] = srgt;
				}
				if(!(srgt) && srgc) {
					des[i] = srgc;
				}
 								
	  
	            plb[k] = [link[i], t[i], d[i], r[i], h[i], des[i]];
	            k = k + 1;

            }  
   
            if (k > 0) {
                page = page + '<h2>' + 'Properties</h2>' + "\n";
                page = page + '<table class="table table-bordered">';
                page = page + '<thead><tr><th>Name</th><th>Type</th>';
                page = page + '<th>Default Value</th><th>Required</th><th>Access</th>';
                page = page + '<th>Description</th></tr></thead>' + "\n";
                page = page + '<tbody>';

                var tmp = [];
                for (i=0; i<k; i++) {
                    tmp = plb[i];
                    page = page + '<tr><td>'+ '<code>' + tmp[0] + '</code>' +sp+tmp[1]+sp+tmp[2]+sp+tmp[3]+sp+tmp[4]+sp+tmp[5]+'</td></tr>' + "\n";
                }
                page = page + '</tbody></table>' + "\n";
            }	

        }

        var asalen = asa.length; // Number of associations
        if (asalen >= 1) {
            n = [];  // Name of Association
            var link = [asalen];
            t = [];  // JSON Type
            d = [];  // Default Value
            h = [];  // HTTP Methods Allowed
            p = [];  // (public)
            r = [];  // Required Property
            des = []; // Description
            link = [];
            s = 0;
            test = false;
            var k = 0;
            var plb = [];
   
            for (i=0; i<asalen; i++) {
                n[i] = asa[i].childNamed('name').val;
                link[i]=n[i];

                d[i] = " ";
                if (asa[i].childNamed('default')) {
                    d[i] = asa[i].childNamed('default').val;  
                }
			
                h[i] = ' ';
                if (asa[i].childNamed('http_methods')) {
		            h[i] = 'read';
                    s = asa[i].childNamed('http_methods').val;
                    if (!(s.indexOf('PUT')<0) || !(s.indexOf('PATCH')<0)|| !(s.indexOf('DELETE')<0)|| !(s.indexOf('POST'))<0) {
                    h[i] = 'read/write';
                    }		 
                }
		
                r[i] = 'optional';
                if (asa[i].childNamed('required')) {
                    r[i] = 'required';  
                }
			
                p[i] = 0;
                    if (asa[i].childNamed('public')) {
                        p[i] = asa[i].childNamed('public').val;
		                if (p[i]>0) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html\">' + n[i] + '</a>';} 
		            }	  

		        if ((!(p[i]>0))&&((typ=='command')||(typ=='association')||(typ=='association_list')||(typ=='property'))) {test = (asa[i].childNamed('children')) || ((asa[i].descendantWithPath('cli_cmd')).childNamed('children'));}
                if (test && (!(p[i]>0))) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html\">' + n[i] + '</a>';}
		 	  	  		 		 
                t[i] = 'string';
                    if (asa[i].childNamed('json_type')) {
                    t[i] = asa[i].childNamed('json_type').val;  
                }
			
                des[i] = ' ';
                if (asa[i].childNamed('context_help')) {
                    var srgc = asa[i].childNamed('context_help').val;
	  	            srgc = srgc.replace(/[<>]/g,' ');					
                }
                if (asa[i].childNamed('help_text')) {
                    var srgt = asa[i].childNamed('help_text').val;
					srgt = srgt.replace(/[<>]/g,' ');
               }
				if(srgt && srgc) {
					des[i] = srgt;
				}
				if(!(srgt) && srgc) {
					des[i] = srgc;
				}
 				 								
				
	  
                if (p[i]>0) {
	                plb[k] = [link[i], t[i], d[i], r[i], h[i], des[i]];
	                k = k + 1;
	            }
	  
                if (!(p[i]>0)) {
                    prv[j] = [link[i], t[i], d[i], r[i], h[i], des[i]];
	                j = j+1;
	            }
            }  
   
            if (k > 0) {
                page = page + '<h2>' + 'Subcollections</h2>' + "\n";
                page = page + '<table class="table table-bordered">';
                page = page + '<thead><tr><th>Name</th><th>Type</th>';
                page = page + '<th>Default Value</th><th>Required</th><th>Access</th>';
                page = page + '<th>Description</th></tr></thead>' + "\n";
                page = page + '<tbody>';

                var tmp = [];
                for (i=0; i<k; i++) {
                    tmp = plb[i];
                    page = page + '<tr><td>'+ '<code>' + tmp[0] + '</code>'+sp+tmp[1]+sp+tmp[2]+sp+tmp[3]+sp+tmp[4]+sp+tmp[5]+'</td></tr>' + "\n";
                }
                page = page + '</tbody></table>' + "\n";
            }	
        }

        var aalen = aa.length; // Number 
        if (aalen >= 1) {
            n = [];  // Name of association_list
            t = [];  // JSON Type
            d = [];  // Default Value
            h = [];  // HTTP Methods Allowed
            p = [];  // (public)
            r = [];  // Required Property
            des = []; // Description
            link = [];
            s = 0;
            test = false;
            var k = 0;
            var plb = [];

            for (i=0; i<aalen; i++) {
                n[i] = aa[i].childNamed('name').val;
                link[i]=n[i];

            d[i] = " ";
                if (aa[i].childNamed('default')) {
                    d[i] = aa[i].childNamed('default').val;  
                }
			
	            h[i] = ' ';
                if (aa[i].childNamed('http_methods')) {
		            h[i] = 'read';
                    s = aa[i].childNamed('http_methods').val;
                    if (!(s.indexOf('PUT')<0) || !(s.indexOf('PATCH')<0)|| !(s.indexOf('DELETE')<0)|| !(s.indexOf('POST'))<0) {
                        h[i] = 'read/write';
                    }		 
                }
			
                r[i] = 'optional';
                if (aa[i].childNamed('required')) {
                    r[i] = 'required';  
                }
			
                p[i] = 0;
                if (aa[i].childNamed('public')) {
                    p[i] = aa[i].childNamed('public').val;
		            if (p[i]>0) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html\">' + n[i] + '</a>';} 
		        }	  
                if (typ=='command') {test = aa[i].childNamed('children');}
                if (test && (!(p[i]>0))) {link[i] = '<a href=\"' +  fn + '_' + n[i] + '.html\">' + n[i] + '</a>';}

                t[i] = 'string';
                if (aa[i].childNamed('json_type')) {
                    t[i] = aa[i].childNamed('json_type').val;  
                }
							
                des[i] = ' ';
                if (aa[i].childNamed('context_help')) {
                    var srgc = aa[i].childNamed('context_help').val;
	  	            srgc = srgc.replace(/[<>]/g,' ');					
                }
                if (aa[i].childNamed('help_text')) {
                    var srgt = aa[i].childNamed('help_text').val;
					srgt = srgt.replace(/[<>]/g,' ');
               }
				if(srgt && srgc) {
					des[i] = srgt;
				}
				if(!(srgt) && srgc) {
					des[i] = srgc;
				}								
				
	  
                if (p[i]>0) {
	                plb[k] = [link[i], t[i], d[i], r[i], h[i], des[i]];
	                k = k + 1;
	            }
	  
                if (!(p[i]>0)) {
                    prv[j] = [link[i], t[i], d[i], r[i], h[i], des[i]];
	                j = j+1;
	            }
            }  
   
            if (k > 0) {
                page = page + '<h2>' + 'Lists</h2>' + "\n";
                page = page + '<table class="table table-bordered">';
                page = page + '<thead><tr><th>Name</th><th>Type</th>';
                page = page + '<th>Default Value</th><th>Required</th><th>Access</th>';
                page = page + '<th>Description</th></tr></thead>' + "\n";
                page = page + '<tbody>';

                var tmp = [];
                for (i=0; i<k; i++) {
                    tmp = plb[i];
                    page = page + '<tr><td>'+ '<code>' + tmp[0] + '</code>' +sp+tmp[1]+sp+tmp[2]+sp+tmp[3]+sp+tmp[4]+sp+tmp[5]+'</td></tr>' + "\n";
                }
                page = page + '</tbody></table>' + "\n";
            }	
        }

        var plen = pa.length; // Associated Properties
        if (plen >= 1) {
            n = [];  // Name of property
            t = [];  // JSON Type
            d = [];  // Default Value
            h = [];  // HTTP Methods Allowed
            p = [];  // (public)
            r = [];  // Required Property
            des = []; // Description
            link = [];
            s = 0;
            test = false;
            k = 0;
            plb = [];

            for (i=0; i<plen; i++) {
                n[i] = pa[i].childNamed('name').val;
                link[i]=n[i];

                d[i] = " ";
                    if (pa[i].childNamed('default')) {
                    d[i] = pa[i].childNamed('default').val;  
                    }
				
                h[i] = ' ';
                if (pa[i].childNamed('http_methods')) {
	 	            h[i] = 'read';
                    s = pa[i].childNamed('http_methods').val;
                    if (!(s.indexOf('PUT')<0) || !(s.indexOf('PATCH')<0)|| !(s.indexOf('DELETE')<0)|| !(s.indexOf('POST'))<0) {
                        h[i] = 'read/write';
                    }		 
                }
			
                r[i] = 'optional';
                if (pa[i].childNamed('required')) {
                    r[i] = 'required';  
                }
			
                p[i] = 0;
                    if (pa[i].childNamed('public')) {
                        p[i] = pa[i].childNamed('public').val;
		                if (p[i]>0) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html>\"' + n[i] + '</a>';} 
	   	            }	  
                if ((typ=='command')||(typ=='association')) {test = pa[i].childNamed('children');}
                if (test && (!(p[i]>0))) {link[i] = '<a href=\"' + fn + '_' + n[i] + '.html\">' + n[i] + '</a>';}
	  
                t[i] = 'string';
                if (pa[i].childNamed('json_type')) {
                    t[i] = pa[i].childNamed('json_type').val;  
                }
			
                des[i] = ' ';
                if (pa[i].childNamed('context_help')) {
                    var srgc = pa[i].childNamed('context_help').val;
	  	            srgc = srgc.replace(/[<>]/g,' ');
                }
                if (pa[i].childNamed('help_text')) {
                    var srgt = pa[i].childNamed('help_text').val;
					srgt = srgt.replace(/[<>]/g,' ');
               }
				if(srgt && srgc) {
					des[i] = srgt;
				}
				if(!(srgt) && srgc) {
					des[i] = srgc;
				}
 				
                if (p[i]>0) {
	                plb[k] = [link[i], t[i], d[i], r[i], h[i], des[i]];
	                k = k + 1;
 	            }
	  
                if (!(p[i]>0)) {
                    prv[j] = [link[i], t[i], d[i], r[i], h[i], des[i]];
  	                j = j+1;
  	            }
            }  
   
            if (k > 0) {
                page = page + '<h2>' + 'Associated Properties</h2>' + "\n";
                page = page + '<table class="table table-bordered">';
                page = page + '<thead><tr><th>Name</th><th>Type</th>';
                page = page + '<th>Default Value</th><th>Required</th><th>Access</th>';
                page = page + '<th>Description</th></tr></thead>' + "\n";
                page = page + '<tbody>';

                var tmp = [];
                for (i=0; i<k; i++) {
                    tmp = plb[i];
                    page = page + '<tr><td>'+ '<code>' + tmp[0] + '</code>'+sp+tmp[1]+sp+tmp[2]+sp+tmp[3]+sp+tmp[4]+sp+tmp[5]+'</td></tr>' + "\n";
                }
                page = page + '</tbody></table>' + "\n";
            }	

        }

        if (j>0) {
            page = page + '<h2>' + 'Associated Arrays and Lists</h2>' + "\n";
            page = page + '<table class="table table-bordered">';
            page = page + '<thead><tr><th>Property Name</th><th>Type</th>';
            page = page + '<th>Default Value</th><th>Required</th><th>Access</th>';
            page = page + '<th>Description</th></tr></thead>' + "\n";
            page = page + '<tbody>';

            var tmp = [];
            for (i=0; i<j; i++) {
                tmp = prv[i];
                page = page + '<tr><td>'+'<code>' + tmp[0] + '</code>' +sp+tmp[1]+sp+tmp[2]+sp+tmp[3]+sp+tmp[4]+sp+tmp[5]+'</td></tr>' + "\n";
            }
            tmp = [];
            j = 0;
            page = page + '</tbody></table>' + "\n";
        }
//
//	var shx = 0;
//	
//Copyright information
page = page + 'Copyright © 2015 F5 Networks. All Rights Reserved.' + "\n";
//
	if (shx > 0) {page = page + '<h2><a href=\"' + file +  '\">NOT FOR PUB (REVIEW ONLY): XML from schema.</a></h2>' + "\n";};
    page = page + "</div></body></html>";

//    console.log(fn + ".html");
    fs.writeFileSync("./" + mod + "_html_files/" + fn + '.html', page);
    });
	console.log('HTML: ' + mod);
    cb();
    }

function midx(mod, cb) {
    var hr = [];

    fs.readdir(mod + '_html_files', function (err, files) {
		if (err)
        throw err;
	
	    var page = '<!DOCTYPE html><html lang="en"><head>';
		page = page + '<meta charset="utf-8" />';
		page = page + '<link href="bootstrap.min.css" rel="stylesheet" media="screen" />';
        page = page + '<title>Index: mgmt/tm/' + mod + '</title>';
		page = page + '<!--[if lt IE 9]>';
		page = page + '<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>';
		page = page + '<![endif]-->';   
		page = page + '</head>';
        page = page + '<body><div class="container"><h1>Index: mgmt/tm/' + mod + '</h1>' + "\n";
		
        for (var index in files) {
	        var fn = files[index].replace(".html", "");
	        fn = fn.replace(/[_]/g,'/');
			hr[index] = '<p><a href=\"' + files[index] + '\" target="_blank">mgmt/tm/' + fn + '</a></p>';
			if (fn == 'index') {
				hr[index] = '';
			}
	        page = page + hr[index] + "\n";
        }
        page = page + '</div></body></html>' + "\n";
        fs.writeFileSync(mod + '_html_files/index.html', page);
//Copy css file into folder
		fs.writeFileSync(mod + '_html_files/bootstrap.min.css', fs.readFileSync('./bootstrap.min.css'));		
    });
	console.log('Index: ' + mod);
}

function dorun(cb) {
//	console.log('\nGenerating HTML files.');
	cb();
}		

function logComplete(mod) {
//    console.log('\nFinished HTML and index files for the ' + mod + 'module.');
}

dorun(function () {
	mkdr(mod, function () {
        mpgs(mod, shx, function () {
            midx(mod, function () {
                logComplete(mod);
            });
		});	
    });
});
}

}
