const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const FAQ = require("./pages/FAQ");
const Portfolio = require("./pages/Portfolio");
const PortfolioSingle = require("./pages/PortfolioSingle");
const Contact = require("./pages/Contact");
const OrangePhotographyStyle = require("./styles/OrangePhotography");

module.exports = {
  name: "Orange Photography",
  color: "#8b5c24",
  cat: [0, 3],
  pages: [Homepage, About, FAQ, Portfolio, PortfolioSingle, Contact],
  styles: [OrangePhotographyStyle]
};
