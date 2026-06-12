import pool from './pool.js';
async function seed() {
  try {
    console.log('=== Memulai Proses Seeding Database ===');

    await pool.query('TRUNCATE role_menu_access, menus, user_roles, roles, users CASCADE;');

    await pool.query(`
      INSERT INTO users (id, username, password, fullname) VALUES 
      ('user-123', 'arsad', '$2b$10$76YVwGz1mXb7yXwG7uR8e.ZfK5bW4eE6aO7gY3xN9zH2.mK5l8uSq', 'Isa Arsad');
    `);
    console.log('✓ User "arsad" berhasil ditambahkan.');

    await pool.query(`
      INSERT INTO roles (id, role_name) VALUES 
      ('role-123', 'Administrator'),
      ('role-456', 'Staff Operational');
    `);
    console.log('✓ Roles berhasil ditambahkan.');

    await pool.query(`
      INSERT INTO user_roles (user_id, role_id) VALUES 
      ('user-123', 'role-123'),
      ('user-123', 'role-456');
    `);
    console.log('✓ Jabatan ganda berhasil di-set untuk user.');

    await pool.query(`
      INSERT INTO menus (id, menu_name, url, parent_id, order_index) VALUES 
      ('m1', 'Menu 1', '/menu-1', NULL, 1),
      ('m1.1', 'Menu 1.1', '/menu-1/1', 'm1', 1),
      ('m1.2', 'Menu 1.2', NULL, 'm1', 2),
      ('m1.2.1', 'Menu 1.2.1', '/menu-1/2/1', 'm1.2', 1),
      ('m1.2.2', 'Menu 1.2.2', '/menu-1/2/2', 'm1.2', 2),
      ('m1.3', 'Menu 1.3', NULL, 'm1', 3),
      ('m1.3.1', 'Menu 1.3.1', '/menu-1/3/1', 'm1.3', 1),

      ('m2', 'Menu 2', '/menu-2', NULL, 2),
      ('m2.1', 'Menu 2.1', '/menu-2/1', 'm2', 1),
      ('m2.2', 'Menu 2.2', NULL, 'm2', 2),
      ('m2.2.1', 'Menu 2.2.1', '/menu-2/2/1', 'm2.2', 1),
      ('m2.2.2', 'Menu 2.2.2', NULL, 'm2.2', 2),
      ('m2.2.2.1', 'Menu 2.2.2.1', '/menu-2/2/2/1', 'm2.2.2', 1),
      ('m2.2.2.2', 'Menu 2.2.2.2', '/menu-2/2/2/2', 'm2.2.2', 2),
      ('m2.2.3', 'Menu 2.2.3', '/menu-2/2/3', 'm2.2', 3),
      ('m2.3', 'Menu 2.3', '/menu-2/3', 'm2', 3),

      ('m3', 'Menu 3', '/menu-3', NULL, 3),
      ('m3.1', 'Menu 3.1', '/menu-3/1', 'm3', 1),
      ('m3.2', 'Menu 3.2', '/menu-3/2', 'm3', 2);
    `);
    console.log('✓ Struktur menu berlevel berhasil ditambahkan.');

    await pool.query(`
      INSERT INTO role_menu_access (role_id, menu_id) 
      SELECT 'role-123', id FROM menus;
    `);

    await pool.query(`
      INSERT INTO role_menu_access (role_id, menu_id) VALUES 
      ('role-456', 'm3'),
      ('role-456', 'm3.1'),
      ('role-456', 'm3.2');
    `);
    console.log('✓ Hak akses role_menu_access berhasil di-set.');

    console.log('=== Seeding Selesai ===');
  } catch (error) {
    console.error('✗ Gagal melakukan seeding:', error);
  } finally {
    await pool.end();
  }
}

seed();
