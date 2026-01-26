const express = require('express');
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Disable helmet for development to allow CDN scripts and inline styles
// app.use(helmet({
//   contentSecurityPolicy: false,
// }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/images', express.static(path.join(__dirname, '../../images')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const dealRoutes = require('./routes/dealRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/deals', dealRoutes);

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
// (No duplicate declarations below; `app` exported above)