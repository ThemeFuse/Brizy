const Homepage = require("./pages/Homepage");
const Contact = require("./pages/Contact");
const Course = require("./pages/Course");
const Pricing = require("./pages/Pricing");
const Team = require("./pages/Team");

const PhotoCourseStyle = require("./styles/PhotoCourse");

module.exports = {
  name: "Photo Course",
  color: "#e8604c",
  cat: [0, 3, 6],
  pages: [Homepage, Contact, Course, Pricing, Team],
  styles: [PhotoCourseStyle]
};
