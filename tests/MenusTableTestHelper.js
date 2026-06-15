import pool from '../src/Infrastructures/database/postgres/pool.js';

const MenusTableTestHelper = {
  async addMenu({
    id = 'menu-123',
    menuName = 'Dashboard',
    url = '/Dashboards',
    parentId = 'null',
    orderIndex = 1,
  }) {
    const query = {
      text: 'INSERT INTO menus(id, menu_name, url, parent_id, order_index) VALUES($1, $2, $3, $4, $5)',
      values: [id, menuName, url, parentId, orderIndex],
    };

    await pool.query(query);
  },

  async findMenuById(menuId) {
    const query = {
      text: 'SELECT * FROM menus WHERE id = $1',
      values: [menuId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE menus CASCADE');
  },
};

export default MenusTableTestHelper;
