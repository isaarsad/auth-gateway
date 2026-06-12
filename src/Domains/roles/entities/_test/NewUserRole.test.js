import NewUserRole from '../NewUserRole.js';

describe('NewUserRole entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new NewUserRole(payload)).toThrow('NEW_USER_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      roleId: 123,
    };

    // Action & Assert
    expect(() => new NewUserRole(payload)).toThrow(
      'NEW_USER_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewUserRole entities correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      roleId: 'role-admin',
    };

    // Action
    const newUserRole = new NewUserRole(payload);

    // Assert
    expect(newUserRole).toBeInstanceOf(NewUserRole);
    expect(newUserRole.userId).toEqual(payload.userId);
    expect(newUserRole.roleId).toEqual(payload.roleId);
  });
});
