import app from './app';

const port = process.env.PORT || 3040;

app.listen(port);

console.log(`Application running on ${port}`);
