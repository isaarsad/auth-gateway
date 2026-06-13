import RoleRepository from '../RoleRepository.js';

describe('RoleRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const roleRepository = new RoleRepository();

    // Action and Assert
    await expect(roleRepository.addRole({})).rejects.toThrow(
      'ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(roleRepository.getRoles()).rejects.toThrow(
      'ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(roleRepository.getRoleById('')).rejects.toThrow(
      'ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(roleRepository.getUserRoles('')).rejects.toThrow(
      'ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(roleRepository.verifyUserRole('', '')).rejects.toThrow(
      'ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
