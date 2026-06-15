import MenuRepository from '../MenuRepository.js';

describe('MenuRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const menuRepository = new MenuRepository();

    // Action and Assert
    await expect(menuRepository.addMenu({})).rejects.toThrow(
      'MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(menuRepository.getMenus()).rejects.toThrow(
      'MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(menuRepository.getMenuById('')).rejects.toThrow(
      'MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(menuRepository.getMenusByRoleId('')).rejects.toThrow(
      'MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(menuRepository.addRoleMenuAccess('', '')).rejects.toThrow(
      'MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(menuRepository.verifyMenuExists('')).rejects.toThrow(
      'MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
