import AddRoleUseCase from '../../../../Applications/use_case/roles/AddRoleUseCase.js';
import GetRolesUseCase from '../../../../Applications/use_case/roles/GetRolesUseCase.js';

class RolesController {
  constructor(container) {
    this._container = container;

    this.postRoleController = this.postRoleController.bind(this);
    this.getRolesController = this.getRolesController.bind(this);
  }

  async postRoleController(req, res) {
    const addRoleUseCase = this._container.getInstance(AddRoleUseCase.name);
    const addedRole = await addRoleUseCase.execute(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        addedRole,
      },
    });
  }

  async getRolesController(req, res) {
    const getRolesUseCase = this._container.getInstance(GetRolesUseCase.name);
    const roles = await getRolesUseCase.execute();

    res.status(200).json({
      status: 'success',
      data: {
        roles,
      },
    });
  }
}

export default RolesController;
