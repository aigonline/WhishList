const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// Route to create a new wishlist item (correctly caches deal title/image/price)
router.post('/', auth, wishlistController.add);

// Route to get all wishlist items (enriches from populated deal if cached fields missing)
router.get('/', auth, wishlistController.list);

// Route to update a wishlist item by ID
router.put('/:id', auth, wishlistController.updateWishlistItem);

// Route to delete a wishlist item by ID
router.delete('/:id', auth, wishlistController.remove);

module.exports = router;