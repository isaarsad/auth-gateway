class NewRoleMenuAccess {
  constructor(payload) {
    this._verifyPayload(payload);

    const { roleId, menuId } = payload;

    this.roleId = roleId;
    this.menuId = menuId;
  }

  _verifyPayload(payload) {
    const { roleId, menuId } = payload;

    if (!roleId || !menuId) {
      throw new Error('NEW_ROLE_MENU_ACCESS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof roleId !== 'string' || typeof menuId !== 'string') {
      throw new Error('NEW_ROLE_MENU_ACCESS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewRoleMenuAccess;
