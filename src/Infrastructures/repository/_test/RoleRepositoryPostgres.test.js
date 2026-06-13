import RolesTableTestHelper from '../../../../tests/RolesTableTestHelper.js';
import UserRolesTableTestHelper from '../../../../tests/UserRolesTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import NewRole from '../../../Domains/roles/entities/NewRole.js';
import pool from '../../database/postgres/pool.js';
import RoleRepositoryPostgres from '../RoleRepositoryPostgres.js';

describe('RoleRepositoryPostgres', () => {
  afterEach(async () => {
    // WAJIB: Sapu bersih semua sisa perang biar gak bentrok antar-test!
    await UserRolesTableTestHelper.cleanTable();
    await RolesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addRole function', () => {
    it('should persist role and return new role correctly', async () => {
      // Arrange
      const payload = { roleName: 'Administrator' };
      const fakeIdGenerator = () => '123'; // stub!
      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newRole = await roleRepositoryPostgres.addRole(payload);

      // Assert
      const role = await RolesTableTestHelper.findRolesById('role-123');
      expect(role).toHaveLength(1);
      expect(newRole).toStrictEqual(
        new NewRole({
          id: 'role-123',
          roleName: 'Administrator',
        }),
      );
    });
  });

  describe('getRoles function', () => {
    it('should return all roles from database correctly', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-123', roleName: 'Admin' });
      await RolesTableTestHelper.addRole({ roleId: 'role-456', roleName: 'Staff' });
      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, {});

      // Action
      const roles = await roleRepositoryPostgres.getRoles();

      // Assert
      expect(roles).toHaveLength(2);
      expect(roles[0]).toStrictEqual({ id: 'role-123', roleName: 'Admin' });
      expect(roles[1]).toStrictEqual({ id: 'role-456', roleName: 'Staff' });
    });
  });

  describe('getRoleById function', () => {
    it('should throw InvariantError when role not found', async () => {
      // Arrange
      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(roleRepositoryPostgres.getRoleById('role-fake')).rejects.toThrow(InvariantError);
    });

    it('should return role data correctly when role is found', async () => {
      // Arrange
      await RolesTableTestHelper.addRole({ roleId: 'role-123', roleName: 'Superadmin' });
      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, {});

      // Action
      const role = await roleRepositoryPostgres.getRoleById('role-123');

      // Assert
      expect(role).toStrictEqual({
        id: 'role-123',
        roleName: 'Superadmin',
      });
    });
  });

  describe('getUserRoles function', () => {
    it('should return user roles correctly based on userId', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'arsad' });
      await RolesTableTestHelper.addRole({ roleId: 'role-111', roleName: 'Manager' });
      await RolesTableTestHelper.addRole({ roleId: 'role-222', roleName: 'Developer' });

      await UserRolesTableTestHelper.addUserRole({ userId: 'user-123', roleId: 'role-111' });
      await UserRolesTableTestHelper.addUserRole({ userId: 'user-123', roleId: 'role-222' });

      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, {});

      // Action
      const userRoles = await roleRepositoryPostgres.getUserRoles('user-123');

      // Assert
      expect(userRoles).toHaveLength(2);
      expect(userRoles[0]).toStrictEqual({ roleId: 'role-111' });
      expect(userRoles[1]).toStrictEqual({ roleId: 'role-222' });
    });
  });

  describe('verifyUserRole function', () => {
    it('should throw AuthorizationError when user does not have the specified role', async () => {
      // Arrange
      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(roleRepositoryPostgres.verifyUserRole('user-123', 'role-123')).rejects.toThrow(
        AuthorizationError,
      );
    });

    it('should not throw AuthorizationError when user has the specified role', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await RolesTableTestHelper.addRole({ roleId: 'role-123' });
      await UserRolesTableTestHelper.addUserRole({ userId: 'user-123', roleId: 'role-123' });

      const roleRepositoryPostgres = new RoleRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        roleRepositoryPostgres.verifyUserRole('user-123', 'role-123'),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
});
