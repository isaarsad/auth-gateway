import { describe, it, expect } from 'vitest';
import NewMenu from '../NewMenu.js';

describe('NewMenu entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      menuName: 'User Management',
    };

    // Action & Assert
    expect(() => new NewMenu(payload)).toThrowError('NEW_MENU.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      menuName: 'User Management',
      url: 12345,
      parentId: null,
      orderIndex: '2',
    };

    // Action & Assert
    expect(() => new NewMenu(payload)).toThrowError('NEW_MENU.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewMenu object correctly', () => {
    // Arrange
    const payload = {
      menuName: 'Settings',
      url: '/settings',
      parentId: null,
      orderIndex: 0,
    };

    // Action
    const createMenu = new NewMenu(payload);

    // Assert
    expect(createMenu.menuName).toEqual(payload.menuName);
    expect(createMenu.url).toEqual(payload.url);
    expect(createMenu.parentId).toBeNull();
    expect(createMenu.orderIndex).toEqual(payload.orderIndex);
  });
});
