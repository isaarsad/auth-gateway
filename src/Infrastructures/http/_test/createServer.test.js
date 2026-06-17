import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import UserRolesTableTestHelper from '../../../../tests/UserRolesTableTestHelper.js';
import RolesTableTestHelper from '../../../../tests/RolesTableTestHelper.js';

describe('HTTP Server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserRolesTableTestHelper.cleanTable();
    await RolesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.status).toEqual(404);
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });
      const requestPayload = {
        username: 'arsad',
        password: 'secret',
        fullname: 'Isa Arsad',
        roleIds: ['role-456'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Isa Arsad',
        password: 'secret',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'arsad',
        password: 'secret',
        fullname: ['Isa Arsad'],
        roleIds: ['role-123'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena tipe data tidak sesuai',
      );
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'arsadarsadarsadarsadarsadarsadarsadarsadarsadarsadarsad',
        password: 'secret',
        fullname: 'Isa Arsad',
        roleIds: ['role-123'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      );
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'isa arsad',
        password: 'secret',
        fullname: 'Isa Arsad',
        roleIds: ['role-123'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      );
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'arsad' });
      const requestPayload = {
        username: 'arsad',
        fullname: 'Isa Arsad',
        password: 'super_secret',
        roleIds: ['role-123'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak tersedia');
    });
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });

      const requestPayload = {
        username: 'arsad',
        password: 'secret',
      };
      const app = await createServer(container);

      await request(app)
        .post('/users')
        .send({
          username: 'arsad',
          password: 'secret',
          fullname: 'Isa Arsad',
          roleIds: ['role-456'],
        });

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.preAuthToken).toBeDefined();
      expect(response.body.data.availableRoles).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const requestPayload = {
        username: 'arsad',
        password: 'secret',
      };
      const app = await createServer(container);

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('kredensial yang Anda berikan salah');
    });

    it('should response 401 if password wrong', async () => {
      const requestPayload = {
        username: 'arsad',
        password: 'wrong_password',
      };
      const app = await createServer(container);
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });

      await request(app)
        .post('/users')
        .send({
          username: 'arsad',
          password: 'secret',
          fullname: 'Isa Arsad',
          roleIds: ['role-456'],
        });

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('kredensial yang Anda berikan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'arsad',
      };
      const app = await createServer(container);

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const app = await createServer(container);

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username dan password harus string');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });

      const app = await createServer(container);

      await request(app)
        .post('/users')
        .send({
          username: 'arsad',
          password: 'secret',
          fullname: 'Isa Arsad',
          roleIds: ['role-456'],
        });

      const loginResponse = await request(app).post('/authentications').send({
        username: 'arsad',
        password: 'secret',
      });

      const { preAuthToken } = loginResponse.body.data;

      const authResponse = await request(app)
        .post('/authentications/role')
        .set('Authorization', `Bearer ${preAuthToken}`)
        .send({
          roleId: 'role-456',
        });

      const { refreshToken } = authResponse.body.data;
      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({ refreshToken: 123 });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken: 'invalid_refresh_token' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createRefreshToken({ username: 'arsad' });

      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).delete('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'arsad',
      fullname: 'Isa Arsad',
      password: 'super_secret',
    };
    const app = await createServer({});

    // Action
    const response = await request(app).post('/users').send(requestPayload);

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });
});
