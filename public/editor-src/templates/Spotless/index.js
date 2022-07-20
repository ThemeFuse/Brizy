const Homepage = require("./pages/Homepage");
const Rates = require("./pages/Rates");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");

const SpotlessStyle = require("./styles/Spotless");

module.exports = {
  name: "Spotless",
  color: "#1C84E2",
  cat: [0, 15],
  pages: [Homepage, Rates, Services, Contact],
  styles: [SpotlessStyle]
};
