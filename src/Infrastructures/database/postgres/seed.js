import pool from './pool.js';
async function seed() {
  try {
    console.log('=== Memulai Proses Seeding Database ===');

    await pool.query(
      'TRUNCATE role_menu_access, menus, user_roles, roles, users, authentications CASCADE;',
    );
    console.log('✓ TRUNCATE all tables.');

    await pool.query(`
      INSERT INTO roles (id, role_name) VALUES 
      ('role-123', 'Administrator')
    `);
    console.log('✓ Roles berhasil ditambahkan.');

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

    console.log('=== Seeding Selesai ===');
  } catch (error) {
    console.error('✗ Gagal melakukan seeding:', error);
  } finally {
    await pool.end();
  }
}

seed();
