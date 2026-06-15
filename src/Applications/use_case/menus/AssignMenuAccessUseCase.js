import NewRoleMenuAccess from '../../../Domains/menus/entities/NewRoleMenuAccess.js';

class AssignMenuAccessUseCase {
  constructor({ roleRepository, menuRepository }) {
    this._roleRepository = roleRepository;
    this._menuRepository = menuRepository;
  }

  async execute(useCasePayload) {
    const newAccess = new NewRoleMenuAccess(useCasePayload);

    const { roleId, menuId } = newAccess;

    await this._roleRepository.verifyRoleExists(roleId);
    await this._menuRepository.verifyMenuExists(menuId);

    await this._menuRepository.addRoleMenuAccess(roleId, menuId);
  }
}

export default AssignMenuAccessUseCase;
