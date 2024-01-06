import mongoose from 'mongoose';

const resetPasswordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  expiration: { type: Date, required: true },
});

const ResetPassword = mongoose.model('ResetPassword', resetPasswordSchema);

export default ResetPassword;
