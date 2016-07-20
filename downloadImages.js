var fs = require('fs');
var sharp = require('sharp');
var request = require('request')

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
 //   var file = "Connectors:\n\n";
    var json = JSON.parse(input);
    for(var value in json['value'])
    {
        imagePath = json['value'][value]['properties']['generalInformation']['iconUrl'];
        name = json['value'][value]['properties']['name'];
        downloadImage(imagePath, name + ".png");
    }
  //  console.log(file);
 //   fs.writeFile('connectors.json', file);
}

var downloadImage = function(imagePath, filename)
{
    request.head(imagePath, function(err, res, body)
    {
        request(imagePath).pipe(fs.createWriteStream('temp/' + filename)).on('finish', function(){
            var resizePhoto = sharp('temp/' + filename).resize(90,90).toFile('images/' + filename, function (err) {
                if(!err){
                    console.log(filename, ': created');
                }
                else {
                    console.log(err);
                }
            });
        });
    });
}

run();