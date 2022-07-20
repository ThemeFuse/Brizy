const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const About = require("./pages/About");
const Services = require("./pages/Services");
const ServiceDetails = require("./pages/ServiceDetails");
const Portfolio = require("./pages/Portfolio");
const PortfolioDetails = require("./pages/PortfolioDetails");
const Contact = require("./pages/Contact");

const EladioStyle = require("./styles/Eladio");

module.exports = {
  name: "Eladio",
  color: "#E62B4A",
  cat: [0, 1, 3],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    About,
    Services,
    ServiceDetails,
    Portfolio,
    PortfolioDetails,
    Contact
  ],
  styles: [EladioStyle]
};
