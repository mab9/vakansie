import {total} from "./src/test/test.js";

const http = require('http');
const fs = require('fs');

const PORT=8080;

console.info("before server start")

fs.readFile('./test.html', function (err, html) {

    if (err) throw err;

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(PORT);
});

console.info("after server start");
console.info("total tests passed: " + total);

