import express from "express";
import { getCurrentUser } from "../controllers/session.controller.js";
import { checkAuthenticatedUser } from "../middleware/authorizationMiddle.js";

const sessionRouter = express.Router();

sessionRouter.get("/current", checkAuthenticatedUser, getCurrentUser);

export default sessionRouter;