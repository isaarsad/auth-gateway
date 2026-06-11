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
  pgm.createTable('user_roles', {
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    role_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('user_roles', 'pk_user_roles', {
    primaryKey: ['user_id', 'role_id'],
  });

  pgm.addConstraint('user_roles', 'fk_user_roles.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('user_roles', 'fk_user_roles.role_id_roles.id', {
    foreignKeys: {
      columns: 'role_id',
      references: '"roles"(id)',
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
  pgm.dropTable('user_roles');
};
