import { vi, describe, it, expect } from 'vitest';
import GetRolesUseCase from '../GetRolesUseCase.js';
import RoleRepository from '../../../../Domains/roles/RoleRepository.js';

describe('GetRolesUseCase', () => {
  it('should orchestrate the get roles action correctly', async () => {
    // Arrange

    const expectedRoles = [
      { id: 'role-123', roleName: 'Admin' },
      { id: 'role-456', roleName: 'User' },
    ];

    const mockRoleRepository = new RoleRepository();
    mockRoleRepository.getRoles = vi.fn().mockResolvedValue(expectedRoles);

    const getRolesUseCase = new GetRolesUseCase({
      roleRepository: mockRoleRepository,
    });

    // Action
    const actualRoles = await getRolesUseCase.execute();

    expect(actualRoles).toEqual(expectedRoles);
    expect(mockRoleRepository.getRoles).toBeCalledTimes(1);
  });

  it('should handle empty array correctly when no roles found', async () => {
    // Arrange: Paksa mock repo balikin array kosong
    const mockRoleRepository = new RoleRepository();
    mockRoleRepository.getRoles = vi.fn().mockResolvedValue([]);

    const getRolesUseCase = new GetRolesUseCase({
      roleRepository: mockRoleRepository,
    });

    // Action
    const actualRoles = await getRolesUseCase.execute();

    // Assert
    expect(actualRoles).toEqual([]);
    expect(mockRoleRepository.getRoles).toHaveBeenCalledTimes(1);
  });
});
