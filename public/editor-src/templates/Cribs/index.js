const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Portfolio = require("./pages/Portfolio");
const PortfolioDetails = require("./pages/PortfolioDetails");
const Contact = require("./pages/Contact");

const CribsStyle = require("./styles/Cribs");

module.exports = {
  name: "Cribs",
  color: "#303030",
  cat: [0, 3, 100],
  pages: [Homepage, About, Portfolio, PortfolioDetails, Contact],
  styles: [CribsStyle]
};
