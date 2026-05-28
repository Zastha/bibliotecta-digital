const AuthController = {
  async verificar(req, res) {
    try {
      return res.status(200).json({
        data: req.usuario,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  },
};

module.exports = AuthController;