const app = require('express')();

app.get('/', (req, res) => {
  console.log(req.headers)
  res.send('Hello from express.js server!')
})

app.listen((port) => {
  port = 4000;
  console.log(`server listening on http://localhost:${port}`);
  return port;
})