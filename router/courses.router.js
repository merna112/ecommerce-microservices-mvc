// import courses
const express = require("express");
const { body } = require("express-validator");
let CoursesController = require("../controllers/course.controller");
// Router هو Mini Express App صغير
// تقدر تستخدمه لتنظيم الـ routes بدل ما تحطهم كلهم في app.js.

const router = express.Router();
router.get("/page", CoursesController.renderCoursesPage);

// من الافضل كتابه /api/courses
// get all courses
// Route                 Handler
router
  .route("/")
  .get(CoursesController.getAllCourses)
  .post(
    [
      body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
      body("description").notEmpty().withMessage("description is required"),
    ],
    CoursesController.AddNewCourse,
  );

// get course by id
// in express we can write parameter in url by :parameterName
router
  .route("/:courseId")
  .get(CoursesController.getCourseById)
  .patch(CoursesController.updateCourse)
  .delete(CoursesController.deleteCourse);

//add new Course
// فى كذا طريقه انى ابعت داتا
// paramters --> api/cources/1/CSE477
// req body --> json,xml,text
// update course

// delete course

// ===== VIEW (EJS) =====
router.post(
  "/page/add",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("description is required"),
  ],
  CoursesController.addCourseFromForm
);

module.exports = router;
