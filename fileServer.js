var fs = require('fs');
var types = {
  'css' : 'text/css',
  'js'  : 'text/javascript',
  'html' : 'text/html'
};

var filePath;
exports.serve = function(pathname, request, response){
  filePath = process.cwd() + pathname;
  console.log("FilePath in exports.serve:");
  console.log(filePath);
  fs.exists(filePath, function(exists) {
    console.log("Filepath exists. Reading:");
    console.log(filePath);
    fs.readFile(filePath, function(error, content){
      if (error || exists === false) {
        console.log('error reading file');
        response.writeHead(404, {});
        response.end();
      } else {
        var contentType = pathname.split('.');
        contentType = types[contentType.length - 1];
        response.writeHead(200, {contentType: contentType});
        response.end(content);
      }
    });
  });
};
