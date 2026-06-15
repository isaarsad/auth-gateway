class NewMenu {
  constructor(payload) {
    this._verifyPayload(payload);

    const { menuName, url, parentId, orderIndex } = payload;

    this.menuName = menuName;
    this.url = url;
    this.parentId = parentId || null;
    this.orderIndex = orderIndex;
  }

  _verifyPayload(payload) {
    const { menuName, url, parentId, orderIndex } = payload;

    if (!menuName || !url || orderIndex === undefined) {
      throw new Error('NEW_MENU.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof menuName !== 'string' ||
      typeof url !== 'string' ||
      (parentId !== null && typeof parentId !== 'string') ||
      typeof orderIndex !== 'number'
    ) {
      throw new Error('NEW_MENU.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewMenu;
