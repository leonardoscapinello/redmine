"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable no-console */
var _app = require('./app'); var _app2 = _interopRequireDefault(_app);
var _auth = require('./config/auth'); var _auth2 = _interopRequireDefault(_auth);

const port = process.env.PORT || _auth2.default.serverPort;

_app2.default.listen(port);

console.log(`Application running on ${port}`);
