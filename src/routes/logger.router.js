import { Router } from 'express';
import { debugLog, infoLog, warningLog, errorLog, fatalLog } from '../controllers/logger.controller.js';

const loggerTestRouter = Router();

loggerTestRouter.get('/debug', debugLog);
loggerTestRouter.get('/info', infoLog);
loggerTestRouter.get('/warning', warningLog);
loggerTestRouter.get('/error', errorLog);
loggerTestRouter.get('/fatal', fatalLog);

export default loggerTestRouter;