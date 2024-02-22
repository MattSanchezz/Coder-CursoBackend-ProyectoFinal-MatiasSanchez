import logger from '../logger.cjs';

const {log} = logger;

export const debugLog = (req, res) => {
  log('DEBUG', 'Este es un mensaje de debug para /loggerTest/debug');
  res.send('Mensaje de debug enviado. Verifica tus logs.');
};

export const infoLog = (req, res) => {
  log('INFO', 'Este es un mensaje de info para /loggerTest/info');
  res.send('Mensaje de info enviado. Verifica tus logs.');
};

export const warningLog = (req, res) => {
  log('WARNING', 'Este es un mensaje de advertencia para /loggerTest/warning');
  res.send('Mensaje de advertencia enviado. Verifica tus logs.');
};

export const errorLog = (req, res) => {
  log('ERROR', 'Este es un mensaje de error para /loggerTest/error');
  res.send('Mensaje de error enviado. Verifica tus logs.');
};

export const fatalLog = (req, res) => {
  log('FATAL', 'Este es un mensaje fatal para /loggerTest/fatal');
  res.send('Mensaje fatal enviado. Verifica tus logs.');
};
