import Menu from '../../../Domains/menus/entities/Menu.js';

class GetRoleMenusUseCase {
  constructor({ menuRepository }) {
    this._menuRepository = menuRepository;
  }

  async execute(useCasePayload) {
    const { roleId } = useCasePayload;

    if (!roleId) {
      throw new Error('GET_ROLE_MENUS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof roleId !== 'string') {
      throw new Error('GET_ROLE_MENUS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const flatMenus = await this._menuRepository.getMenusByRoleId(roleId);

    const menuTree = [];
    const menuMap = {};

    for (const menuData of flatMenus) {
      const menu = new Menu(menuData);

      menuMap[menu.id] = { ...menu, children: [] };
    }

    for (const menu of flatMenus) {
      if (menu.parentId === null) {
        menuTree.push(menuMap[menu.id]);
      } else {
        if (menuMap[menu.parentId]) {
          menuMap[menu.parentId].children.push(menuMap[menu.id]);
        } else {
          menuTree.push(menuMap[menu.id]);
        }
      }
    }

    return menuTree;
  }
}

export default GetRoleMenusUseCase;
