const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  // req.user is populated by auth middleware (password excluded)
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  if (email && email !== req.user.email) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (typeof name === 'string') user.name = name;
  if (typeof email === 'string') user.email = email.toLowerCase();

  await user.save();

  res.json({
    message: 'Profile updated',
    user: { id: user._id, email: user.email, name: user.name, role: user.role }
  });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords required' });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  await user.save();

  res.json({ message: 'Password changed successfully' });
};
