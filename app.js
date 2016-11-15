var fs = require('fs');

var run = function(){
    console.log('Reading file...');
    fs.readFile('response.json', 'utf8', (err, data) => {
        if(err) throw err;
        console.log('File read successully.  Parsing connector names...\n\n');
        parseJson(data);
        parseJsonFileReferences(data);
    });
}

var connectorList = [];

var parseJson = function(input) {
    var file = "Connectors:\n\n";
    var json = JSON.parse(input);
    for(var value in json['value'])
    {
        file = file + json['value'][value]['name'] + "\n";
    }
    console.log(file);
    fs.writeFile('connectors.json', file);
}

var parseJsonFileReferences = function(input) {
    var file = "";
    var json = JSON.parse(input);
    for (var value in json['value'])
    {
        file = file + "[" + json['value'][value]['properties']['generalInformation']['displayName'].replace(/ /g, '-') +"icon]: ./media/apis-list/" +  
            json['value'][value]['name'] + ".png\n";
    }
    fs.writeFile('connectors-with-images.json', file);
}

run();