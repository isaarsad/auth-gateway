import Menu from '../Menu.js';

describe('Menu entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      menuName: 'Dashboard',
      url: '/dashboard',
    };

    // Action & Assert
    expect(() => new Menu(payload)).toThrowError('MENU.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      menuName: 'Dashboard',
      url: '/dashboard',
      parentId: null,
      orderIndex: '1',
    };

    // Action & Assert
    expect(() => new Menu(payload)).toThrowError('MENU.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Menu object correctly', () => {
    // Arrange
    const payload = {
      id: 'menu-123',
      menuName: 'Dashboard',
      url: '/dashboard',
      parentId: null,
      orderIndex: 1,
    };

    // Action
    const newMenu = new Menu(payload);

    // Assert
    expect(newMenu.id).toEqual(payload.id);
    expect(newMenu.menuName).toEqual(payload.menuName);
    expect(newMenu.url).toEqual(payload.url);
    expect(newMenu.parentId).toEqual(null);
    expect(newMenu.orderIndex).toEqual(payload.orderIndex);
  });
});
