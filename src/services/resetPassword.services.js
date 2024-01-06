
import ResetPassword from '../dao/modelos/resetPassword.model.js';

export const generarNuevoEnlace = async (userId) => {
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
