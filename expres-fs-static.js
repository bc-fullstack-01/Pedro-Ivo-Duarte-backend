const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const content = fs.readFileSync(__dirname + '/static/index.html', 'utf8');
  res.send(content)
});

app.listen(4000);
console.log('server running o port 4000');