const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Gallery = require("./pages/Gallery");
const Pricing = require("./pages/Pricing");
const ProjectDetails = require("./pages/ProjectDetails");
const Services = require("./pages/Services");

const KidsPlayStyle = require("./styles/KidsPlay");

module.exports = {
  name: "KidsPlay",
  color: "#622A14",
  cat: [0, 16],
  pages: [Homepage, About, Contact, Gallery, Pricing, ProjectDetails, Services],
  styles: [KidsPlayStyle]
};
