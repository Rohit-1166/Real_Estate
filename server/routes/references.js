const express = require('express');
const router = express.Router();
const referenceController = require('../controllers/referenceController');

// Mapped as per requirements
router.get('/cities', referenceController.getCities);
router.get('/types', referenceController.getPropertyTypes);
router.get('/amenities', referenceController.getAmenities);

module.exports = router;
