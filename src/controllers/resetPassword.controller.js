import ResetPassword from '../dao/modelos/resetPassword.model.js';
import { verificarTokenResetPassword } from '../services/resetPassword.services.js';
import { updateUserPassword } from '../services/resetPassword.services.js';

export async function renderResetPasswordPage(req, res) {
  res.render('reset-password');
}

export async function handleResetPasswordRequest(req, res) {
  const { token, newPassword } = req.body;

  const { valid, userId } = await verificarTokenResetPassword(token);

  if (!valid) {
    return res.render('reset-password', { error: 'El token no es válido.' });
  }

  try {
    await updateUserPassword(userId, newPassword);

    await ResetPassword.deleteOne({ userId });

    res.render('reset-password', { success: 'Contraseña restablecida con éxito.' });
  } catch (error) {
    console.error('Error al manejar la solicitud de restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}