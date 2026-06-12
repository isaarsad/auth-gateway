import { vi, describe, it, expect } from 'vitest';
import SelectRoleUseCase from '../SelectRoleUseCase.js';
import RoleRepository from '../../../../Domains/roles/RoleRepository.js';
import AuthenticationTokenManager from '../../../security/AuthenticationTokenManager.js';
import AuthenticationRepository from '../../../../Domains/authentications/AuthenticationRepository.js';
import NewAuthentication from '../../../../Domains/authentications/entities/NewAuthentication.js';
import AuthorizationError from '../../../../Commons/exceptions/AuthorizationError.js';

describe('SelectRoleUseCase', () => {
  it('should throw error when user tries to select an unassigned role', async () => {
    // Arrange
    const useCasePayload = { userId: 'user-123', roleId: 'role-fake' };

    const mockRoleRepository = new RoleRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockAuthenticationRepository = new AuthenticationRepository();

    mockRoleRepository.verifyUserRole = vi
      .fn()
      .mockRejectedValue(new AuthorizationError('Anda tidak berhak mengakses role ini'));
    mockAuthenticationTokenManager.createAccessToken = vi.fn().mockResolvedValue();
    mockAuthenticationTokenManager.createRefreshToken = vi.fn().mockResolvedValue();
    mockAuthenticationRepository.addToken = vi.fn().mockResolvedValue();

    const selectRoleUseCase = new SelectRoleUseCase({
      roleRepository: mockRoleRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action & Assert
    await expect(selectRoleUseCase.execute(useCasePayload)).rejects.toThrowError(
      AuthorizationError,
    );

    expect(mockRoleRepository.verifyUserRole).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.roleId,
    );
    expect(mockAuthenticationTokenManager.createAccessToken).not.toBeCalled();
    expect(mockAuthenticationTokenManager.createRefreshToken).not.toBeCalled();
    expect(mockAuthenticationRepository.addToken).not.toBeCalled();
  });

  it('should orchestrate the select role action correctly', async () => {
    // Arrange
    const useCasePayload = { userId: 'user-123', roleId: 'role-123' };
    const expectedAuth = new NewAuthentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockRoleRepository = new RoleRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockAuthenticationRepository = new AuthenticationRepository();

    // Skenario: Semua jalan mulus
    mockRoleRepository.verifyUserRole = vi.fn().mockResolvedValue();
    mockAuthenticationTokenManager.createAccessToken = vi
      .fn()
      .mockResolvedValue(expectedAuth.accessToken);
    mockAuthenticationTokenManager.createRefreshToken = vi
      .fn()
      .mockResolvedValue(expectedAuth.refreshToken);
    mockAuthenticationRepository.addToken = vi.fn().mockResolvedValue();

    const selectRoleUseCase = new SelectRoleUseCase({
      roleRepository: mockRoleRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    const result = await selectRoleUseCase.execute(useCasePayload);

    // Assert
    expect(result).toEqual(expectedAuth);
    expect(mockRoleRepository.verifyUserRole).toBeCalledWith('user-123', 'role-123');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      userId: 'user-123',
      roleId: 'role-123',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      userId: 'user-123',
      roleId: 'role-123',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(expectedAuth.refreshToken);
  });
});
