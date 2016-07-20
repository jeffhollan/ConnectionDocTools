var fs = require('fs');
var connectorList = [];

var run = function(){
    console.log('Reading primitives...');
    readFile('primitiveReferences.json', function(err, data) {
        if(!err){
            parseList(data);
            readFile('connectorReferences.json', function(err, data) {
                if(!err){
                    parseList(data);
                    sortTable(connectorList);
                }
            });
        }
        else
        console.log(err);
    });    
}



var parseList = function(input) {
    lines = input.split(/\r?\n/);
    for(var line in lines) {
       
        var reg = /\[(.*)\]/g;
        var result = reg.exec(lines[line]);
        var trimmedResult = result[1].replace('icon', '');
        connectorList.push(trimmedResult);
    }   
}

var readFile = function(filename, callback) {
    fs.readFile(filename, 'utf8', callback);
}

var sortTable = function(array){
    array.sort();
    var rowCount = 0;
    var markdown = '';
    for(var item in array)
    {
   //     |[![API Icon][blobicon]<br/>**Azure Blob**][azureblobdoc]|
        markdown = markdown + '|[![API Icon][' + array[item] + 'icon]<br/>**' + array[item] + '**][' + array[item] + 'doc]';
        rowCount++;
        if(rowCount == 4) {
            rowCount = 0;
            markdown = markdown + '|\n';
        }
    }
    fs.writeFile('table.json', markdown);
}

run();