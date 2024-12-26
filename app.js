require('dotenv').config(); 

const express = require('express');
const { connectDB } = require('./config/database');
const surveyRoutes = require('./routes/surveyRoutes');
const app = express();

connectDB();

app.use(express.json());

app.use('/api', surveyRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});