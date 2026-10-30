const http = require('http');
const url = require('url');
const fs = require("fs");
const path = require("path");
const { hostname } = require('os');

function listener(req, res){
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);

    if(parsedUrl.pathname === "/script"){
        var name = parsedUrl.query.name;
        var dir = "scripts";
        var contentType = 'application/javascript';
    }
    else if(parsedUrl.pathname === "/style"){
        var name = parsedUrl.query.name;
        var dir = "styles";
        var contentType = "text/css";
    }
    else if(parsedUrl.pathname === "/data"){
        var name = parsedUrl.query.name;
        var dir = "datas";
        var contentType = "application/json";
    }
    else if(parsedUrl.pathname === "/"){
        var name = "index.html";
        var dir = "pages";
        var contentType = "text/html";
    }
    fs.readFile(path.join(__dirname, `${dir}/${name}`), (err, data) => {
        if(!err){
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
        else{
            res.writeHead(404);
            res.end()
        }
    });
}

const server = http.createServer(listener);

server.listen(8000);