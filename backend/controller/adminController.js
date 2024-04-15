const admin_get = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  admin_get,
};