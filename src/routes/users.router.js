import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
//import { compareData, hashData } from "../utils.js";
import passport from "passport";
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

/*
UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDB = await usersManager.findByEmail(email);
  if (!userDB) {
    return res.json({ error: "This email does not exist" });
  }

  const comparePassword = await compareData(password, userDB.password);
  if (!comparePassword) {
    return res.json({ error: "Email or password do not match" });
  }

  req.session["email"] = email;
  req.session["first_name"] = userDB.first_name;
  req.session("isAdmin") =
    email === "adminCoder@coder.com" && password === "Cod3r123" ? true : false;
  req.session["isAdmin"];
  
  res.redirect("/home");
});

UserRouter.post("/signup", async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await hashData(password);
  const createdUser = await usersManager.createOne({
    ...req.body,
    password: hashedPassword,
  })
  res.status(200).json({ message: "User created", createdUser });
}); */

UserRouter.get('/logout', (req, res) => {
  req.session.destroy(()=>{
    req.redirect("/");
  });
});
export default router;