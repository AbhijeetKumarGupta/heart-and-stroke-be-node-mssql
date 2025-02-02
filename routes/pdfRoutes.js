const express = require('express');
const { generatePdf } = require('../controllers/pdfController');
const router = express.Router();


router.post('/generate-pdf', generatePdf);

module.exports = router;
