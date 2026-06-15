import Menu from '../../../Domains/menus/entities/Menu.js';
import NewMenu from '../../../Domains/menus/entities/NewMenu.js';

class AddMenuUseCase {
  constructor({ menuRepository }) {
    this._menuRepository = menuRepository;
  }

  async execute(useCasePayload) {
    const newMenu = new NewMenu(useCasePayload);

    if (newMenu.parentId !== null) {
      await this._menuRepository.verifyMenuExists(newMenu.parentId);
    }

    const addedMenu = await this._menuRepository.addMenu(newMenu);

    return new Menu(addedMenu);
  }
}

export default AddMenuUseCase;
