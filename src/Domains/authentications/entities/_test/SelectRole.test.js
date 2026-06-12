import SelectRole from '../SelectRole.js';

describe('SelectRole entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new SelectRole(payload)).toThrow('SELECT_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      roleId: 1234,
    };

    // Action & Assert
    expect(() => new SelectRole(payload)).toThrow('SELECT_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create SelectRole entities correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      roleId: 'role-123',
    };

    // Action
    const selectRole = new SelectRole(payload);

    // Assert
    expect(selectRole).toBeInstanceOf(SelectRole);
    expect(selectRole.userId).toEqual(payload.userId);
    expect(selectRole.roleId).toEqual(payload.roleId);
  });
});
