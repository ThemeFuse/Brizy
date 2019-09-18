const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Faculties = require("./pages/Faculties");
const Contact = require("./pages/Contact");
const CollegeStyles = require("./styles/College");

module.exports = {
  name: "College",
  color: "#7FB794",
  cat: [0, 6],
  pages: [Homepage, About, Faculties, Contact],
  styles: [CollegeStyles]
};
