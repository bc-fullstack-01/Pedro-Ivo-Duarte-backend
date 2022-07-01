const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log(req.headers);
  res.send('Hello from express')
})

app.listen(4000);
console.log('Server listening o port 4000')