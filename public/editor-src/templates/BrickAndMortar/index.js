const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Projects = require("./pages/Projects");
const Contact = require("./pages/Contact");

const BrickAndMortarStyle = require("./styles/BrickAndMortar");

module.exports = {
  name: "Brick And Mortar",
  color: "#F8B728",
  cat: [0, 1],
  pages: [
    Homepage,
    Homepage2,
    About,
    Services,
    Projects,
    Contact
  ],
  styles: [BrickAndMortarStyle]
};