import Menu from '../../../Domains/menus/entities/Menu.js';

class GetMenusUseCase {
  constructor({ menuRepository }) {
    this._menuRepository = menuRepository;
  }

  async execute() {
    const flatMenus = await this._menuRepository.getMenus();

    const menuTree = [];
    const menuMap = {};

    for (const menuData of flatMenus) {
      const menu = new Menu(menuData);
      menuMap[menu.id] = { ...menu, children: [] };
    }

    for (const menuData of flatMenus) {
      const menu = new Menu(menuData);

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

export default GetMenusUseCase;
