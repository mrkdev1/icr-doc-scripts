var Xslmod3 = require('./Xslmod3.js');
var Xslicit3 = require('./Xslicit3.js');
var Xxfive8 = require('./Xxfive8.js');
var morg02 = require('./morg02.js');
var pack = require('./pack.js');
var mkLong = require('./mkLong.js');


var shx = process.argv[2];

function AAA(cb) {
	console.log ("\nXML module-files.");
	Xslmod3();
	var secs = 10;
	var tmo = secs * 1000;
	setTimeout(function(){cb();}, tmo);
};

function BBB(cb) {
	console.log ("\nXML topic-files");
	Xslicit3();
	var secs = 5;
	var tmo = secs * 1000;
	setTimeout(function(){cb();}, tmo);
};

function CCC(cb) {
	console.log ("\nHTML files");
	Xxfive8(shx);
	var secs = 5;
	var tmo = secs * 1000;
	setTimeout(function(){cb();}, tmo);
};

function DDD(cb) {
	console.log ("\nXML Folders");	
	morg02(shx);
	var secs = 5;
	var tmo = secs * 1000;
	setTimeout(function(){cb();}, tmo);
};

function EEE(cb) {
	console.log ("\nHTML folders");
	pack();
	var secs = 5;
	var tmo = secs * 1000;
	setTimeout(function(){cb();}, tmo);
};

function FFF(cb) {
	console.log ("\nGlobal index")
	mkLong();
	var secs = 5;
	var tmo = secs * 1000;
	setTimeout(function(){cb();}, tmo);
};

function dorun(cb) {
	console.log('\nSTART (Note: Console displays FINISHED when done)');
	cb();
}		

function logComplete() {
    console.log('\nFINISHED');
}	

dorun(function () {
	AAA(function () {
        BBB(function () {
            CCC(function () {
				DDD(function () {
					EEE(function () {
						FFF(function () {
							logComplete();
						});
					});
				});
            });
		});	
    });
});