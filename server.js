var url = require("url");
var path = require("path");
var fs = require("fs");
var port = process.argv[2] || 8080;

var endsWith = function(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

var httpHandler = function(request, response) {
  var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), 'client', uri);

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      console.log("file: " + filename);
      if (endsWith(filename, ".mustache")) {
          response.writeHead(500, {"Content-Type": "text/mustache"});
      }
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
};

var app = require('http').createServer(httpHandler);
app.listen(parseInt(port, 10));

