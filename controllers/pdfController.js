const pdfService = require('../services/pdfService');

const generatePdf = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: 'HTML content is required' });
    }

    const pdfBuffer = await pdfService.createPdf(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=Heart-Risk-Survey-Guide.pdf');

    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error generating PDF',
      error: error.message,
    });
  }
};

module.exports = { generatePdf };
