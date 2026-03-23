const { validationResult } = require("express-validator");

const Course = require("../models/courses.models");

const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

const getCourseById = async (req, res) => {
  // we should convert the courseId to number because it is string by default using +
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "course not found" });
  }
  res.json(course);
};

const AddNewCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 400 ==> bad request
    return res.status(400).json({ errors: errors.array() });
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  // 201 ==> created
  res.status(201).json(newCourse);
};

const updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
  // new = true ==> to return the updated course
  const course = await Course.findByIdAndUpdate(
    courseId,
    { $set: { ...req.body } },
    { new: true },
  );
  if (!course) {
    return res.status(404).json({ message: "course not found" });
  }
  res.json({ message: "course updated successfully", course });
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.deleteOne({ _id: courseId });
  res.status(200).json({ message: "course deleted successfully" });
};

// ===== VIEW (EJS) =====
const renderCoursesPage = async (req, res) => {
  const courses = await Course.find();
  // اسم الملف في views: courses.ejs
  res.render("courses", { courses, errors: [] });
};

const addCourseFromForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const courses = await Course.find();
    return res
      .status(400)
      .render("courses", { courses, errors: errors.array() });
  }

  await Course.create({
    name: req.body.name,
    description: req.body.description,
    title: req.body.title || "",
  });

  return res.redirect("/courses/page");
};
module.exports = {
  getAllCourses,
  getCourseById,
  AddNewCourse,
  updateCourse,
  deleteCourse,
  renderCoursesPage,
  addCourseFromForm,
};
