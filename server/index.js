const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const comments = require('./routes/api/comments');
app.use('/api/comments', comments);

//handle production settings
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public'));

  //SPA (any route)
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
