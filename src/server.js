/* eslint-disable no-console */
import app from './app';
import auth from './config/auth';

const port = process.env.PORT || auth.serverPort;

app.listen(port);

console.log(`Application running on ${port}`);
