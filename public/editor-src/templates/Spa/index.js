const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");
const Wellness = require("./pages/Wellness");
const SpaStyle = require("./styles/Spa");

module.exports = {
  name: "Spa",
  color: "#586BB4",
  cat: [0, 12, 13],
  pages: [Homepage, About, Services, Contact, Wellness],
  styles: [SpaStyle]
};
