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
  pgm.createTable('menus', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    menu_name: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    url: {
      type: 'VARCHAR(100)',
      notNull: false,
    },
    parent_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    order_index: {
      type: 'INT',
      notNull: true,
      default: 0,
    },
  });

  pgm.addConstraint('menus', 'fk_menus.parent_id_menus.id', {
    foreignKeys: {
      columns: 'parent_id',
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
  pgm.dropTable('menus');
};
