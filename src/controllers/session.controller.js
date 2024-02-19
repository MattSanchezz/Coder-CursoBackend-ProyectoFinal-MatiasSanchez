import passport from 'passport';
import { usersManager } from '../dao/usersManager.js';
import { log } from '../logger.js';

async function loginUser(req, res) {
  passport.authenticate('login', {
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, async () => {
    try {
      const user = await usersManager.findById(req.user._id);
      user.last_connection = new Date();
      await user.save();
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

async function signupUser(req, res) {
  passport.authenticate('signup', {
    failureRedirect: '/signup',
    failureFlash: true,
  })(req, res, async () => {
    try {
      const user = await usersManager.findById(req.user._id);
      user.last_connection = new Date();
      await user.save();
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

function renderDashboard(req, res) {
  res.render('dashboard', { user: req.user });
}

function getCurrentUser(req, res) {
  if (req.isAuthenticated()) {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Usuario no autenticado',
      data: {},
    });
  }
}

export const handleLogin = async (req, res) => {
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

export { loginUser, signupUser, renderDashboard, getCurrentUser };
