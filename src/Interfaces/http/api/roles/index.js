import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';
import RolesController from './controller.js';
import createRolesRouter from './routes.js';

export default (container) => {
  const rolesController = new RolesController(container);

  const getTokenManager = () => container.getInstance(AuthenticationTokenManager.name);

  return createRolesRouter(rolesController, getTokenManager);
};
