const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Portfolio = require("./pages/Portfolio");
const Contact = require("./pages/Contact");
const BrandioStyle = require("./styles/Brandio");

module.exports = {
  name: "Brandio",
  color: "#6564AA",
  cat: [0, 1],
  pages: [Homepage, About, Services, Portfolio, Contact],
  styles: [BrandioStyle]
};
