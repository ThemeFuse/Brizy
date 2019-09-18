const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Projects = require("./pages/Projects");
const ProjectsDetails = require("./pages/ProjectsDetails");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");
const BaseGroundStyles = require("./styles/BaseGround");

module.exports = {
  name: "Base Ground",
  color: "#9BADBF",
  cat: [0, 1],
  pages: [Homepage, About, Projects, ProjectsDetails, Services, Contact],
  styles: [BaseGroundStyles]
};
