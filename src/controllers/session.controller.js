export const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({
        status: "success",
        data: {
          user: req.user,
        },
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Usuario no autenticado",
        data: {},
      });
    }
  };