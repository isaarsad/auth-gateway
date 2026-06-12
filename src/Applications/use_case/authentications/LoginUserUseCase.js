import UserLogin from '../../../Domains/users/entities/UserLogin.js';

class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
    roleRepository,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
    this._roleRepository = roleRepository;
  }

  async execute(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    // Verify credential
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._passwordHash.comparePassword(password, encryptedPassword);
    const userId = await this._userRepository.getIdByUsername(username);

    const roles = await this._roleRepository.getUserRoles(userId);

    if (roles.length === 0) {
      throw new Error('LOGIN_USER.NO_ROLE_ASSIGNED');
    }

    const preAuthToken = await this._authenticationTokenManager.createPreAuthToken({
      userId,
    });

    return {
      preAuthToken,
      availableRoles: roles,
    };
  }
}

export default LoginUserUseCase;
