const http = require('http')

const server = http.createServer((req, res) => {
  if(req.url === '/') {
    console.log(req.headers)
    res.write('hello from http server');
    res.end();
  }
});

server.on('connection', (stream) => {
  console.log('some one connected');
});

server.listen(4000);
console.log('sever listening on http://localhost:4000');
