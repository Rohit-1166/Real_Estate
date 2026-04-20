const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Mapped to specific business logic
router.post('/sales', transactionController.createSale);
router.post('/rentals', transactionController.createRental);
router.post('/reviews', transactionController.createReview);
router.get('/reviews/:property_id', transactionController.getReviewsByProperty);

module.exports = router;
