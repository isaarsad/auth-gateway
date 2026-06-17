import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../Domains/users/UserRepository.js';

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const client = await this._pool.connect();
    const { username, password, fullname, roleIds } = registerUser;
    const id = `user-${this._idGenerator()}`;

    try {
      await client.query('BEGIN');

      const insertUserQuery = {
        text: 'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
        values: [id, username, password, fullname],
      };
      const userResult = await client.query(insertUserQuery);
      const userId = userResult.rows[0].id;

      const insertRolesQuery = {
        text: 'INSERT INTO user_roles(user_id, role_id) SELECT $1, * FROM UNNEST($2::text[])',
        values: [userId, roleIds],
      };
      await client.query(insertRolesQuery);

      await client.query('COMMIT');

      return new RegisteredUser({ ...userResult.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('kredensial yang Anda berikan salah');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}

export default UserRepositoryPostgres;
