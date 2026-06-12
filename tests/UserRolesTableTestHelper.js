import pool from '../src/Infrastructures/database/postgres/pool.js';

const UserRolesTableTestHelper = {
  async addUserRole({ userId = 'user-123', roleId = 'role-123' }) {
    const query = {
      text: 'INSERT INTO user_roles VALUES($1, $2)',
      values: [userId, roleId],
    };

    await pool.query(query);
  },

  async findUserRolesById(id) {
    const query = {
      text: 'SELECT * FROM user_roles WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE user_roles CASCADE');
  },
};

export default UserRolesTableTestHelper;
