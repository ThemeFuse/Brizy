const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Details = require("./pages/Details");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const Portfolio = require("./pages/Portfolio");
const GardenStyle = require("./styles/Garden");

module.exports = {
  name: "Garden",
  color: "#82BE51",
  cat: [0, 100, 9],
  pages: [Homepage, About, Details, Contact, Services, Portfolio],
  styles: [GardenStyle]
};
