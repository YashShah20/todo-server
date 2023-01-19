const config = require("../config");

const Pool = require("pg").Pool;
const pool = new Pool(config.database);

exports.signin = async (req, res) => {
  try {
    // // console.log(req.body);

    const user = await pool.query(
      `select password from users where name='${req.body.name}';`
    );

    if (Object.keys(user.rows).length == 0) {
      res.send("invalid credential");
    } else if (user.rows[0].password === req.body.password) {
      // setting session variable
      req.session.name = req.body.name;

      // // console.log(req.session);
      res.send("success");
    } else {
      res.send("invalid credentials");
    }
  } catch (error) {
    res.send("error");
    // console.log(error);
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
      res.end("in use");
    }
  },

  // creating new user
  async (req, res) => {
    try {
      const user = await pool.query(
        `insert into users (name,password) values ($1,$2) returning *`,
        [req.body.name, req.body.password]
      );
      if (user.rowCount === 1) {
        res.send(`success`);
      } else {
        res.send(`failed`);
      }
    } catch (error) {
      // // console.log(error.message);
      res.end("error");
    }
  },
];

exports.signout = (req, res) => {
  req.session.destroy((error) => {
    if (!error) {
      // console.log(`session destroyed...`);
    }
  });
  res.send("success");
};
