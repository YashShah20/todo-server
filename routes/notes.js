const express = require("express");
const router = express.Router();

const notes = require("../controllers/notes");

// session validation
router.use((req, res, next) => {
  // commented because session is not working properly

  if (req.session.name) {
    next();
  } else {
    res.end("please login into the system...");
  }

  // temp. fix
  // req.session.name = "Yash";
  // next();
});

// get request
router.get("/", notes.getNotes);
router.get("/:yy-:mm-:dd", notes.getNotesByDate);

// post request
router.post("/", notes.addNote);

// update request
router.put("/:id/update", notes.updateNote);

// delete request
router.delete("/:id/delete", notes.deleteNote);

module.exports = router;
