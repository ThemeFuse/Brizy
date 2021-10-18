const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Portfolio = require("./pages/Portfolio");
const ProjectDetails = require("./pages/ProjectDetails");
const Services = require("./pages/Services");

const LodizStyle = require("./styles/Lodiz");

module.exports = {
  name: "Lodiz",
  color: "#CC9B55",
  cat: [0, 3, 4],
  pages: [Homepage, About, Contact, Portfolio, ProjectDetails, Services],
  styles: [LodizStyle]
};
