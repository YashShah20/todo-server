const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { database, SECRET_KEY } = require("../config");

const Pool = require("pg").Pool;
const pool = new Pool(database);

exports.signin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await pool.query(`select * from users where name='${name}';`);

    if (Object.keys(user.rows).length == 0) {
      return res.status(404).json({ error: "invalid credentails" });
    }

    const matchedPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!matchedPassword) {
      return res.status(404).json({ error: "invalid credentails" });
    }

    const token = jwt.sign(
      { name: user.rows[0].name, role: user.rows[0].role },
      SECRET_KEY
    );
    res.status(200).json({ user: user.rows[0], token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.signup = [
  // checking whether user exists or not?
  async (req, res, next) => {
    const user = await pool.query(
      `select * from users where name = '${req.body.name}';`
    );
    if (user.rowCount === 0) {
      next();
    } else {
      return res.status(400).json({ error: "in use" });
    }
  },

  // creating new user
  async (req, res) => {
    try {
      const { name, password, role } = req.body;
      const hasedPassword = await bcrypt.hash(password, 10);

      const user = await pool.query(
        `insert into users (name,password,role) values ($1,$2,$3) returning *`,
        [name, hasedPassword, role]
      );

      if (user.rowCount === 1) {
        const token = jwt.sign({ name: name, role: role }, SECRET_KEY);
        res.status(201).json({ user: user.rows[0], token: token });
      } else {
        res.status(400).json({ error: `failed` });
      }
    } catch (error) {
      console.log(error.message);
      // res.end({ error: "error" });
    }
  },
];

exports.signout = (req, res) => {};

exports.getUser = async (req, res) => {
  const authToken = req.headers.token;

  if (!authToken) {
    return res.status(403).json({ error: "unauthorized access" });
  }

  try {
    const user = jwt.verify(authToken, SECRET_KEY);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "invalid token" });
  }
};

exports.updatePassword = async (req, res) => {
  const authToken = req.headers.token;

  if (!authToken) {
    return res.status(403).json({ error: "unauthorized access" });
  }

  try {
    const user = jwt.verify(authToken, SECRET_KEY);

    const { oldPassword, newPassword } = req.body;
    const { name } = user;

    const result = await pool.query(
      `select password from users where name='${name}'`
    );

    if (result.rows.length != 1) {
      return res.status(400).json({ error: "something went wrong" });
    }


    const matchedPassword = await bcrypt.compare(
      oldPassword,
      result.rows[0].password
    );

    if (!matchedPassword) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await pool.query(
      `update users set password='${newHashedPassword}' where name='${name}'`
    );

    res.json(updated.rows);
  } catch (error) {
    console.log(error);
  }
};
