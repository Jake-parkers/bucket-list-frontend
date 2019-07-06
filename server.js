const express = require('express');
const path = require('path');
const app = express();
const forceSsl = require('force-ssl-heroku');

app.use(forceSsl);

// Serve static files....
app.use(express.static(__dirname + '/dist/bucketlist-frontend'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/bucketlist-frontend/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 5000);
