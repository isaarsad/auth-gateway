import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware.js';

const createMenusRouter = (controller, getTokenManager) => {
  const router = express.Router();

  router.post('/', AuthMiddleware(getTokenManager), controller.postMenuController);
  router.get('/', AuthMiddleware(getTokenManager), controller.getRoleMenusController);
  router.post(
    '/menu-access',
    AuthMiddleware(getTokenManager),
    controller.postRoleMenuAccessController,
  );

  return router;
};

export default createMenusRouter;
