require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const submissionRoutes = require('./routes/submissionRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use('/api', submissionRoutes);

app.use('/api', pdfRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});