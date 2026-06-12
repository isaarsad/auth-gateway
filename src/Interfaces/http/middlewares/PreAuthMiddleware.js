import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

const PreAuthMiddleware = (getTokenManager) => async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid pre-auth token');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AuthenticationError('Token Invalid');
  }

  const authenticationTokenManager = getTokenManager();

  await authenticationTokenManager.verifyPreAuthToken(token);

  const { userId } = await authenticationTokenManager.decodePreAuthToken(token);

  req.userId = userId;

  next();
};

export default PreAuthMiddleware;
