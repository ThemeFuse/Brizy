const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const ProjectDetails = require("./pages/ProjectDetails");
const Projects = require("./pages/Projects");
const MinimalStyle = require("./styles/Minimal");

module.exports = {
  name: "Minimal",
  color: "#000000",
  cat: [0, 9],
  pages: [Homepage, About, Projects, ProjectDetails],
  styles: [MinimalStyle]
};
