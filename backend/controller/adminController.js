const User = require("../models/User");

const admin_get = (req, res) => {
  res.status(200).json(req.user);
};

const getAllUsers = async (req, res) => {
  const users = await User.findAllUsers();
  const usersNameEmailAndRole = users.map((user) => {
    return {id: user.id, username: user.username, email: user.email, role: user.role};
  });
  res.status(200).json(usersNameEmailAndRole);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await User.deleteUser(id);
  if (result) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  admin_get,
  getAllUsers,
  deleteUser,
};