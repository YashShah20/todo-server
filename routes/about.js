const express = require("express");
const router = express.Router();

// get request
router.get("/", (req, res) => {
  res.send(`
    This is simple notes application.
    It provides CRUD operations.
    `);
});

module.exports = router;
