import express from 'express';
import passport from 'passport';
import { getCurrentUser } from '../controllers/session.controller.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/authenticationMiddle.js';
import { log } from '../logger.js';
import { usersManager } from '../dao/usersManager.js';

const sessionRouter = express.Router();

sessionRouter.get('/current', isAuthenticated, getCurrentUser);

sessionRouter.post(
  '/login',
  isNotAuthenticated,
  passport.authenticate('login', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    try {
      const user = await usersManager.findById(req.user._id);

      user.last_connection = new Date();
      await user.save();

      res.redirect('/dashboard');
    } catch (error) {
      log('ERROR', error.message);
      res.status(500).json({ error: 'Error al obtener la información del usuario' });
    }
  }
);

sessionRouter.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

sessionRouter.get('/login', isNotAuthenticated, (req, res) => {
});

sessionRouter.get('/signup', isNotAuthenticated, (req, res) => {
});

export default sessionRouter;
