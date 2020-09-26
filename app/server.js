const express = require('express');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { PORT } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to My Bot');
});

app.listen(PORT, () => {
  console.log(`Bot listening at ${PORT}`);
});
