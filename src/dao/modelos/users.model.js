import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user',
  },
  documents: [
    {
      name: {
        type: String,
        required: false,
      },
      reference: {
        type: String,
        required: false,
      },
    },
  ],
  last_connection: {
    type: Date,
    default: null,
  },
});

export const usersModel = mongoose.model("Users", usersSchema);