import AddMenuUseCase from '../AddMenuUseCase.js';
import MenuRepository from '../../../../Domains/menus/MenuRepository.js';
import Menu from '../../../../Domains/menus/entities/Menu.js';
import InvariantError from '../../../../Commons/exceptions/InvariantError.js';
import NewMenu from '../../../../Domains/menus/entities/NewMenu.js';

describe('AddMenuUseCase', () => {
  it('should throw error when parent menu does not exist', async () => {
    // Arrange
    const useCasePayload = {
      menuName: 'Sub Menu',
      url: '/menu1',
      parentId: 'menu-fake',
      orderIndex: 1,
    };

    const mockMenuRepository = new MenuRepository();

    mockMenuRepository.verifyMenuExists = vi
      .fn()
      .mockRejectedValue(new InvariantError('Menu induk tidak ditemukan'));
    mockMenuRepository.addMenu = vi.fn();

    const addMenuUseCase = new AddMenuUseCase({ menuRepository: mockMenuRepository });

    // Action & Assert
    await expect(addMenuUseCase.execute(useCasePayload)).rejects.toThrowError(InvariantError);
    expect(mockMenuRepository.verifyMenuExists).toBeCalledWith(useCasePayload.parentId);
    expect(mockMenuRepository.addMenu).not.toBeCalled();
  });

  it('should orchestrate add root menu correctly (parentId is null)', async () => {
    // Arrange
    const useCasePayload = {
      menuName: 'Root Menu',
      url: '/menu1',
      parentId: null,
      orderIndex: 1,
    };
    const expectedAddedMenu = {
      id: 'menu-123',
      menuName: 'Root Menu',
      url: '/menu1',
      parentId: null,
      orderIndex: 1,
    };

    const mockMenuRepository = new MenuRepository();

    mockMenuRepository.verifyMenuExists = vi.fn();
    mockMenuRepository.addMenu = vi.fn().mockResolvedValue(expectedAddedMenu);

    const addMenuUseCase = new AddMenuUseCase({ menuRepository: mockMenuRepository });

    // Action
    const result = await addMenuUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(
      new Menu({
        id: expectedAddedMenu.id,
        menuName: useCasePayload.menuName,
        url: useCasePayload.url,
        parentId: useCasePayload.parentId,
        orderIndex: useCasePayload.orderIndex,
      }),
    );
    expect(mockMenuRepository.addMenu).toBeCalledWith(
      new NewMenu({
        menuName: 'Root Menu',
        url: '/menu1',
        parentId: null,
        orderIndex: 1,
      }),
    );
    expect(mockMenuRepository.verifyMenuExists).not.toBeCalled(); // Root menu gak usah ngecek parent!
  });

  it('should orchestrate add sub-menu correctly (parentId is valid)', async () => {
    // Arrange
    const useCasePayload = {
      menuName: 'Sub Menu',
      url: '/menu1',
      parentId: 'menu-123',
      orderIndex: 1,
    };
    const expectedAddedMenu = {
      id: 'menu-456',
      menuName: 'Sub Menu',
      url: '/menu1',
      parentId: 'menu-123',
      orderIndex: 1,
    };

    const mockMenuRepository = new MenuRepository();
    mockMenuRepository.verifyMenuExists = vi.fn().mockResolvedValue();
    mockMenuRepository.addMenu = vi.fn().mockResolvedValue(expectedAddedMenu);

    const addMenuUseCase = new AddMenuUseCase({ menuRepository: mockMenuRepository });

    // Action
    const result = await addMenuUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(
      new Menu({
        id: expectedAddedMenu.id,
        menuName: useCasePayload.menuName,
        url: useCasePayload.url,
        parentId: useCasePayload.parentId,
        orderIndex: useCasePayload.orderIndex,
      }),
    );
    expect(mockMenuRepository.verifyMenuExists).toBeCalledWith(useCasePayload.parentId);
    expect(mockMenuRepository.addMenu).toBeCalledWith(
      new NewMenu({ menuName: 'Sub Menu', url: '/menu1', parentId: 'menu-123', orderIndex: 1 }),
    );
  });
});
