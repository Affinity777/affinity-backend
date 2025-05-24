const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/order');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/order', orderRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running")))
  .catch(err => console.log(err));
