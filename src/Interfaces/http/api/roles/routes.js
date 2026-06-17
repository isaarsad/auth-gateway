import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware.js';

const createRolesRouter = (controller, getTokenManager) => {
  const router = express.Router();

  router.post('/', AuthMiddleware(getTokenManager), controller.postRoleController);
  router.get('/', AuthMiddleware(getTokenManager), controller.getRolesController);

  return router;
};

export default createRolesRouter;
