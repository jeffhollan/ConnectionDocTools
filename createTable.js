var fs = require('fs');
var connectorList = [];
var docList = [];

var run = function () {
    console.log('Reading connectors...');
    readFile('docMapping.json', function(err, data){
        if (!err) {
            parseDocs(data);
        }
        else {
            console.log(err);
        }
    });
    readFile('connectorReferences.json', function (err, data) {
        if (!err) {
            parseList(data);
            readFile('primitives.json', function(err, data) {
                parseList(data);
                sortTable(connectorList);
            });
            
        }
        else {
            console.log(err);
        }
    });

}



var parseList = function (input) {
    lines = input.split(/\r?\n/);
    for (var line in lines) {
        var reg = /\[(.*)\]/g;
        var result = reg.exec(lines[line]);
        connectorList.push({
            reference: result[1],
            formatted: result[1].replace('icon', '').replace(/-/g, ' ').replace(/~/g, '<br/>'),
            doc: docList.indexOf(result[1].replace('icon', '')) >= 0 ? result[1].replace('icon', 'doc') : 'NODOC',
            hasDoc: docList.indexOf(result[1].replace('icon', '')) >= 0 ? true : false
        });
    }
}

var parseDocs = function(input) {
    lines = input.split(/\r?\n/);
    for (var line in lines) {
        docList.push(lines[line]);
    }
}

var readFile = function (filename, callback) {
    fs.readFile(filename, 'utf8', callback);
}

var sortTable = function (array) {
    array.sort(function (a, b) {
         var formattedA = a.formatted.toLowerCase(), formattedB = b.formatted.toLowerCase()
         if (formattedA < formattedB) //sort string ascending
            return -1
         if (formattedA > formattedB)
            return 1
         return 0 //default return value (no sorting)
    });
    var rowCount = 0;
    var markdown = '';
    for (var item in array) {
        //     |[![API Icon][blobicon]<br/>**Azure Blob**][azureblobdoc]|
        markdown = array[item]['hasDoc'] ? markdown + '|[![API Icon][' + array[item]['reference'] + ']<br/>**' + array[item]['formatted'] + '**][' + array[item]['doc'] + ']'
         :  markdown + '|![API Icon][' + array[item]['reference'] + ']<br/>**' + array[item]['formatted'] + '**';
        rowCount++;
        if (rowCount == 4) {
            rowCount = 0;
            markdown = markdown + '|\n';
        }
    }
    fs.writeFile('table.json', markdown);
}


run();