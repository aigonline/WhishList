const WishlistItem = require('../models/WishlistItem');
const Deal = require('../models/Deal');

exports.list = async (req, res) => {
  const items = await WishlistItem.find({ user: req.user._id }).populate('deal');
  res.json(items);
};

exports.add = async (req, res) => {
    const { dealId, note, title, name, description } = req.body;
    // If dealId provided, add by deal reference
    if (dealId) {
        const deal = await Deal.findById(dealId);
        if (!deal) return res.status(404).json({ message: 'Deal not found' });
        const existing = await WishlistItem.findOne({ user: req.user._id, deal: dealId });
        if (existing) return res.status(400).json({ message: 'Already in wishlist' });
        const item = await WishlistItem.create({
            user: req.user._id,
            deal: dealId,
            title: deal.title,
            price: deal.price,
            category: deal.category,
            note,
        });
        return res.status(201).json(item);
    }

    // Otherwise allow adding a generic wishlist item (no deal)
    const itemTitle = title || name;
    if (!itemTitle) return res.status(400).json({ message: 'title or name required' });
    const item = await WishlistItem.create({
        user: req.user._id,
        title: itemTitle,
        description: description || note || '',
    });
    res.status(201).json(item);
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  const item = await WishlistItem.findOne({ _id: id, user: req.user._id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.remove();
  res.json({ message: 'Removed' });
};

// Create a new wishlist item
exports.createWishlistItem = async (req, res) => {
    try {
        // Always set the user from the authenticated request to avoid validation errors
        const payload = Object.assign({}, req.body, { user: req.user._id });
        const newItem = new WishlistItem(payload);
        const savedItem = await newItem.save();
        // Populate the deal reference so the frontend can access deal.title, etc.
        await savedItem.populate('deal');
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all wishlist items
exports.getWishlistItems = async (req, res) => {
    try {
        // Return items only for the authenticated user and populate deal references
        const items = await WishlistItem.find({ user: req.user._id }).populate('deal');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a wishlist item
exports.updateWishlistItem = async (req, res) => {
    try {
        // Ensure the item belongs to the authenticated user
        const updatedItem = await WishlistItem.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a wishlist item
exports.deleteWishlistItem = async (req, res) => {
    try {
        const deletedItem = await WishlistItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};