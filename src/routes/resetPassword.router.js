import express from 'express';
import { generarNuevoEnlace, verificarTokenResetPassword } from '../services/resetPassword.services.js';

const resetRouter = express.Router();

resetRouter.get('/reset-password', async (req, res) => {
  const token = req.query.token;

  try {
    const { valid, userId } = await verificarTokenResetPassword(token);

    if (valid) {
      res.render('reset-password-form', { userId, token });
    } else {
      res.redirect('/generate-new-link');
    }
  } catch (error) {
    console.error('Error al verificar token de restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

resetRouter.get('/generate-new-link', async (req, res) => {
  try {
    const userId = req.user.id;
    const nuevoEnlace = await generarNuevoEnlace(userId);
    res.redirect(`/reset-password?token=${nuevoEnlace.token}`);
  } catch (error) {
    console.error('Error al generar nuevo enlace:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default resetRouter;
