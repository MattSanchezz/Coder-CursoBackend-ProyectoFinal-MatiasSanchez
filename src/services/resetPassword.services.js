import ResetPassword from '../dao/modelos/resetPassword.model.js';

export const generarNuevoEnlace = async (userId) => {
  try {
    await ResetPassword.deleteMany({ userId });

    const token = generarTokenUnico();
    const expiration = new Date(Date.now() + 3600000);

    const resetInfo = new ResetPassword({
      userId,
      token,
      expiration,
    });

    await resetInfo.save();

    return { token, expiration };
  } catch (error) {
    console.error('Error al generar nuevo enlace:', error);
    throw error;
  }
};

const generarTokenUnico = () => {
  return Math.random().toString(36).substring(7);
};

export const verificarTokenResetPassword = async (token) => {
  try {
    const resetInfo = await ResetPassword.findOne({ token });

    if (resetInfo && resetInfo.expiration > Date.now()) {
      return { valid: true, userId: resetInfo.userId };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error('Error verificando token de restablecimiento de contraseña:', error);
    throw error;
  }
};

export const updateUserPassword = async (userId, newPassword) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.password = newPassword;
    await user.save();

    await ResetPassword.deleteMany({ userId });

    return true;
  } catch (error) {
    console.error('Error al actualizar la contraseña del usuario:', error);
    throw error;
  }
};
