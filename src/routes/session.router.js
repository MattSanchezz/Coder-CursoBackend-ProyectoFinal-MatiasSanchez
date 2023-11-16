import express from "express";
import { getCurrentUser } from "../controllers/session.controller.js";

const sessionRouter = express.Router();

sessionRouter.get("/current", getCurrentUser);

export default sessionRouter;