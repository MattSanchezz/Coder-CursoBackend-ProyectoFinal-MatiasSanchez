import express from 'express';
import isAdmin from '../middleware/checkUserMiddle.js';
import { getUsers, updateUserRole, deleteUser } from '../controllers/admin.controller.js';

const AdminRouter = express.Router();

AdminRouter.use(isAdmin);

AdminRouter.get('/', getUsers);

AdminRouter.post('/:userId', updateUserRole);

AdminRouter.delete('/:userId', deleteUser);

export default AdminRouter;
