require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = []

const isValidUrl = function(url) {
  try {
    new URL(url)
  } catch (error) {
    return false
  }
  return true
}

const indexOfShortUrl = function(url) {
  let index = -1;
  if( isValidUrl(url) ) {
    index = urls.indexOf(url)
    if( index < 0 )
    {
      urls.push(url)
      index = urls.length - 1
    }
  }
  return index;
}

const responseShorturlObj = function(url, index) {
  let response = { error: 'invalid url' };
  if( index > -1 ) {
    response = {"original_url": url, "short_url": index}
  }

  return response;
}

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const index = indexOfShortUrl(url)
  const responseObj = responseShorturlObj(url, index)
  
  res.json(responseObj)
})

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id
  const redirectTo = urls[id]

  res.redirect(redirectTo);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
