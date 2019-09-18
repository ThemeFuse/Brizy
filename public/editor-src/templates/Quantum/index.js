const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Work = require("./pages/Work");
const Services = require("./pages/Services");
const ProjectDetails = require("./pages/ProjectDetails");
const Contact = require("./pages/Contact");
const QuantumStyles = require("./styles/Quantum");

module.exports = {
  name: "Quantum",
  color: "#CD4B61",
  cat: [0, 3, 1],
  pages: [Homepage, About, Work, Services, ProjectDetails, Contact],
  styles: [QuantumStyles]
};
