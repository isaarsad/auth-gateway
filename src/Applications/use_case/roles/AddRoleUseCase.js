import NewRole from '../../../Domains/roles/entities/NewRole.js';

class AddRoleUseCase {
  constructor({ roleRepository }) {
    this._roleRepository = roleRepository;
  }

  async execute(useCasePayload) {
    const newRole = new NewRole(useCasePayload);
    await this._roleRepository.verifyAvailableRoleName(newRole.roleName);
    return this._roleRepository.addRole(newRole);
  }
}

export default AddRoleUseCase;
