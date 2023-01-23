const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const notes = require("../controllers/notes");

// session validation
router.use((req, res, next) => {
  const authToken = req.headers.token;

  if (!authToken) {
    return res.status(403).json({ error: "unauthorized access" });
  }

  try {
    const user = jwt.verify(authToken, SECRET_KEY);

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ error: "invalid token" });
  }
});

// get request
router.get("/", notes.getNotes);
router.get("/size", notes.getNotesSize);
router.get("/:yy/", notes.getNotesByYear);
router.get("/:yy/:mm/", notes.getNotesByMonth);
router.get("/:yy/:mm/:dd", notes.getNotesByDate);

// post request
router.post("/", notes.addNote);

// update request
router.put("/:id/update", notes.updateNote);

// delete request
router.delete("/:id/delete", notes.deleteNote);

module.exports = router;
