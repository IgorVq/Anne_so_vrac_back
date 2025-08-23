require('dotenv').config();
const app = require('./src/app');

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
  });
}

module.exports = app;
