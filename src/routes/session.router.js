import express from 'express';
import { renderDashboard, signupUser, loginUser, getCurrentUser, handleLogin } from '../controllers/session.controller.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/authenticationMiddle.js';

const sessionRouter = express.Router();

sessionRouter.get('/current', isAuthenticated, getCurrentUser);

sessionRouter.post('/login', isNotAuthenticated, handleLogin, loginUser);

sessionRouter.post('/signup', isNotAuthenticated, signupUser);

sessionRouter.get('/dashboard', isAuthenticated, renderDashboard);

sessionRouter.get('/login', isNotAuthenticated, (req, res) => {
});

sessionRouter.get('/signup', isNotAuthenticated, (req, res) => {
});

export default sessionRouter;
