// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User'); // Import User model

const app = express();
const PORT = process.env.PORT || 9081;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tectzo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.post('/api/users/register', async (req, res) => {
  const { username, phoneNumber, password } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      phoneNumber,
      password,
    });

    await user.save();
    res.status(201).json({ success: true, userId: user._id, username: user.username, phoneNumber: user.phoneNumber });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/users/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ success: true, userId: user._id, username: user.username, phoneNumber: user.phoneNumber });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/users/update-vehicles', async (req, res) => {
  const { userId, selectedVehicles } = req.body;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.selectedVehicles = selectedVehicles;

    await user.save();
    res.status(200).json({ success: true, message: 'Selected vehicles updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// New route to update personal information
app.post('/api/users/update-personal-info', async (req, res) => {
  const { userId, firstName, lastName, dob } = req.body;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = dob;

    await user.save();
    res.status(200).json({ success: true, message: 'Personal info updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
