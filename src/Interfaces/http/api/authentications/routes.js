import express from 'express';
import PreAuthMiddleware from '../../middlewares/PreAuthMiddleware.js';

const createAuthenticationsRouter = (controller, getTokenManager) => {
  const router = express.Router();

  router.post('/', controller.postAuthenticationController);
  router.post('/role', PreAuthMiddleware(getTokenManager), controller.postSelectRoleController);
  router.put('/', controller.putAuthenticationController);
  router.delete('/', controller.deleteAuthenticationController);

  return router;
};

export default createAuthenticationsRouter;
