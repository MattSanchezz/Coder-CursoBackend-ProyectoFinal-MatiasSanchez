import ResetPassword from '../dao/modelos/resetPassword.model.js';
import { verificarTokenResetPassword } from '../services/resetPasswordService.js';

async function renderResetPasswordPage(req, res) {
  res.render('reset-password');
}

async function handleResetPasswordRequest(req, res) {
  const { token, newPassword } = req.body;

  const { valid, userId } = await verificarTokenResetPassword(token);

  if (!valid) {
    return res.render('reset-password', { error: 'El token no es válido.' });
  }

  await updateUserPassword(userId, newPassword);

  await ResetPassword.deleteOne({ userId });

  res.render('reset-password', { success: 'Contraseña restablecida con éxito.' });
}

export { renderResetPasswordPage, handleResetPasswordRequest };
