/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
/* eslint-disable camelcase */
export const up = (pgm) => {
  pgm.createTable('role_menu_access', {
    role_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    menu_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('role_menu_access', 'pk_role_menu_access', {
    primaryKey: ['role_id', 'menu_id'],
  });

  pgm.addConstraint('role_menu_access', 'fk_role_menu_access.role_id_roles.id', {
    foreignKeys: {
      columns: 'role_id',
      references: '"roles"(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('role_menu_access', 'fk_role_menu_access.menu_id_menus.id', {
    foreignKeys: {
      columns: 'menu_id',
      references: '"menus"(id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('role_menu_access');
};
