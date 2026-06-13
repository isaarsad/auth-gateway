import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';
import NewRole from '../../Domains/roles/entities/NewRole.js';
import RoleRepository from '../../Domains/roles/RoleRepository.js';

class RoleRepositoryPostgres extends RoleRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addRole(payload) {
    const { roleName } = payload;
    const id = `role-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO roles VALUES($1, $2) RETURNING id, role_name AS "roleName"',
      values: [id, roleName],
    };

    const result = await this._pool.query(query);
    return new NewRole({ ...result.rows[0] });
  }

  async getRoles() {
    const result = await this._pool.query('SELECT id, role_name AS "roleName" FROM roles');
    return result.rows;
  }

  async getRoleById(id) {
    const query = {
      text: 'SELECT id, role_name AS "roleName" FROM roles WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Role tidak ditemukan');
    }

    return result.rows[0];
  }

  async getUserRoles(userId) {
    const query = {
      text: 'SELECT role_id AS "roleId" FROM user_roles WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyUserRole(userId, roleId) {
    const query = {
      text: 'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2',
      values: [userId, roleId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses role ini');
    }
  }
}

export default RoleRepositoryPostgres;
