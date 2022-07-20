const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Details = require("./pages/Details");
const Portfolio = require("./pages/Portfolio");
const Contact = require("./pages/Contact");
const InteriorStyle = require("./styles/Interior");

module.exports = {
  name: "Interior",
  color: "#9C8B77",
  cat: [0, 1, 3],
  pages: [Homepage, About, Details, Portfolio, Contact],
  styles: [InteriorStyle]
};
