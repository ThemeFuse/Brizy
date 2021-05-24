const Homepage = require("./pages/Homepage");

const CourseStyle = require("./styles/Course");

module.exports = {
  name: "Course",
  color: "",
  cat: [0, 1, 6, 11],
  pages: [
    Homepage,
  ],
  styles: [CourseStyle]
};