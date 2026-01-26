const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const auth = require('../middleware/auth');

// Public listing with optional category filter
router.get('/', async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) filter.title = new RegExp(q, 'i');

  // If no deals exist yet, insert a small set of sample deals so the frontend shows content.
  const total = await Deal.countDocuments();
  if (total === 0) {
    const now = new Date();
    const samples = [
      {
        title: 'Sunrise Cafe - Breakfast Deal',
        description: 'Enjoy a 2-course breakfast at Sunrise Cafe.',
        category: 'restaurants',
        price: 7.99,
        image: '/images/sunrise.png',
        discount: '30% OFF',
        expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3) // 3 days
      },
      {
        title: 'Grand Hotel - Weekend Stay',
        description: '2-night weekend stay with breakfast included.',
        category: 'hotels',
        price: 129.00,
        image: '/images/hotel.png',
        discount: '40% OFF',
        expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7) // 7 days
      },
      {
        title: 'FlyAway - Discounted Flight',
        description: 'Save big on select routes this season.',
        category: 'airlines',
        price: 199.00,
        image: '/images/plane.png',
        discount: '25% OFF',
        expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10) // 10 days
      }
    ];
    try {
      await Deal.insertMany(samples);
    } catch (err) {
      console.error('Failed to insert sample deals', err);
    }
  }

  const deals = await Deal.find(filter).limit(100);
  res.json(deals);
});

// Admin create (simple - auth required; admin role expected)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const d = await Deal.create(req.body);
  res.status(201).json(d);
});

// Get single deal by ID
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin update deal
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin delete deal
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ message: 'Deal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
