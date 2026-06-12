import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';

class AddUserUseCase {
  constructor({ userRepository, passwordHash, roleRepository }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._roleRepository = roleRepository;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);

    await this._userRepository.verifyAvailableUsername(registerUser.username);
    const hashedPassword = await this._passwordHash.hash(registerUser.password);

    const registeredUser = await this._userRepository.addUser(
      new RegisterUser({
        username: registerUser.username,
        password: hashedPassword,
        fullname: registerUser.fullname,
        roleIds: registerUser.roleIds,
      }),
    );

    const rolePromises = registerUser.roleIds.map((roleId) =>
      this._roleRepository.addUserRole(registeredUser.id, roleId),
    );
    await Promise.all(rolePromises);

    return new RegisteredUser({
      id: registeredUser.id,
      username: registeredUser.username,
      fullname: registeredUser.fullname,
    });
  }
}

export default AddUserUseCase;
