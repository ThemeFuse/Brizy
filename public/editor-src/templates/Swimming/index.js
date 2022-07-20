const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Pricing = require("./pages/Pricing");
const SwimmingStyle = require("./styles/Swimming");

module.exports = {
  name: "Swimming",
  color: "#07325F",
  cat: [0, 1, 13],
  pages: [Homepage, About, Gallery, Contact, Pricing],
  styles: [SwimmingStyle]
};
