export const isLoggedIn = (req, res, next) => {
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
          log('ERROR', 'Acceso no autorizado: Usuario o rol no encontrados');
          return res.status(403).json({ error: 'Acceso no autorizado' });
        }
  
        if (user.role === requiredRole) {
          next();
        } else {
          log('ERROR', 'Acceso no autorizado: Rol incorrecto');
          return res.status(403).json({ error: 'Acceso no autorizado' });
        }
      } catch (error) {
        log('ERROR', `Error de autorización: ${error.message}`);
        res.status(500).json({ error: 'Error de autorización' });
      }
    };
  };