const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Careers = require("./pages/Careers");
const CaseStudies = require("./pages/CaseStudies");
const Pricing = require("./pages/Pricing");
const Services = require("./pages/Services");

const ThePracticeStyle = require("./styles/ThePractice");

module.exports = {
  name: "The Practice",
  color: "#4C4C4C",
  cat: [0, 1],
  pages: [Homepage, About, Contact, Careers, CaseStudies, Pricing, Services],
  styles: [ThePracticeStyle]
};
