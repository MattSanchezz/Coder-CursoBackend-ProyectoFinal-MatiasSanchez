import UserModel from '../dao/modelos/users.model.js';

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { name: 1, email: 1, role: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    res.status(200).json({ message: 'Rol de usuario actualizado correctamente', user });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
