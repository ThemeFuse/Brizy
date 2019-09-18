const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Apartments = require("./pages/Apartments");
const Plans = require("./pages/Plans");
const Contact = require("./pages/Contact");
const SkypointStyles = require("./styles/Skypoint");

module.exports = {
  name: "Skypoint",
  color: "#887D9E",
  cat: [0, 4, 1],
  pages: [Homepage, About, Apartments, Plans, Contact],
  styles: [SkypointStyles]
};
