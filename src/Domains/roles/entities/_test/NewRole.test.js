import NewRole from '../NewRole.js';

describe('NewRole entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewRole(payload)).toThrow('NEW_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      roleName: 123,
    };

    // Action & Assert
    expect(() => new NewRole(payload)).toThrow('NEW_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewRole entities correctly', () => {
    // Arrange
    const payload = {
      id: 'role-123',
      roleName: 'Administrator',
    };

    // Action
    const newRole = new NewRole(payload);

    // Assert
    expect(newRole).toBeInstanceOf(NewRole);
    expect(newRole.id).toEqual(payload.id);
    expect(newRole.roleName).toEqual(payload.roleName);
  });
});
