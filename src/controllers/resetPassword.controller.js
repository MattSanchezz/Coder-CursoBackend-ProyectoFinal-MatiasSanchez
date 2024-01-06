import ResetPassword from '../dao/modelos/resetPassword.model.js';

const resetInfo = new ResetPassword({
  userId: usuario._id,
  token: tokenGenerado,
  expiration: new Date(Date.now() + 3600000),
});

await resetInfo.save();
