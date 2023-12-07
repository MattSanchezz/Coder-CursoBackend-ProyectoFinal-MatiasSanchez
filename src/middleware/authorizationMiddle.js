export const checkAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized. Please log in.",
        data: {},
      });
    }
  };

export const checkUserRole = (requiredRole) => {
    return (req, res, next) => {
      try {
        const user = req.user;
  
        if (!user || !user.role) {
          return res.status(403).json({ error: 'Acceso no autorizado' });
        }
  
        if (user.role === requiredRole) {
          next();
        } else {
          return res.status(403).json({ error: 'Acceso no autorizado' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error de autorización' });
      }
    };
  };