const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Pricing = require("./pages/Pricing");
const Contact = require("./pages/Contact");
const AdvisorsStyle = require("./styles/Advisors");

module.exports = {
  name: "Advisors",
  color: "#5599B3",
  cat: [0, 1],
  pages: [Homepage, About, Services, Pricing, Contact],
  styles: [AdvisorsStyle]
};
