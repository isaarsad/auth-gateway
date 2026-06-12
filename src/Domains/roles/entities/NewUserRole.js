class NewUserRole {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, roleId } = payload;

    this.userId = userId;
    this.roleId = roleId;
  }

  _verifyPayload(payload) {
    const { userId, roleId } = payload;

    if (!userId || !roleId) {
      throw new Error('NEW_USER_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof roleId !== 'string') {
      throw new Error('NEW_USER_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewUserRole;
