import MenuRepository from '../../Domains/menus/MenuRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import Menu from '../../Domains/menus/entities/Menu.js';

class MenuRepositoryPostgres extends MenuRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyMenuExists(menuId) {
    const query = {
      text: 'SELECT id FROM menus WHERE id = $1',
      values: [menuId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Menu tidak ditemukan');
    }
  }

  async addMenu(newMenu) {
    const { menuName, parentId, url, orderIndex } = newMenu;
    const id = `menu-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO menus (id, menu_name, url, parent_id, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id, menu_name as "menuName", url, parent_id as "parentId", order_index as "orderIndex"',
      values: [id, menuName, url, parentId, orderIndex],
    };

    const result = await this._pool.query(query);

    return new Menu({ ...result.rows[0] });
  }

  async getMenusByRoleId(roleId) {
    const query = {
      text: `
        SELECT m.id, m.menu_name AS "menuName", m.url, m.parent_id AS "parentId", m.order_index AS "orderIndex" 
        FROM menus m
        JOIN role_menu_access rma ON m.id = rma.menu_id
        WHERE rma.role_id = $1
      `,
      values: [roleId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async addRoleMenuAccess(roleId, menuId) {
    const query = {
      text: 'INSERT INTO role_menu_access (role_id, menu_id) VALUES ($1, $2)',
      values: [roleId, menuId],
    };

    await this._pool.query(query);
  }

  async getMenus() {
    const query = {
      text: `
        SELECT 
          id, 
          menu_name AS "menuName", 
          url, 
          parent_id AS "parentId", 
          order_index AS "orderIndex" 
        FROM menus 
        ORDER BY order_index ASC
      `,
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

export default MenuRepositoryPostgres;
