const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Careers = require("./pages/Careers");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const CallCenterStyle = require("./styles/CallCenter");

module.exports = {
  name: "Call Center",
  color: "#7D6ABB",
  cat: [0, 1],
  pages: [Homepage, About, Careers, Contact, Services],
  styles: [CallCenterStyle]
};
