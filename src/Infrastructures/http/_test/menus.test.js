import request from 'supertest';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import RolesTableTestHelper from '../../../../tests/RolesTableTestHelper.js';
import MenusTableTestHelper from '../../../../tests/MenusTableTestHelper.js';
import RoleMenuAccessTableTestHelper from '../../../../tests/RoleMenuAccessTableTestHelper.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import UserRolesTableTestHelper from '../../../../tests/UserRolesTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';

describe('HTTP Server - Menus API', () => {
  let app;
  let accessToken;

  const userId = 'user-123';
  const roleId = 'role-123';

  beforeEach(async () => {
    app = await createServer(container);

    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'arsad',
    });
    await RolesTableTestHelper.addRole({ roleId: roleId, roleName: 'Administrator' });
    await UserRolesTableTestHelper.addUserRole({ userId, roleId });

    const tokenManager = container.getInstance(AuthenticationTokenManager.name);
    accessToken = await tokenManager.createAccessToken({
      id: userId,
      roleId: roleId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserRolesTableTestHelper.cleanTable();
    await MenusTableTestHelper.cleanTable();
    await RolesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /menus', () => {
    it('should respond 201 and persist menu', async () => {
      // Arrange
      const payload = { menuName: 'Dashboard', parentId: null, url: '/Dashboard', orderIndex: 1 };

      // Action
      const response = await request(app)
        .post('/menus')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedMenu).toBeDefined();
      expect(response.body.data.addedMenu.name).toEqual(payload.name);
      expect(response.body.data.addedMenu.parentId).toEqual(null);
    });

    it('should respond 400 when property is missing', async () => {
      // Arrange
      const payload = { parentId: null, url: '/Dashboard', orderIndex: 1 };

      // Action
      const response = await request(app)
        .post('/menus')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat menu, properti yang dibutuhkan tidak ada',
      );
    });

    it('should respond 400 when data type is invalid', async () => {
      // Arrange
      const payload = { menuName: 123, parentId: null, url: '/Dashboard', orderIndex: 1 };

      // Action
      const response = await request(app)
        .post('/menus')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat menu, tipe data tidak sesuai');
    });

    it('should respond 401 when request without access token', async () => {
      // Arrange
      const payload = { menuName: 123, parentId: null, url: '/Dashboard', orderIndex: 1 };

      // Action
      const response = await request(app).post('/menus').send(payload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should respond 401 when token format is invalid', async () => {
      // Arrange
      const payload = { menuName: 123, parentId: null, url: '/Dashboard', orderIndex: 1 };

      // Action
      const response = await request(app)
        .post('/menus')
        .set('Authorization', 'Bearer')
        .send(payload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Token Invalid');
    });
  });

  describe('when POST /menus/menu-access', () => {
    it('should respond 201 and grant access correctly', async () => {
      // Arrange
      const menuPayload = {
        id: 'menu-123',
        menuName: 'Dashboard',
        url: '/dashboard',
        parentId: null,
        orderIndex: 1,
      };

      await MenusTableTestHelper.addMenu(menuPayload);
      const payload = { roleId: roleId, menuId: 'menu-123' };

      // Action
      const response = await request(app)
        .post('/menus/menu-access')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.message).toEqual('Akses menu berhasil ditambahkan ke role tersebut');

      const access = await RoleMenuAccessTableTestHelper.findRoleMenuAccessByRoleId(
        roleId,
        menuPayload.menuId,
      );
      expect(access).toHaveLength(1);
    });

    it('should respond 400 when required property is missing', async () => {
      // Arrange
      const payload = {};

      // Action
      const response = await request(app)
        .post('/menus/menu-access')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should respond 404 when menu is not found', async () => {
      // Arrange
      const payload = { menuId: 'menu-xxx', roleId };

      // Action
      const response = await request(app)
        .post('/menus/menu-access')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Menu tidak ditemukan');
    });
  });

  describe('when GET /menus', () => {
    it('should respond 200 and return nested menus (Tree) based on role', async () => {
      // Arrange
      await MenusTableTestHelper.addMenu({
        id: 'menu-1',
        menuName: 'Menu 1',
        parentId: null,
        url: '/menu1',
        orderIndex: 1,
      });
      await MenusTableTestHelper.addMenu({
        id: 'menu-1-1',
        name: 'Menu 1.1',
        parentId: 'menu-1',
        url: '/menu1/menu1.1',
        orderIndex: 1,
      });

      await RoleMenuAccessTableTestHelper.addRoleMenuAccess({ roleId, menuId: 'menu-1' });
      await RoleMenuAccessTableTestHelper.addRoleMenuAccess({ roleId, menuId: 'menu-1-1' });

      // Action
      const response = await request(app)
        .get('/menus')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.menus).toBeDefined();

      const menus = response.body.data.menus;
      expect(menus).toHaveLength(1);
      expect(menus[0].id).toEqual('menu-1');
      expect(menus[0].children).toHaveLength(1);
      expect(menus[0].children[0].id).toEqual('menu-1-1');
    });

    it('should respond 200 with empty array when role has no assigned menus', async () => {
      // Arrange

      // Action
      const response = await request(app)
        .get('/menus')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.menus).toHaveLength(0);
    });

    it('should respond 401 when request without access token', async () => {
      // Action
      const response = await request(app).get('/menus');

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should respond 401 when token format is invalid', async () => {
      // Action
      const response = await request(app).get('/menus').set('Authorization', 'Bearer');

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Token Invalid');
    });
  });
});
