import AddMenuUseCase from '../../../../Applications/use_case/menus/AddMenuUseCase.js';
import AssignMenuAccessUseCase from '../../../../Applications/use_case/menus/AssignMenuAccessUseCase.js';
import GetMenusUseCase from '../../../../Applications/use_case/menus/GetMenusUseCase.js';
import GetRoleMenusUseCase from '../../../../Applications/use_case/menus/GetRoleMenusUseCase.js';

class MenusController {
  constructor(container) {
    this._container = container;

    this.postMenuController = this.postMenuController.bind(this);
    this.getRoleMenusController = this.getRoleMenusController.bind(this);
    this.getMenusController = this.getMenusController.bind(this);
    this.postRoleMenuAccessController = this.postRoleMenuAccessController.bind(this);
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

  async getRoleMenusController(req, res) {
    const { roleId } = req.user;

    const getRoleMenusUseCase = this._container.getInstance(GetRoleMenusUseCase.name);
    const menus = await getRoleMenusUseCase.execute({ roleId });

    res.status(200).json({
      status: 'success',
      data: {
        menus,
      },
    });
  }

  async getMenusController(req, res) {
    const getMenusUseCase = this._container.getInstance(GetMenusUseCase.name);
    const menus = await getMenusUseCase.execute();

    res.status(200).json({
      status: 'success',
      data: {
        menus,
      },
    });
  }

  async postRoleMenuAccessController(req, res) {
    const assignMenuAccessUseCase = this._container.getInstance(AssignMenuAccessUseCase.name);

    await assignMenuAccessUseCase.execute(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Akses menu berhasil ditambahkan ke role tersebut',
    });
  }
}

export default MenusController;
