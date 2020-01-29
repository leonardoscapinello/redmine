"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _util = require('util');
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);

exports. default = async (req, res, next) => {
  const authHeader = req.headers;

  if (!authHeader) {
    return res.status(401).json({ error: 'You must provide authorization key' });
  }

  const authorization = req.headers['authorization'];
  //console.log('authorization', authorization);

  try {

    if(authorization === _auth2.default.secret){
      return next();
    }
    
    return res.status(401).json({ error: 'Invalid authorization key' });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authorization key' });
  }
};
