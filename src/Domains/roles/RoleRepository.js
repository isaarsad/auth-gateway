class RoleRepository {
  async addRole(_payload) {
    throw new Error('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRoles() {
    throw new Error('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRoleById(_id) {
    throw new Error('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getUserRoles(_userId) {
    throw new Error('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyUserRole(_userId, _roleId) {
    throw new Error('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRoleExists(_roleId) {
    throw new Error('ROLE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default RoleRepository;
