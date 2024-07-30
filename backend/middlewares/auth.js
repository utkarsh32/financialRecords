const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(authHeader, 'jwt_secret_key');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(403);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user == null) return res.sendStatus(400);

  const validPassword = await user.validPassword(password);
  if (!validPassword) return res.sendStatus(400);

  const accessToken = jwt.sign({ username: user.username, id: user.id }, 'jwt_secret_key');
  res.json({ accessToken });
};

module.exports = { authenticateToken, login };
