const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Portfolio = require("./pages/Portfolio");
const Contact = require("./pages/Contact");
const CorpioStyle = require("./styles/Corpio");

module.exports = {
  name: "Corpio",
  color: "#5881E9",
  cat: [0, 1],
  pages: [Homepage, About, Services, Portfolio, Contact],
  styles: [CorpioStyle]
};
