const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token'); //response header
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //funkcja verify sprawdza czy sie zgadza
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}