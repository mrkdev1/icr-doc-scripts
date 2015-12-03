module.exports = function () {
var fs = require('fs');
var rimraf = require('rimraf'); 

//var wx = ['all', 'all', 'analytics', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'net', 'pem', 'security', 'util', 'vcmp', 'wam', 'wom'];
var wx = ['all', 'all', 'analytics', 'apm', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'ltm', 'net', 'pem', 'security', 'sys', 'util', 'vcmp', 'wam', 'wom'];
var Ln = wx.length; 

for (var m = 2; m < Ln; m++) {
	var mod = wx[m];
	pac(mod);
	console.log('HTML folder: ' + mod);
};

//Copy css and into folder
		fs.writeFileSync('./iControl_REST_API_Reference/bootstrap.min.css', fs.readFileSync('./bootstrap.min.css'));		

	function pac(mod) {
        var pd = './' + mod + '_html_files';
        var td = './iControl_REST_API_Reference/' + mod + '_html_files';
 
        fs.rename(pd, td, function (err) {
            if (err) {throw err;}
//    	    console.log('Move html files dir');
	    });	
		
    };
}; 

 
	
