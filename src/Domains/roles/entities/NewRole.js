class NewRole {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, name } = payload;

    this.id = id;
    this.name = name;
  }

  _verifyPayload(payload) {
    const { id, name } = payload;

    if (!id || !name) {
      throw new Error('NEW_ROLE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof name !== 'string') {
      throw new Error('NEW_ROLE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewRole;
