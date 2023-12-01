import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userManager from "../dao/usersManager";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (username, password, done) => {
      try {
        if (
          username === "adminCoder@coder.com" &&
          password === "adminCod3r123"
        ) {
          let result = {
            _id: "5f1b866d93b18e001d2e6821",
            email: "adminCoder@coder.com",
            age: 9,
            first_name: "Coder",
            last_name: "House",
            role: "admin",
          };

          return done(null, result);
        } else {
          let foundUser = await userManager.getByFilter({ email: username });

          if (!foundUser || foundUser.oauthUser || !foundUser.matchPasswords(password)) {
            return done(null, false);
          }

          delete foundUser._doc.password;

          return done(null, foundUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  if (id === "5f1b866d93b18e001d2e6821") {
    let result = {
      _id: "5f1b866d93b18e001d2e6821",
      email: "adminCoder@coder.com",
      age: 9,
      first_name: "Coder",
      last_name: "House",
      role: "admin",
    };

    return done(null, result);
  } else {
    const user = await userManager.getById(id);
    delete user._doc.password; 
    done(null, user);
  }
});