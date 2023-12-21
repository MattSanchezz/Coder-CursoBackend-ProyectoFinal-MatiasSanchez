import { usersModel } from "../dao/modelos/users.model.js";

function createUserModel(data) {
  return new usersModel(data);
}

class UsersManager {
  async findById(id) {
    const response = await usersModel.findById(id);
    return response;
  }

  async findByEmail(email) {
    const response = await usersModel.findOne({ email });
    return response;
  }

  async createOne(obj) {
    const user = createUserModel(obj); 
    const response = await user.save();
    return response;
  }
}

export const usersManager = new UsersManager();