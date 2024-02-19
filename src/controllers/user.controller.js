import usersManager from "../dao/usersManager.js";
import CartManagerMongo from "../dao/CartManagerMongo.js";
import UserModel from '../dao/modelos/users.model.js';
import { sendInactiveUserEmail } from '../services/email.service.js';
import moment from 'moment';

async function deleteUser(req, res, next) {
  try {
    const id = req.user._id;
    
    req.logout(async function (err){
      if (err) {
        return next(err);
      }
      await usersManager.deleteById(id);

      const foundCart = await CartManagerMongo.getByFilter({ userId: id });

      await CartManagerMongo.deleteById(foundCart._id);

      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    next(error);
  }
}

async function updateCurrentUser(req, res, next){
  try {
    const updatedUser = userManager.updateById(req.user._id, req.body)

    res.status(200).send({message: updatedUser})
  } catch (error) {
    next(error)
  }
}

async function createPremiumUser(req, res, next) {
  try {
    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      role: 'premium',
    };

    const createdUser = await usersManager.createOne(newUser);

    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
}

async function cambiarRolUsuario(req, res, next) {
  try {
    const { uid } = req.params;
    const { nuevoRol } = req.body;

    if (nuevoRol !== 'user' && nuevoRol !== 'premium') {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const usuario = await usersManager.findById(uid);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (nuevoRol === 'premium' && !usuario.documentsUploaded) {
      return res.status(403).json({ error: 'Debes cargar los documentos requeridos para ser premium' });
    }

    usuario.role = nuevoRol;
    await usuario.save();

    log('INFO', `Rol de usuario ${usuario.email} cambiado a ${nuevoRol}`);

    res.status(200).json({ message: 'Rol de usuario actualizado con éxito' });
  } catch (error) {
    next(error);
  }
}
const getUsers = async (req, res) => {
  try {
      const users = await UserModel.find({}, { name: 1, email: 1, role: 1 });

      if (!users || users.length === 0) {
          return res.status(404).json({ message: 'No se encontraron usuarios.' });
      }

      res.status(200).json(users);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const deleteInactiveUsers = async (req, res) => {
  try {
      const twoDaysAgo = moment().subtract(2, 'days').toDate();

      const result = await UserModel.deleteMany({ lastConnection: { $lt: twoDaysAgo } });

      result.deletedCount && sendInactiveUserEmail();
      res.status(200).json({ message: 'Usuarios inactivos eliminados con éxito.' });
  } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export { deleteUser, updateCurrentUser, createPremiumUser, cambiarRolUsuario, getUsers, deleteInactiveUsers };