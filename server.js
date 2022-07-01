const http = require('http');
const { Stream } = require('stream');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('Hello from Server')
    res.end()
  }
});

server.on('connection', (Stream) => {
  console.log('some one connected')
});

server.listen(4000);
console.log('Server listen on http://localhost:4000')
