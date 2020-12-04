const Homepage = require("./pages/Homepage");
const Services = require("./pages/Services");
const About = require("./pages/About");
const Prices = require("./pages/Prices");
const Contact = require("./pages/Contact");

const FixitStyle = require("./styles/Fixit");

module.exports = {
  name: "Fixit",
  color: "#0D71FE",
  cat: [0, 15],
  pages: [Homepage, Services, About, Prices, Contact],
  styles: [FixitStyle]
};
