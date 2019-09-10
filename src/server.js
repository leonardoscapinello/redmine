import app from './app';

const port = process.env.PORT || 3031;

app.listen(port);

console.log(`Application running on ${port}`);
