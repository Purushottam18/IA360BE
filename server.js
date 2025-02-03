const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const { google } = require('googleapis');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use(express.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on 0.0.0.0:${PORT}`));
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

