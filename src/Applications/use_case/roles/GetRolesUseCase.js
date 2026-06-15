class GetRolesUseCase {
  constructor({ roleRepository }) {
    this._roleRepository = roleRepository;
  }

  async execute() {
    const roles = await this._roleRepository.getRoles();

    return roles.map((role) => ({
      id: role.id,
      roleName: role.roleName,
    }));
  }
}

export default GetRolesUseCase;
