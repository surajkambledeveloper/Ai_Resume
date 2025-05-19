
const express = require('express');
const router = express.Router();
const { saveResume, enhanceField,getResume } = require('../controllers/myTempController');

// Routes
router.post('/save', saveResume);
router.post('/enhance', enhanceField);
// router.post('/generate-pdf', generatePDFTemp6);
router.get("/resume/:id", getResume); //

module.exports = router;