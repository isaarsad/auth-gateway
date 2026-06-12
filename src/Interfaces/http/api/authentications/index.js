import AuthenticationsController from './controller.js';
import createAuthenticationsRouter from './routes.js';
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';

export default (container) => {
  const authenticationsController = new AuthenticationsController(container);

  const getTokenManager = () => container.getInstance(AuthenticationTokenManager.name);

  return createAuthenticationsRouter(authenticationsController, getTokenManager);
};
