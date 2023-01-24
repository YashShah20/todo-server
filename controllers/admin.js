const config = require("../config");
const bcrypt = require("bcrypt");

// database connection
const Pool = require("pg").Pool;
const pool = new Pool(config.database);

exports.getUsers = async (req, res) => {
  try {
    const query = `select users.*,(select count(*) from notes where notes.name=users.name) as notes_count from users order by users.role desc, users.id ;`;
    const notes = await pool.query(query);

    console.log(notes.rows);
    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(`select * from users where id=${id}`);

    const query = `select notes.id,notes."content",notes.created_on,users."name",users."role" from users inner join notes on users.name=notes.name where users.id=${id} order by notes.id desc`;
    const notes = await pool.query(query);

    console.log(notes.rows);
    res.json({ user: user.rows[0], notes: notes.rows });
  } catch (error) {
    res.status(400).json(error.notesmessage);
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role } = req.body;
    console.log(req.user);

    let query = "";
    if (!password || password == "") {
      query = `update users set name='${name}',role=${role} where id=${id}`;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `update users set name='${name}', password='${hashedPassword}',role=${role} where id=${id}`;
    }
    const notes = await pool.query(query);

    console.log(query);
    console.log(notes.rows);
    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `delete from users where id=${id}`;
    const notes = await pool.query(query);

    console.log(notes.rows);
    res.json(notes);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
