import { createContainer } from 'instances-container';

// --- External & Database ---
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './database/postgres/pool.js';

// --- Domains ---
import UserRepository from '../Domains/users/UserRepository.js';
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js';

// --- Applications (Use Cases & Security Interfaces) ---
import PasswordHash from '../Applications/security/PasswordHash.js';
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js';

import AddUserUseCase from '../Applications/use_case/users/AddUserUseCase.js';
import LoginUserUseCase from '../Applications/use_case/authentications/LoginUserUseCase.js';
import LogoutUserUseCase from '../Applications/use_case/authentications/LogoutUserUseCase.js';
import RefreshAuthenticationUseCase from '../Applications/use_case/authentications/RefreshAuthenticationUseCase.js';

// --- Infrastructure Implementations ---
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js';
import BcryptPasswordHash from './security/BcryptPasswordHash.js';
import JwtTokenManager from './security/JwtTokenManager.js';

const container = createContainer();

// Registering Repositories and Security Services
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }, { concrete: nanoid }] },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: { dependencies: [{ concrete: pool }] },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: { dependencies: [{ concrete: bcrypt }] },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: { dependencies: [{ concrete: jwt }] },
  },
]);

// Registering Use Cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'passwordHash', internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
        { name: 'passwordHash', internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [{ name: 'authenticationRepository', internal: AuthenticationRepository.name }],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
      ],
    },
  },
]);

export default container;
