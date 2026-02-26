const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: false,
    },
    description: String,
    // cached fields for convenience
    title: String,
    image: String,
    price: Number,
    category: String,
    note: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

wishlistItemSchema.index({ user: 1 });

wishlistItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    if (typeof next === 'function') next();
});

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

module.exports = WishlistItem;