import { vi } from 'vitest';
import RegisterUser from '../../../../Domains/users/entities/RegisterUser.js';
import RegisteredUser from '../../../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../../../Domains/users/UserRepository.js';
import PasswordHash from '../../../security/PasswordHash.js';
import RoleRepository from '../../../../Domains/roles/RoleRepository.js';
import AddUserUseCase from '../AddUserUseCase.js';
import InvariantError from '../../../../Commons/exceptions/InvariantError.js';

describe('AddUserUseCase', () => {
  it('should orchestrate the add user action correctly with multiple roles', async () => {
    // Arrange
    const useCasePayload = {
      username: 'arsad',
      password: 'secret',
      fullname: 'Isa Arsad',
      roleIds: ['role-123', 'role-456'],
    };

    const mockRegisteredUser = {
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    };

    // Creating dependencies
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // Mocking needed functions
    mockUserRepository.verifyAvailableUsername = vi.fn().mockResolvedValue();
    mockPasswordHash.hash = vi.fn().mockResolvedValue('encrypted_password');
    mockUserRepository.addUser = vi.fn().mockResolvedValue(mockRegisteredUser);

    // Creating use case instance
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: mockRegisteredUser.id,
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
        roleIds: useCasePayload.roleIds,
      }),
    );
  });

  it('should throw error when username not available', async () => {
    // Arrange
    const useCasePayload = {
      username: 'arsad',
      password: 'secret',
      fullname: 'Isa Arsad',
      roleIds: ['role-123'],
    };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockRoleRepository = new RoleRepository();

    mockUserRepository.verifyAvailableUsername = vi
      .fn()
      .mockRejectedValue(new InvariantError('USERNAME_NOT_AVAILABLE'));
    mockPasswordHash.hash = vi.fn().mockResolvedValue('encrypted_password');
    mockUserRepository.addUser = vi.fn();
    mockRoleRepository.addUserRole = vi.fn();

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      roleRepository: mockRoleRepository,
    });

    // Action & Assert
    await expect(addUserUseCase.execute(useCasePayload)).rejects.toThrow(InvariantError);

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).not.toBeCalled();
    expect(mockUserRepository.addUser).not.toBeCalled();
    expect(mockRoleRepository.addUserRole).not.toBeCalled();
  });
});
