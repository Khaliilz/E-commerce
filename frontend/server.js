const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3100, () => {
  console.log(`Frontend server is running on http://localhost:3100`);
});