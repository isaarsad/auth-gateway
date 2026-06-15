import NewRoleMenuAccess from '../NewRoleMenuAccess.js';

describe('NewRoleMenuAccess entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      roleId: 'role-123',
    };

    // Action & Assert
    expect(() => new NewRoleMenuAccess(payload)).toThrowError(
      'NEW_ROLE_MENU_ACCESS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      roleId: 'role-123',
      menuId: 123,
    };

    // Action & Assert
    expect(() => new NewRoleMenuAccess(payload)).toThrowError(
      'NEW_ROLE_MENU_ACCESS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewRoleMenuAccess object correctly', () => {
    // Arrange
    const payload = {
      roleId: 'role-123',
      menuId: 'menu-123',
    };

    // Action
    const newRoleMenuAccess = new NewRoleMenuAccess(payload);

    // Assert
    expect(newRoleMenuAccess.roleId).toEqual(payload.roleId);
    expect(newRoleMenuAccess.menuId).toEqual(payload.menuId);
  });
});
