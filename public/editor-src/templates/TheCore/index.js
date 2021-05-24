const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Pricing = require("./pages/Pricing");
const ProjectDetails = require("./pages/ProjectDetails");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");

const TheCoreStyle = require("./styles/TheCore");

module.exports = {
  name: "The Core",
  color: "#D12A5C",
  cat: [0, 1, 3],
  pages: [Homepage, About, Pricing, ProjectDetails, Gallery, Contact],
  styles: [TheCoreStyle]
};
