import { Router } from "express";
import UserDTO from "../dto/user.dto.js";
import { usersManager } from "../managers/usersManager.js";
import passport from "passport";
import { log } from "../logger.js";

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

export default UserRouter;