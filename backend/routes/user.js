const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { login } = require('../middlewares/auth')
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ username, password });

    const token = jwt.sign({ id: user.id, username: user.username }, 'jwt_secret_key', {
      expiresIn: '1h',
    });

    res.json({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', login);

module.exports = router;
