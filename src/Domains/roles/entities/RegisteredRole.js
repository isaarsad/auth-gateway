class RegisteredRole {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, roleName } = payload;

    this.id = id;
    this.roleName = roleName;
  }

  _verifyPayload(payload) {
    const { id, roleName } = payload;

    if (!id || !roleName) {
      throw new Error('NEW_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof roleName !== 'string') {
      throw new Error('NEW_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default RegisteredRole;
