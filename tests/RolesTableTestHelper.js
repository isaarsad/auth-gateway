import pool from '../src/Infrastructures/database/postgres/pool.js';

const RolesTableTestHelper = {
  async addRole({ roleId = 'role-123', roleName = 'Administrator' }) {
    const query = {
      text: 'INSERT INTO roles VALUES($1, $2)',
      values: [roleId, roleName],
    };

    await pool.query(query);
  },

  async findRolesById(id) {
    const query = {
      text: 'SELECT * FROM roles WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE roles CASCADE');
  },
};

export default RolesTableTestHelper;
