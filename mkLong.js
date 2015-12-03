module.exports = function () {
var fs = require('fs');
var rimraf = require('rimraf'); 

//var wx = ['all', 'all', 'analytics', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'net', 'pem', 'security', 'util', 'vcmp', 'wam', 'wom'];
var wx = ['all', 'all', 'analytics', 'apm', 'auth', 'cli', 'cm', 'gtm', 'ilx', 'ltm', 'net', 'pem', 'security', 'sys', 'util', 'vcmp', 'wam', 'wom'];
var Ln = wx.length; 

fs.appendFileSync('./iControl_REST_API_Reference/index_long.html', fs.readFileSync('./base_index.html'));

for (var m = 2; m < Ln; m++) {
	var mod = wx[m];
	linx(mod);

};

//Copy css and index file into folder
		
	function linx(mod) {
	var fs = require('fs');
	var data = fs.readFileSync('./iControl_REST_API_Reference/' + mod + '_html_files/index.html');
	
	var rep = 'href="./' + mod + '_html_files/';
	var str = String(data).replace(/href="/g, rep);
	fs.appendFileSync('./iControl_REST_API_Reference/index_long.html', str);		
    };
}; 

 
	
