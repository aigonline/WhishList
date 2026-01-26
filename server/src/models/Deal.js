const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, index: true },
  // Accept either a numeric discount (percentage) or a string like '30% OFF'
  discount: { type: mongoose.Schema.Types.Mixed, required: true },
  originalPrice: { type: Number },
  discountedPrice: { type: Number },
  price: { type: Number }, // Legacy field for backward compatibility
  image: { type: String },
  imageUrl: { type: String }, // Preferred field name
  available: { type: Number, default: 1 },
  location: { type: String },
  store: { type: String },
  startDate: { type: Date },
  expiryDate: { type: Date },
  expiresAt: { type: Date }, // Legacy field for backward compatibility
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

dealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Deal', dealSchema);
