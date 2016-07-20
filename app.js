var fs = require('fs');

var run = function(){
    console.log('Reading file...');
    fs.readFile('response.json', 'utf8', (err, data) => {
        if(err) throw err;
        console.log('File read successully.  Parsing connector names...\n\n');
        parseJson(data);
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

run();