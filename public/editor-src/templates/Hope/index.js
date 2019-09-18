const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Join = require("./pages/Join");
const Press = require("./pages/Press");
const Projects = require("./pages/Projects");
const ProjectDetails = require("./pages/Projectdetails");
const Contact = require("./pages/Contact");
const HopeStyles = require("./styles/Hope");

module.exports = {
  name: "Hope",
  color: "#2C4C44",
  cat: [0, 12],
  pages: [Homepage, About, Join, Press, Projects, ProjectDetails, Contact],
  styles: [HopeStyles]
};
