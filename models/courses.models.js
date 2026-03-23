const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/CSE474_DB'
mongoose.connect(url).then(() => {
  console.log("connected to the database successfully");
}).catch((err) => {
  console.error("Failed to connect to database:", err.message);
  process.exit(1);
});

const courseSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;