import RegisteredRole from '../RegisteredRole.js';

describe('RegisteredRole entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new RegisteredRole(payload)).toThrow('NEW_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      roleName: 123,
    };

    // Action & Assert
    expect(() => new RegisteredRole(payload)).toThrow('NEW_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredRole entities correctly', () => {
    // Arrange
    const payload = {
      id: 'role-123',
      roleName: 'Administrator',
    };

    // Action
    const registeredRole = new RegisteredRole(payload);

    // Assert
    expect(registeredRole).toBeInstanceOf(RegisteredRole);
    expect(registeredRole.id).toEqual(payload.id);
    expect(registeredRole.roleName).toEqual(payload.roleName);
  });
});
