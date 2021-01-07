var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var port = process.env.PORT || 4000;
var loader = function (dirname, filename) { return path.join(path.resolve(), dirname, filename); };
var server = http.createServer(function (req, res) {
    var extname = '';
    var contentType = '';
    var filename = req.url;
    if (filename == '/') {
        filename = loader('public', 'index.html');
    }
    else {
        var q = url.parse(filename);
        if (q.pathname == '/favicon.ico') {
            filename = loader('public', 'favicon.png');
        }
        else {
            filename = loader('public', q.pathname);
        }
    }
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.ico': 'image/x-icon',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
        '': 'text/html'
    };
    fs.exists(filename, function (status) {
        if (!status) {
            extname = String(path.extname(filename)).toLowerCase();
            contentType = mimeTypes[extname];
            var stream_1 = fs.createReadStream(filename);
            stream_1.on('open', function () { return stream_1.pipe(res); });
            stream_1.on('error', function (error) {
                res.writeHead(404, {
                    'Content-Type': contentType
                })
                    .end(fs.readFileSync(loader('public', '404.html')));
                console.log('🌏 %s %s %s %s', req.method, new Date(), res.statusCode, req.url);
            });
        }
        else {
            extname = String(path.extname(filename)).toLowerCase();
            contentType = mimeTypes[extname];
            res.writeHead(200, {
                'Content-Type': contentType
            })
                .end(fs.readFileSync(filename));
            console.log('🌏 %s %s %s %s', req.method, new Date(), res.statusCode, req.url);
        }
    });
});
server.listen(port, function () {
    console.log("Server berjalan di http://127.0.0.1:" + port);
});
