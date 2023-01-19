const config = require("../config");

// database connection
const Pool = require("pg").Pool;
const pool = new Pool(config.database);

exports.getNotes = async (req, res) => {
  try {
    const name = req.session.name;
    // const name = "Yash"; // temp. fix

    const notes = await pool.query(`select * from notes where name='${name}';`);

    // console.log(notes.rows);
    res.json(notes.rows);
  } catch (error) {
    res.send("error");
  }
};

exports.getNotesByDate = async (req, res) => {
  try {
    const name = req.session.name;
    // const name = "Yash"; // temp. fix

    const dd = parseInt(req.params.dd || 1);
    const mm = "0" + parseInt(req.params.mm || 1); // temp. fix
    const yy = parseInt(req.params.yy);

    const notes = await pool.query(
      `select * from notes where name='${name}' and created_on>='${yy}-${mm}-${dd}' and created_on<'${yy}-${mm}-${
        dd + 1
      }';`
    );
    res.json(notes.rows);
  } catch (error) {
    res.send("error");
  }
};

exports.addNote = async (req, res) => {
  try {
    const name = req.session.name;
    // const name = "Yash"; // temp. fix

    const content = req.body.content;

    const notes = await pool.query(
      `insert into notes (name,content) values ($1,$2) returning *`,
      [name, content]
    );

    res.send(`success`);
  } catch (error) {
    res.send("error");
  }
};

exports.updateNote = async (req, res) => {
  try {
    const name = req.session.name;
    // const name = "Yash"; // temp. fix

    const content = req.body.content;
    const id = req.params.id;

    const notes = await pool.query(
      `update notes set content='${content}' where id=${id} and name='${name}' returning *`
    );
    res.send(`success`);
  } catch (error) {
    res.send("error");
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const name = req.session.name;
    // const name = "Yash"; // temp. fix

    const id = req.params.id;

    const notes = await pool.query(
      `delete from notes where id=${id} and name='${name}' returning *`
    );
    res.send(`success`);
  } catch (error) {
    res.send("error");
  }
};
