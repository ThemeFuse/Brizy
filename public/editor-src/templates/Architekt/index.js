const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Portfolio = require("./pages/Portfolio");
const Services = require("./pages/Services");
const Works = require("./pages/Works");
const Contact = require("./pages/Contact");
const ArchitektStyles = require("./styles/Architekt");

module.exports = {
  name: "Architekt",
  color: "#5F5D8E",
  cat: [0, 1, 3, 4],
  pages: [Homepage, About, Portfolio, Services, Works, Contact],
  styles: [ArchitektStyles]
};
