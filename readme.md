#icr-doc-scripts

This repository contains the files used to generate the HTML version of the icr docs. 

To generate the HTML.

1. Clone this **repo** into a folder on a computer with node.js installed. 
2. Prep your xml output from rasp as described below, name it `rasp_schema.xml`, and then copy it into your folder alongside `icrRESTdoc03.js`.
3. Open a command prompt in Windows and run: `node icrRESTdoc03.js`
4. The command prompt will display scrolling progress-messages as the script runs and then display **`FINISHED`** 	when done.
5. A new folder will be added named `iControl_REST_API_Reference` containing subfolders containing the html files.

This version of `node icrRESTdoc03.js` uses the text in tags `<help_text>`, if available (from .pod files). Otherwise it uses the text in `<context_help>`, if available.

Note you can run the command with an option to also generate an xml page along with a link in the html : `node icrRESTdoc03.js 1` 

To prep the `rasp_schema.xml` delete everything in the raw file above and below the one `tmsh_version` you need. Add enclosing schema tags. Empty `keyword` tags cause an error, so do a search and replace to remove all occurrence of `<keyword></keyword>` and `<keyword\>`  

This script works with the last version of rasp output I received and containing data from .pod files.   