import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager.js';
import MenusController from './controller.js';
import createMenusRouter from './routes.js';

export default (container) => {
  const menusController = new MenusController(container);

  const getTokenManager = () => container.getInstance(AuthenticationTokenManager.name);

  return createMenusRouter(menusController, getTokenManager);
};
