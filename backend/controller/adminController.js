const User = require("../models/User");

const admin_get = async (req, res) => {
  const users = await User.findAllUsers();
  const usersNameEmailAndRole = users.map((user) => {
    return { username: user.username, email: user.email, role: user.role};
  });
  res.status(200).json({ usersNameEmailAndRole, user: req.user });
};

module.exports = {
  admin_get,
};