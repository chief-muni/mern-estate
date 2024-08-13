exports.test = async(req, res) => {
  res.status(200).json({
    message: 'API is working well from routes to controller'
  });
};