const admin_get = (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard", user: req.user });
};

module.exports = {
  admin_get,
};