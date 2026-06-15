import InvariantError from '../../../../Commons/exceptions/InvariantError.js';
import RoleRepository from '../../../../Domains/roles/RoleRepository.js';
import AddRoleUseCase from '../AddRoleUseCase.js';

describe('AddRoleUseCase', () => {
  it('should orchestrate add role correctly', async () => {
    // Arrange
    const payload = { roleName: 'admin' };

    const expectedAddedRole = {
      id: 'role-123',
      roleName: payload.roleName,
    };

    const mockRoleRepository = new RoleRepository();

    mockRoleRepository.verifyAvailableRoleName = vi.fn().mockResolvedValue();
    mockRoleRepository.addRole = vi.fn().mockResolvedValue(expectedAddedRole);

    const addRoleUseCase = new AddRoleUseCase({ roleRepository: mockRoleRepository });

    // Action
    const registeredRole = await addRoleUseCase.execute(payload);

    // Assert
    expect(mockRoleRepository.verifyAvailableRoleName).toBeCalledWith(payload.roleName);
    expect(mockRoleRepository.addRole).toBeCalledWith({
      roleName: payload.roleName,
    });
    expect(registeredRole).toStrictEqual(expectedAddedRole);
  });

  it('should throw an error when role name already exist', async () => {
    // Arrange
    const payload = { roleName: 'admin' };

    const mockRoleRepository = new RoleRepository();

    mockRoleRepository.verifyAvailableRoleName = vi
      .fn()
      .mockRejectedValue(new InvariantError('nama role tidak tersedia'));
    mockRoleRepository.addRole = vi.fn();

    const addRoleUseCase = new AddRoleUseCase({ roleRepository: mockRoleRepository });

    // Action & Assert
    await expect(addRoleUseCase.execute(payload)).rejects.toThrowError('nama role tidak tersedia');

    expect(mockRoleRepository.verifyAvailableRoleName).toBeCalledWith(payload.roleName);
    expect(mockRoleRepository.addRole).not.toBeCalled();
  });
});
