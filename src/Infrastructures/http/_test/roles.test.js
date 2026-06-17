import request from 'supertest';

import RolesTableTestHelper from '../../../../tests/RolesTableTestHelper.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';

describe('HTTP Server - Roles API', () => {
  let app;
  let accessToken;

  const userId = 'user-123';
  const roleId = 'role-123';

  beforeEach(async () => {
    app = await createServer(container);

    await RolesTableTestHelper.addRole({ roleId, roleName: 'Administrator' });

    const tokenManager = container.getInstance(AuthenticationTokenManager.name);
    accessToken = await tokenManager.createAccessToken({ id: userId, roleId });
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RolesTableTestHelper.cleanTable();
  });

  describe('when POST /roles', () => {
    it('should respond 201 and persist role', async () => {
      // Arrange
      const payload = { roleName: 'Staff' };

      // Action
      const response = await request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedRole).toBeDefined();
      expect(response.body.data.addedRole.id).toBeDefined();
      expect(response.body.data.addedRole.roleName).toEqual(payload.roleName);
    });

    it('should respond 400 when role name already exists', async () => {
      // Arrange
      const payload = { roleName: 'Administrator' }; // already exist at beforeEach

      // Action
      const response = await request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Nama role sudah digunakan');
    });

    it('should respond 400 when property is missing', async () => {
      // Arrange
      const payload = {};

      // Action
      const response = await request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat role, properti yang dibutuhkan tidak ada',
      );
    });

    it('should respond 400 when data type is invalid', async () => {
      // Arrange
      const payload = { roleName: 123 };

      // Action
      const response = await request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat role, tipe data tidak sesuai');
    });

    it('should respond 401 when request without access token', async () => {
      // Arrange
      const payload = { roleName: 'Staff' };

      // Action
      const response = await request(app).post('/roles').send(payload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should respond 401 when token format is invalid', async () => {
      // Arrange
      const payload = { roleName: 'Staff' };

      // Action
      const response = await request(app)
        .post('/roles')
        .set('Authorization', 'Bearer')
        .send(payload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Token Invalid');
    });
  });

  describe('when GET /roles', () => {
    it('should respond 200 and return all roles', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });

      // Action
      const response = await request(app)
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.roles).toBeDefined();

      const roles = response.body.data.roles;
      expect(Array.isArray(roles)).toBe(true);
      expect(roles).toHaveLength(2);
      expect(roles[0].id).toEqual('role-123');
      expect(roles[1].id).toEqual('role-456');
    });

    it('should respond 200 with empty array when no roles exist', async () => {
      // Arrange
      await RolesTableTestHelper.cleanTable();

      // Action
      const response = await request(app)
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.roles).toHaveLength(0);
    });

    it('should respond 401 when request without access token', async () => {
      // Action
      const response = await request(app).get('/roles');

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should respond 401 when token format is invalid', async () => {
      // Action
      const response = await request(app).get('/roles').set('Authorization', 'Bearer');

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Token Invalid');
    });
  });
});
