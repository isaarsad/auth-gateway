import { describe, it, expect, afterEach, afterAll } from 'vitest';
import MenusTableTestHelper from '../../../../tests/MenusTableTestHelper.js';
import RolesTableTestHelper from '../../../../tests/RolesTableTestHelper.js';
import RoleMenuAccessTableTestHelper from '../../../../tests/RoleMenuAccessTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import pool from '../../database/postgres/pool.js';
import MenuRepositoryPostgres from '../MenuRepositoryPostgres.js';
import Menu from '../../../Domains/menus/entities/Menu.js';

describe('MenuRepositoryPostgres', () => {
  afterEach(async () => {
    await RoleMenuAccessTableTestHelper.cleanTable();
    await MenusTableTestHelper.cleanTable();
    await RolesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyMenuExists method', () => {
    it('should throw NotFoundError when menu not found', async () => {
      // Arrange
      const menuRepositoryPostgres = new MenuRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(menuRepositoryPostgres.verifyMenuExists('menu-fake')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should not throw NotFoundError when menu exists', async () => {
      // Arrange
      await MenusTableTestHelper.addMenu({
        id: 'menu-123',
        menuName: 'Dashboard',
        url: '/dashboard',
        parentId: null,
        orderIndex: 1,
      });
      const menuRepositoryPostgres = new MenuRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(menuRepositoryPostgres.verifyMenuExists('menu-123')).resolves.not.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('addMenu method', () => {
    it('should persist new menu and return added menu correctly', async () => {
      // Arrange
      const payload = {
        menuName: 'Dashboard',
        url: '/dashboard',
        parentId: null,
        orderIndex: 1,
      };

      // Bikin fake id generator
      const fakeIdGenerator = () => '123';
      const menuRepositoryPostgres = new MenuRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedMenu = await menuRepositoryPostgres.addMenu(payload);

      // Assert balikan dari repository
      expect(addedMenu).toStrictEqual(
        new Menu({
          id: 'menu-123',
          menuName: 'Dashboard',
          url: '/dashboard',
          parentId: null,
          orderIndex: 1,
        }),
      );

      // Assert data beneran masuk ke database
      const menus = await MenusTableTestHelper.findMenuById('menu-123');
      expect(menus).toHaveLength(1);
      expect(menus[0].menu_name).toBe('Dashboard');
    });
  });

  describe('addRoleMenuAccess method', () => {
    it('should persist role menu access', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleIdd: 'role-123', roleName: 'Administrator' });
      await MenusTableTestHelper.addMenu({
        id: 'menu-123',
        menuName: 'Dashboard',
        url: '/dashboard',
        parentId: null,
        orderIndex: 1,
      });

      const menuRepositoryPostgres = new MenuRepositoryPostgres(pool, {});

      // Action
      await menuRepositoryPostgres.addRoleMenuAccess('role-123', 'menu-123');

      // Assert
      const accesses = await RoleMenuAccessTableTestHelper.findRoleMenuAccessByRoleId(
        'role-123',
        'menu-123',
      );
      expect(accesses).toHaveLength(1);
    });
  });

  describe('getMenusByRoleId method', () => {
    it('should return menus assigned to a specific role accurately', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-123', roleName: 'Administrator' });
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });

      await MenusTableTestHelper.addMenu({
        id: 'menu-1',
        menuName: 'Dashboard',
        url: '/dashboard',
        parentId: null,
        orderIndex: 1,
      });

      await MenusTableTestHelper.addMenu({
        id: 'menu-2',
        menuName: 'Analytics Data',
        url: '/dashboard/analytics',
        parentId: 'menu-1',
        orderIndex: 1,
      });

      await MenusTableTestHelper.addMenu({
        id: 'menu-3',
        menuName: 'System Settings',
        url: '/settings',
        parentId: null,
        orderIndex: 2,
      });

      await MenusTableTestHelper.addMenu({
        id: 'menu-4',
        menuName: 'Secret Management',
        url: '/secret',
        parentId: null,
        orderIndex: 1,
      });

      // assign role to menu
      await RoleMenuAccessTableTestHelper.addRoleMenuAccess({
        roleId: 'role-123',
        menuId: 'menu-1',
      });
      await RoleMenuAccessTableTestHelper.addRoleMenuAccess({
        roleId: 'role-123',
        menuId: 'menu-2',
      });
      await RoleMenuAccessTableTestHelper.addRoleMenuAccess({
        roleId: 'role-123',
        menuId: 'menu-3',
      });
      await RoleMenuAccessTableTestHelper.addRoleMenuAccess({
        roleId: 'role-456',
        menuId: 'menu-4',
      });

      const menuRepositoryPostgres = new MenuRepositoryPostgres(pool, {});

      // Action
      const menus = await menuRepositoryPostgres.getMenusByRoleId('role-123');

      // Assert
      expect(menus).toHaveLength(3);

      expect(menus[0]).toStrictEqual(
        {
          id: 'menu-1',
          menuName: 'Dashboard',
          url: '/dashboard',
          parentId: null,
          orderIndex: 1,
        },
        {
          id: 'menu-2',
          menuName: 'Analytics Data',
          url: '/dashboard/analytics',
          parentId: 'menu-1',
          orderIndex: 1,
        },
        {
          id: 'menu-3',
          menuName: 'System Settings',
          url: '/settings',
          parentId: null,
          orderIndex: 2,
        },
      );
    });
  });
});
