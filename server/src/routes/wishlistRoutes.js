const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// Route to create a new wishlist item
router.post('/', auth, wishlistController.createWishlistItem);

// Route to get all wishlist items
router.get('/', auth, wishlistController.getWishlistItems);

// Route to update a wishlist item by ID
router.put('/:id', auth, wishlistController.updateWishlistItem);

// Route to delete a wishlist item by ID
router.delete('/:id', auth, wishlistController.deleteWishlistItem);

module.exports = router;