import RolesTableTestHelper from '../../../../tests/RolesTableTestHelper.js';
import UserRolesTableTestHelper from '../../../../tests/UserRolesTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UserRolesTableTestHelper.cleanTable();
    await RolesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'arsad' }); // memasukan user baru dengan username arsad
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('arsad')).rejects.toThrow(
        InvariantError,
      );
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('arsad')).resolves.not.toThrow(
        InvariantError,
      );
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-123', roleName: 'Administrator' });
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });

      const registerUser = new RegisterUser({
        username: 'arsad',
        password: 'secret_password',
        fullname: 'Isa Arsad',
        roleIds: ['role-123', 'role-456'],
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      const userRoles = await UserRolesTableTestHelper.findUserRolesById('user-123');
      expect(users).toHaveLength(1);
      expect(userRoles).toHaveLength(2);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-123', roleName: 'Administrator' });
      const registerUser = new RegisterUser({
        username: 'arsad',
        password: 'secret_password',
        fullname: 'Isa Arsad',
        roleIds: ['role-123'],
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'arsad',
          fullname: 'Isa Arsad',
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('arsad')).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'arsad',
        password: 'secret_password',
      });

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('arsad');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('arsad')).rejects.toThrow(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'arsad' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('arsad');

      // Assert
      expect(userId).toEqual('user-321');
    });
  });
});
