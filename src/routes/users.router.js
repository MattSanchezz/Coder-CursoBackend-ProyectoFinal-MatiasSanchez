import { Router } from "express";
import UserDTO from "../dto/user.dto.js";
import { usersManager } from "../managers/usersManager.js";
import passport from "passport";
import { log } from "../logger.js";
import { cambiarRolUsuario, getUsers, deleteInactiveUsers } from '../controllers/user.controller.js';
import { documentController } from "../controllers/document.controller.js";

const UserRouter = Router();

UserRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

UserRouter.get(
  "/github",
  passport.authenticate("github", {
    failureRedirect: "/error",
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/home");
  }
);

UserRouter.get("/current", async (req, res) => {
  try {
    const currentUser = req.session.user;

    const userDTO = new UserDTO(currentUser);

    res.json(userDTO);
  } catch (error) {
    log('ERROR', error.message);
    res.status(500).json({ error: 'Error al obtener la información del usuario' });
  }
});

UserRouter.put('/:uid', cambiarRolUsuario);

UserRouter.get("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const user = await usersManager.getById(idUser);
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

UserRouter.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/home",
    failureRedirect: "/error",
  })
);

UserRouter.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/error",
  })
);

UserRouter.get('/logout', (req, res) => {
  req.session.destroy(()=>{
    req.redirect("/");
  });
});

UserRouter.post("/:uid/documents", async (req, res) => {
  const { uid } = req.params;

  try {
    const result = await documentController.uploadDocument(uid, req.file);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el documento.' });
  }
});

UserRouter.post("/:uid/documents", checkUserRole('premium'), uploadDocument, uploadDocuments);

UserRouter.post("/:uid/profile-image", checkUserRole('user', 'premium'), uploaderProfile.single("profileImage"), uploadProfileImage);

UserRouter.post("/:uid/product-image", checkUserRole('admin'), uploaderProduct.single("productImage"), uploadProductImage);

UserRouter.get('/', getUsers);

UserRouter.delete('/', deleteInactiveUsers);

export default UserRouter;
