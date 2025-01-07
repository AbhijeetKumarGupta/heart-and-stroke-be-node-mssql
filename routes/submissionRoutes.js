const express = require('express');
const submissionController = require('../controllers/submissionController');

const router = express.Router();

router.post('/survey', submissionController.createSubmission);

router.get('/user/:userId/submission/:submissionId?', async (req, res) => {
    const { submissionId } = req.params;
    if (submissionId) {
      await submissionController.getUserSubmission(req, res);
    } else {
      await submissionController.getUserSubmissions(req, res);
    }
});

module.exports = router;