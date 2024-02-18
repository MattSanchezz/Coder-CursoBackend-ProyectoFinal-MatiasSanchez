import express from 'express';
import { renderResetPasswordPage, handleResetPasswordRequest } from '../controllers/resetPassword.controller.js';

const resetRouter = express.Router();

resetRouter.get('/reset-password', renderResetPasswordPage);

resetRouter.post('/reset-password', handleResetPasswordRequest);

resetRouter.get('/generate-new-link', async (req, res) => {
  try {
    const userId = req.user.id;
    const nuevoEnlace = await generarNuevoEnlace(userId);
    res.render('generate-new-link', { nuevoEnlace });
  } catch (error) {
    console.error('Error al generar nuevo enlace:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default resetRouter;
