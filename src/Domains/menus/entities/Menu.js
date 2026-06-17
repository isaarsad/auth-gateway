class Menu {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, menuName, url, parentId, orderIndex } = payload;

    this.id = id;
    this.menuName = menuName;
    this.url = url;
    this.parentId = parentId || null;
    this.orderIndex = orderIndex;
  }

  _verifyPayload(payload) {
    const { id, menuName, url, parentId, orderIndex } = payload;

    if (!id || !menuName || url === undefined || orderIndex === undefined) {
      throw new Error('MENU.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof menuName !== 'string' ||
      (url !== null && typeof url !== 'string') ||
      (parentId !== undefined && parentId !== null && typeof parentId !== 'string') ||
      typeof orderIndex !== 'number'
    ) {
      throw new Error('MENU.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default Menu;
