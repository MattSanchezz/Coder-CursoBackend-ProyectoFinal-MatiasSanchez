import express from 'express';
import passport from 'passport';
import { getCurrentUser } from '../controllers/session.controller.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/authenticationMiddle.js';

const sessionRouter = express.Router();

sessionRouter.get('/current', isAuthenticated, getCurrentUser);

sessionRouter.post(
  '/login',
  isNotAuthenticated,
  passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

sessionRouter.post(
  '/signup',
  isNotAuthenticated,
  passport.authenticate('signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true,
  })
);

sessionRouter.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

sessionRouter.get('/login', isNotAuthenticated, (req, res) => {
});

sessionRouter.get('/signup', isNotAuthenticated, (req, res) => {
});

export default sessionRouter;
