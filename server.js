const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/itinerary', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const tripSchema = new mongoose.Schema({
  tripName: String,
  startDate: Date,
  endDate: Date,
});

const Trip = mongoose.model("Trip", tripSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'itinerary.html'));
});

// Create a new trip
app.post('/post', async (req, res) => {
  const trip = new Trip({
    tripName: req.body.tripName,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  await trip.save();
  res.status(200).send('Trip saved');
});

// Read all trips
app.get('/trips', async (req, res) => {
  const trips = await Trip.find();
  res.status(200).json(trips);
});

// Read a single trip by ID
app.get('/trips/:id', async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).send('Trip not found');
  }
  res.status(200).json(trip);
});

// Update a trip by ID
app.put('/trips/:id', async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!trip) {
    return res.status(404).send('Trip not found');
  }
  res.status(200).json(trip);
});

// Delete a trip by ID
app.delete('/trips/:id', async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) {
    return res.status(404).send('Trip not found');
  }
  res.status(200).send('Trip deleted');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});