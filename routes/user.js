const { request } = require("express");
const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

// post request
router.post("/signup", user.signup);
router.post("/signout", user.signout); // not needed
router.post("/", user.signin);

// get requests
router.get("/user", user.getUser);

// update request
router.put("/user/update", user.updatePassword);

module.exports = router;
