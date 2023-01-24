const config = require("../config");

// database connection
const Pool = require("pg").Pool;
const pool = new Pool(config.database);

exports.getNotes = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    let page = req.query.page;
    let note_per_page = req.query.note_per_page;
    let query = "";
    if (page) {
      note_per_page = note_per_page || 5;
      let offset = note_per_page * (page - 1);
      query = `select * from notes where name='${name}' order by id desc limit ${note_per_page} offset ${offset};`;
    } else {
      query = `select * from notes where name='${name}' order by id desc`;
    }
    console.log(query);
    const notes = await pool.query(query);

    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getNotesSize = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    const query = `select count(*) from notes where name='${name}'`;
    const notes = await pool.query(query);
    console.log(notes.rows);
    res.json(notes.rows[0]);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getNotesByYear = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    const dd = "01";
    const mm = "01";
    const yy = parseInt(req.params.yy);

    const notes = await pool.query(
      `select * from notes where (name='${name}') and created_on>='${yy}-${mm}-${dd}' and created_on<'${
        yy + 1
      }-${mm}-${dd}';`
    );
    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getNotesByMonth = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    const dd = "01";
    const mm =
      parseInt(req.params.mm) < 10
        ? "0" + parseInt(req.params.mm)
        : parseInt(req.params.mm);
    const end_mm =
      parseInt(req.params.mm) + 1 < 10
        ? "0" + (parseInt(req.params.mm) + 1)
        : parseInt(req.params.mm) + 1;
    const yy = parseInt(req.params.yy);

    const notes = await pool.query(
      `select * from notes where (name='${name}') and created_on>='${yy}-${mm}-${dd}' and created_on<'${yy}-${end_mm}-${dd}';`
    );
    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.getNotesByDate = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    const dd =
      parseInt(req.params.dd) < 10
        ? "0" + parseInt(req.params.dd)
        : parseInt(req.params.dd);
    const end_dd =
      parseInt(req.params.dd) + 1 < 10
        ? "0" + (parseInt(req.params.dd) + 1)
        : parseInt(req.params.dd) + 1;
    const mm =
      parseInt(req.params.mm) < 10
        ? "0" + parseInt(req.params.mm)
        : parseInt(req.params.mm);
    const yy = parseInt(req.params.yy);

    const notes = await pool.query(
      `select * from notes where (name='${name}') and created_on>='${yy}-${mm}-${dd}' and created_on<'${yy}-${mm}-${end_dd}';`
    );
    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.addNote = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    const content = req.body.content;

    console.log(content);
    const notes = await pool.query(
      `insert into notes (name,content) values ($1,$2) returning *`,
      [name, content]
    );

    console.log(notes.rows[0]);
    res.status(200).json(notes.rows[0]);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    // console.log(req.body);
    const content = req.body.content;
    const id = req.params.id;

    // console.log(id);

    const notes = await pool.query(
      `update notes set content='${content}' where id=${id} and (name='${name}' or ${role}=3)
      returning *`
    );
    console.log(`update notes set content='${content}' where id=${id} and (name='${name}' or ${role}=3)
    returning *`);
    res.json(notes.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { name, role } = req.user;
    // const name = "Yash"; // temp. fix

    const id = req.params.id;

    const notes = await pool.query(
      `delete from notes where id=${id} and (name='${name}' or ${role}=3) returning *`
    );
    res.json(notes.rows);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
