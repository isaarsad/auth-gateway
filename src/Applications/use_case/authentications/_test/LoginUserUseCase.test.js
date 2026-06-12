import UserRepository from '../../../../Domains/users/UserRepository.js';
import AuthenticationRepository from '../../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../../security/AuthenticationTokenManager.js';
import PasswordHash from '../../../security/PasswordHash.js';
import LoginUserUseCase from '../LoginUserUseCase.js';
import RoleRepository from '../../../../Domains/roles/RoleRepository.js';
import { vi } from 'vitest';

describe('LoginUserUseCase', () => {
  it('should throw error when user has no assigned role', async () => {
    // Arrange
    const useCasePayload = { username: 'arsad', password: 'secret' };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockRoleRepository = new RoleRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.getPasswordByUsername = vi.fn().mockResolvedValue('encrypted_password');
    mockPasswordHash.comparePassword = vi.fn().mockResolvedValue();
    mockUserRepository.getIdByUsername = vi.fn().mockResolvedValue('user-123');
    mockRoleRepository.getUserRoles = vi.fn().mockResolvedValue([]);

    mockAuthenticationTokenManager.createAccessToken = vi.fn();
    mockAuthenticationTokenManager.createRefreshToken = vi.fn();
    mockAuthenticationTokenManager.createPreAuthToken = vi.fn();
    mockAuthenticationRepository.addToken = vi.fn();

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      roleRepository: mockRoleRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action & Assert
    await expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrowError(
      'LOGIN_USER.NO_ROLE_ASSIGNED',
    );

    expect(mockAuthenticationTokenManager.createAccessToken).not.toBeCalled();
    expect(mockAuthenticationTokenManager.createRefreshToken).not.toBeCalled();
    expect(mockAuthenticationTokenManager.createPreAuthToken).not.toBeCalled();
    expect(mockAuthenticationRepository.addToken).not.toBeCalled();
  });

  it('should orchestrate login correctly and always return pre-auth token with available roles', async () => {
    // Arrange
    const useCasePayload = { username: 'arsad', password: 'secret' };
    const mockRoles = [{ roleId: 'role-123' }, { roleId: 'role-456' }];

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockRoleRepository = new RoleRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockUserRepository.getPasswordByUsername = vi.fn().mockResolvedValue('encrypted_password');
    mockPasswordHash.comparePassword = vi.fn().mockResolvedValue();
    mockUserRepository.getIdByUsername = vi.fn().mockResolvedValue('user-123');
    mockRoleRepository.getUserRoles = vi.fn().mockResolvedValue(mockRoles);
    mockAuthenticationTokenManager.createPreAuthToken = vi
      .fn()
      .mockResolvedValue('valid_pre_auth_token');

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      roleRepository: mockRoleRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const result = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(result).toEqual({
      preAuthToken: 'valid_pre_auth_token',
      availableRoles: mockRoles,
    });

    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('arsad');
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('arsad');
    expect(mockRoleRepository.getUserRoles).toBeCalledWith('user-123');
    expect(mockAuthenticationTokenManager.createPreAuthToken).toBeCalledWith({
      userId: 'user-123',
    });
  });
});
