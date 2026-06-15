import GetRoleMenusUseCase from '../GetRoleMenusUseCase.js';
import MenuRepository from '../../../../Domains/menus/MenuRepository.js';

describe('GetRoleMenusUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const getRoleMenusUseCase = new GetRoleMenusUseCase({});

    // Action & Assert
    await expect(getRoleMenusUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_ROLE_MENUS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = { roleId: 123 };
    const getRoleMenusUseCase = new GetRoleMenusUseCase({});

    // Action & Assert
    await expect(getRoleMenusUseCase.execute(useCasePayload)).rejects.toThrowError(
      'GET_ROLE_MENUS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should return nested menu tree correctly from flat menus', async () => {
    // Arrange
    const useCasePayload = { roleId: 'role-123' };

    const mockFlatMenus = [
      {
        id: 'menu-1',
        menuName: 'Menu 1',
        url: '/menu-1',
        parentId: null,
        orderIndex: 1,
      },
      {
        id: 'menu-2',
        menuName: 'Menu 1.1',
        url: '/menu-1/analytics',
        parentId: 'menu-1',
        orderIndex: 1,
      },
      {
        id: 'menu-3',
        menuName: 'Menu 1.1.1',
        url: '/menu-1/analytics/detail',
        parentId: 'menu-2',
        orderIndex: 1,
      },
      {
        id: 'menu-4',
        menuName: 'Menu 2',
        url: '/menu-2',
        parentId: null,
        orderIndex: 2,
      },
      {
        id: 'menu-5',
        menuName: 'Menu Noparent',
        url: '/orphan-menu',
        parentId: '999',
        orderIndex: 3,
      },
    ];

    const expectedTree = [
      {
        id: 'menu-1',
        menuName: 'Menu 1',
        url: '/menu-1',
        parentId: null,
        orderIndex: 1,
        children: [
          {
            id: 'menu-2',
            menuName: 'Menu 1.1',
            url: '/menu-1/analytics',
            parentId: 'menu-1',
            orderIndex: 1,
            children: [
              {
                id: 'menu-3',
                menuName: 'Menu 1.1.1',
                url: '/menu-1/analytics/detail',
                parentId: 'menu-2',
                orderIndex: 1,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'menu-4',
        menuName: 'Menu 2',
        url: '/menu-2',
        parentId: null,
        orderIndex: 2,
        children: [],
      },
      {
        id: 'menu-5',
        menuName: 'Menu Noparent',
        url: '/orphan-menu',
        parentId: '999',
        orderIndex: 3,
        children: [],
      },
    ];

    const mockMenuRepository = new MenuRepository();
    mockMenuRepository.getMenusByRoleId = vi.fn().mockResolvedValue(mockFlatMenus);

    const getRoleMenusUseCase = new GetRoleMenusUseCase({
      menuRepository: mockMenuRepository,
    });

    // Action
    const actualTree = await getRoleMenusUseCase.execute(useCasePayload);

    // Assert
    expect(actualTree).toEqual(expectedTree);
    expect(mockMenuRepository.getMenusByRoleId).toBeCalledWith('role-123');
  });
});
