class MenuRepository {
  async addMenu(_payload) {
    throw new Error('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getMenus() {
    throw new Error('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getMenuById(_id) {
    throw new Error('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getMenusByRoleId(_roleId) {
    throw new Error('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addRoleMenuAccess(_roleId, _menuId) {
    throw new Error('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  async verifyMenuExists(_menuId) {
    throw new Error('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default MenuRepository;
