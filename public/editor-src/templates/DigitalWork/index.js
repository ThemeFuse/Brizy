const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Portfolio = require("./pages/Portfolio");
const DetailsPage = require("./pages/DetailsPage");
const Contact = require("./pages/Contact");

const DigitalWorkStyle = require("./styles/DigitalWork");

module.exports = {
  name: "DigitalWork",
  color: "#3AC9FF",
  cat: [0, 1, 100],
  pages: [Homepage, About, Services, Portfolio, DetailsPage, Contact],
  styles: [DigitalWorkStyle]
};
