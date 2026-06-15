import AddMenuUseCase from '../../../../Applications/use_case/menus/AddMenuUseCase.js';

class MenusController {
  constructor(container) {
    this._container = container;

    this.postMenuController = this.postMenuController.bind(this);
  }

  async postMenuController(req, res) {
    const addMenuUseCase = this._container.getInstance(AddMenuUseCase.name);
    const addedMenu = await addMenuUseCase.execute(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        addedMenu,
      },
    });
  }
}

export default MenusController;
