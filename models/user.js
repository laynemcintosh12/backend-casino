const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");


class User {

  /** authenticate user with username, password_hash.
   *
   * Returns { username, email, isAdmin }
   *
   * Throws UnauthorizedError is user not found or wrong password_hash.
   **/

  static async authenticate(username, password) {
    const result = await db.query(
          `SELECT username,
                  password,
                  email,
                  isAdmin
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password_hash
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password_hash");
  }


  /** Register user with data.
   *
   * Returns { username, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, email, isAdmin }) {
    console.log("registering user", username, password, email, isAdmin);
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedpassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            email,
            balance,
            isAdmin)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, email, isAdmin`,
        [
          username,
          hashedpassword,
          email,
          100000,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }


  /** Find all users.
   *
   * Returns [{ username, email, isAdmin }, ...]
   **/

  static async getAll() {
    const result = await db.query(
          `SELECT username,
                  email,
                  balance,
                  isAdmin
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }


  /** Given a username, return data about user.
   *
   * Returns { username, email, balance, isAdmin }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  email,
                  balance,
                  isAdmin
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user Here: ${username}`);

    return user;
  }


  /** Given a username, return username and balance
   * 
   * returns { username, balance }
   * 
   * Throws NotFoundError if user not found.
   */
  static async getBalance(username) {
    console.log("getting balance for user", username);
    const userRes = await db.query(
      `SELECT username,
              balance
          FROM users
          WHERE username = $1`,
          [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user Here: ${username}`);

    return user;
  }


  /** Updates a users balance based off a bet 
   * 
   * returns { username, balance }
   * 
   * Throws NotFoundError if user not found.
   */
  static async updateBalance(username, bet) {
    const userRes = await db.query(
      `UPDATE users
       SET balance = balance + $1
       WHERE username = $2
       RETURNING username, balance`,
       [bet.amount, username],
    );

    const user = userRes.rows[0];

    if(!user) throw new NotFoundError(`No user Here: ${username}`);

    return user;
  }

  /** Delete given user from database; returns undefined. */
  static async delete(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

}


module.exports = User;