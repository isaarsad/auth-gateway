import NewAuthentication from '../../../Domains/authentications/entities/NewAuthentication.js';
import SelectRole from '../../../Domains/authentications/entities/SelectRole.js';

class SelectRoleUseCase {
  constructor({ roleRepository, authenticationTokenManager, authenticationRepository }) {
    this._roleRepository = roleRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const selectRole = new SelectRole(useCasePayload);
    const { userId, roleId } = selectRole;

    await this._roleRepository.verifyUserRole(userId, roleId);

    const accessToken = await this._authenticationTokenManager.createAccessToken({
      userId,
      roleId,
    });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({
      userId,
      roleId,
    });

    await this._authenticationRepository.addToken(refreshToken);

    return new NewAuthentication({
      accessToken,
      refreshToken,
    });
  }
}

export default SelectRoleUseCase;
