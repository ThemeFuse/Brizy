const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Homepage2 = require("./pages/Homepage2");
const Contact = require("./pages/Contact");
const StarterStyle = require("./styles/Starter");

module.exports = {
  name: "Starter",
  color: "#1292EE",
  cat: [0, 6, 17],
  pages: [Homepage, About, Services, Homepage2, Contact],
  styles: [StarterStyle]
};
