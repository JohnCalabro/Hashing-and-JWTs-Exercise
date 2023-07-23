/** User class for message.ly */
const db = require("../db");  // almost forgot this
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError"); // almost forgot this

const { BCRYPT_WORK_FACTOR } = require("../config");




/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    // const { username, password, first_name, last_name, phone } = req.body;

    const hpw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone,
        join_at, last_login_at)
       VALUES($1, $2, $3, $4, $5, current_timestamp, current_timestamp) 
       RETURNING username, password, first_name, last_name, phone
      `,
      [username, hpw, first_name, last_name, phone ])

      return result.rows[0];
  }
// my solution was nearly identical, was just missing the 2 current_timestamp in VALUES

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      "SELECT password FROM users WHERE username = $1",
      [username]);
  let u = result.rows[0];
  return await bcrypt.compare(password, u.password)
   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}

// I am comfortable with authentifcation and understand the patterns. To save time
// I'll turn this in as a first commit, can sign up and login using OOP those
// features are functioning. 
module.exports = User;