module.exports = function (shx) {
var fs = require('fs');
var rimraf = require('rimraf'); 


//var wx = ['all', 'all', 'analytics', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'net', 'pem', 'security', 'util', 'vcmp', 'wam', 'wom'];
var wx = ['all', 'all', 'analytics', 'apm', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'ltm', 'net', 'pem', 'security', 'sys', 'util', 'vcmp', 'wam', 'wom'];
var Ln = wx.length; 

//var shx = 1;

for (var m = 2; m < Ln; m++) {
	var mod = wx[m];
	if (!(shx > 0)) {
		
		rimraf('./' + mod + '_schema_files', function(err) {
			if (err) { throw err; }
			// done
		});	
	};
	
	if (shx > 0) { 
		mvD(mod);
		console.log('XML folder: ' + mod);
	};
};

// remove seed_schemas files dir				
rimraf('./' + 'seed_schemas', function(err) {
		if (err) { throw err; }
			// done
});	

	function mvD(mod) {
		var pdir = './' + mod + '_schema_files';
		var tdir = './' + mod + '_html_files/' + mod + '_schema_files';
 
		fs.rename(pdir, tdir, function (err) {
			if (err) {throw err;}
	//    	console.log('Move schema files dir');
		});
    };
}; 

 
	
