const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const port = 3001;

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/itinerary.html'));
});

app.listen(port, () => {
  console.log(`Server started`);
});

