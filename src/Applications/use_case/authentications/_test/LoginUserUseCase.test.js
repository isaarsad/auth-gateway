import UserRepository from '../../../../Domains/users/UserRepository.js';
import AuthenticationRepository from '../../../../Domains/authentications/AuthenticationRepository.js';
import AuthenticationTokenManager from '../../../security/AuthenticationTokenManager.js';
import PasswordHash from '../../../security/PasswordHash.js';
import LoginUserUseCase from '../LoginUserUseCase.js';
import NewAuthentication from '../../../../Domains/authentications/entities/NewAuthentication.js';
import { vi } from 'vitest';

describe('GetAuthenticationUseCase', () => {
  it('should orchestrate the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'arsad',
      password: 'secret',
    };
    const mockedAuthentication = new NewAuthentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPasswordByUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = vi.fn().mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken));
    mockUserRepository.getIdByUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = vi.fn().mockImplementation(() => Promise.resolve());

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(
      new NewAuthentication({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
    );
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('arsad');
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('arsad');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'arsad',
      id: 'user-123',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'arsad',
      id: 'user-123',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(mockedAuthentication.refreshToken);
  });
});
