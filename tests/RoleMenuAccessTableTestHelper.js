import pool from '../src/Infrastructures/database/postgres/pool.js';

const RoleMenuAccessTableTestHelper = {
  async addRoleMenuAccess({ roleId = 'role-123', menuId = 'menu-123' }) {
    const query = {
      text: 'INSERT INTO role_menu_access VALUES($1, $2)',
      values: [roleId, menuId],
    };

    await pool.query(query);
  },

  async findRoleMenuAccessByRoleId(roleId) {
    const query = {
      text: 'SELECT * FROM role_menu_access WHERE role_id = $1',
      values: [roleId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE role_menu_access CASCADE');
  },
};

export default RoleMenuAccessTableTestHelper;
