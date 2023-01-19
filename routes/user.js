const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

// post request
router.post("/signup", user.signup);
router.post("/signout", user.signout);
router.post("/", user.signin);

module.exports = router;
