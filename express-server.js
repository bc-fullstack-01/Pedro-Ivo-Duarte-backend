const app = require('express')();
PORT = 4000;

app.get('/', (req, res) => {
  console.log(req.headers)
  res.send('Hello from express.js server!')
})

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
})
