const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// importing config
const config = require("./config");

// importing routes
const noteRouter = require("./routes/notes");
const aboutRouter = require("./routes/about");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

//session
// app.use(
//   session({
//     secret: "secret",
//     saveUninitialized: true,
//     resave: false,
//     cookie: {
//       sameSite: false,
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 24,
//       httpOnly: false,
//       path: "",
//     },
//   })
// );

// cors
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,

  })
);

// body parser
app.use(bodyParser.json());

// cookie parser
// app.use(cookieParser());

// routes
app.use("/", userRouter);
app.use("/notes", noteRouter);
app.use("/about", aboutRouter);
app.use("/admin", adminRouter);

// connection
const port = config.port;

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
