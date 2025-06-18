const users = require('../data/users.json');

//To test data
exports.getAllUsers = (req, res) => {
  try {
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = (req, res) => {
  const { ssoid, password } = req.body;

  const user = users.find(u => u.ssoid === ssoid && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid ssoid or password' });
  }

  const token = `fake-jwt-token-for-${user.ssoid}`;
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      ssoid: user.ssoid
    }
  });
};
