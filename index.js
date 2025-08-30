const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'devops-poc', env: process.env.NODE_ENV || 'dev' });
});

if (require.main === module) {
  app.listen(port, () => console.log(`devops-poc listening on port ${port}`));
}

module.exports = app;
