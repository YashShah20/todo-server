const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const admin = require("../controllers/admin");

const express = require("express");
const router = express.Router();

// admin auth
router.use((req, res, next) => {
  const authToken = req.headers.token;

  if (!authToken) {
    return res.status(403).json({ error: "admin rights required" });
  }

  try {
    const user = jwt.verify(authToken, SECRET_KEY);
    if (!user || user.role != 3) {
      return res.status(403).json({ error: "admin rights required" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

// user update
// user delete

// all user info
// info about particular user

router.get("/users", admin.getUsers);
router.get("/user/:id", admin.getUser);
router.put("/user/:id/update", admin.updateUser);
router.delete("/user/:id/delete", admin.deleteUser);

module.exports = router;
