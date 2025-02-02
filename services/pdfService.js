const puppeteer = require('puppeteer');

const createPdf = async (html) => {
  try {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
        }
    );
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });

    await page.waitForSelector('body');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error generating PDF');
  }
};

module.exports = { createPdf };
