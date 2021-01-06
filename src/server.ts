const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const port = process.env.PORT || 4000;

const loader = (dirname: string, filename: string) => path.join(path.resolve(), dirname, filename);
const server = http.createServer((req: any, res: any) => {
  let extname: string = '';
  let contentType: string = '';
  let filename: string = req.url;
  
  if (filename == '/') {
    filename = loader('public', 'index.html');
  } else {
    let q = url.parse(filename);
    if (q.pathname == '/favicon.ico') {
      filename = loader('public', 'favicon.png');
    } else {
      filename = loader('public', q.pathname);
    }
  }
  
  let mimeTypes: any = {
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
  
  fs.exists(filename, (status: boolean) => {
    if (!status) {
      extname = String(path.extname(filename)).toLowerCase();
      contentType = mimeTypes[extname];
      
      let stream = fs.createReadStream(filename);
      stream.on('open', () => stream.pipe(res));
      stream.on('error', (error: any) => {
        res.writeHead(404, {
          'Content-Type': contentType
        })
        .end(
          fs.readFileSync(loader('public', '404.html'))
        );
        console.log('🌏 %s %s %s %s', req.method, new Date(), res.statusCode, req.url);
      });
    } else {
      extname = String(path.extname(filename)).toLowerCase();
      contentType = mimeTypes[extname];
      res.writeHead(200, {
        'Content-Type': contentType
      })
      .end(
        fs.readFileSync(filename)
      );
      console.log('🌏 %s %s %s %s', req.method, new Date(), res.statusCode, req.url);
    }
  });
});

server.listen(port, () => {
  console.log(`Server berjalan di http://127.0.0.1:${port}`);
});