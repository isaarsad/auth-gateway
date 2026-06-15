import AssignMenuAccessUseCase from '../AssignMenuAccessUseCase.js';
import RoleRepository from '../../../../Domains/roles/RoleRepository.js';
import MenuRepository from '../../../../Domains/menus/MenuRepository.js';
import NotFoundError from '../../../../Commons/exceptions/NotFoundError.js';

describe('AssignMenuAccessUseCase', () => {
  it('should throw error and stop execution when role does not exist', async () => {
    // Arrange
    const useCasePayload = { roleId: 'role-fake', menuId: 'menu-123' };

    const mockRoleRepository = new RoleRepository();
    const mockMenuRepository = new MenuRepository();

    mockRoleRepository.verifyRoleExists = vi
      .fn()
      .mockRejectedValue(new NotFoundError('Role tidak ditemukan'));

    mockMenuRepository.verifyMenuExists = vi.fn();
    mockMenuRepository.addRoleMenuAccess = vi.fn();

    const assignMenuAccessUseCase = new AssignMenuAccessUseCase({
      roleRepository: mockRoleRepository,
      menuRepository: mockMenuRepository,
    });

    // Action & Assert
    await expect(assignMenuAccessUseCase.execute(useCasePayload)).rejects.toThrowError(
      NotFoundError,
    );

    expect(mockRoleRepository.verifyRoleExists).toBeCalledWith(useCasePayload.roleId);
    expect(mockMenuRepository.verifyMenuExists).not.toBeCalled();
    expect(mockMenuRepository.addRoleMenuAccess).not.toBeCalled();
  });

  it('should throw error and stop execution when menu does not exist', async () => {
    // Arrange
    const useCasePayload = { roleId: 'role-123', menuId: 'menu-fake' };

    const mockRoleRepository = new RoleRepository();
    const mockMenuRepository = new MenuRepository();

    mockRoleRepository.verifyRoleExists = vi.fn().mockResolvedValue();
    mockMenuRepository.verifyMenuExists = vi
      .fn()
      .mockRejectedValue(new NotFoundError('Menu tidak ditemukan'));

    mockMenuRepository.addRoleMenuAccess = vi.fn();

    const assignMenuAccessUseCase = new AssignMenuAccessUseCase({
      roleRepository: mockRoleRepository,
      menuRepository: mockMenuRepository,
    });

    // Action & Assert
    await expect(assignMenuAccessUseCase.execute(useCasePayload)).rejects.toThrowError(
      NotFoundError,
    );

    expect(mockRoleRepository.verifyRoleExists).toBeCalledWith(useCasePayload.roleId);
    expect(mockMenuRepository.verifyMenuExists).toBeCalledWith(useCasePayload.menuId);
    expect(mockMenuRepository.addRoleMenuAccess).not.toBeCalled();
  });

  it('should orchestrate the assign menu access action correctly', async () => {
    // Arrange
    const useCasePayload = { roleId: 'role-123', menuId: 'menu-123' };

    const mockRoleRepository = new RoleRepository();
    const mockMenuRepository = new MenuRepository();

    // Skenario: Semua valid
    mockRoleRepository.verifyRoleExists = vi.fn().mockResolvedValue();
    mockMenuRepository.verifyMenuExists = vi.fn().mockResolvedValue();
    mockMenuRepository.addRoleMenuAccess = vi.fn().mockResolvedValue();

    const assignMenuAccessUseCase = new AssignMenuAccessUseCase({
      roleRepository: mockRoleRepository,
      menuRepository: mockMenuRepository,
    });

    // Action
    await assignMenuAccessUseCase.execute(useCasePayload);

    // Assert
    expect(mockRoleRepository.verifyRoleExists).toBeCalledWith(useCasePayload.roleId);
    expect(mockMenuRepository.verifyMenuExists).toBeCalledWith(useCasePayload.menuId);
    expect(mockMenuRepository.addRoleMenuAccess).toBeCalledWith(
      useCasePayload.roleId,
      useCasePayload.menuId,
    );
  });
});
