// import for express
const express = require("express");
// call for express
const app = express();
const port = 3000;

// 1) body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // مهم عشان form submit

// 2) View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", "./views");

const coursesRouter = require("./router/courses.router");

// API
app.use("/api/courses", coursesRouter);

// VIEW
app.use("/courses", coursesRouter);
// listen to the server
app.listen(port, () => {
  console.log("server is running on port" + port);
});
