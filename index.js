const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.get('/', (req, res) => {
  res.json({
    text: 'api works!',
  });
});

app.post('/api/login', (req, res) => {
  const user = { id: 3 };
  const token = jwt.sign({ user }, 'secret_token');
  res.json({
    token,
  });
});

const ensureToken = (req, res, next) => {
  const bearerHeader = req.header('authorization');
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

app.get('/api/protected', ensureToken, (req, res) => {
  jwt.verify(req.token, 'secret_token', (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        text: 'protected',
        data,
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server on port 3000');
});
