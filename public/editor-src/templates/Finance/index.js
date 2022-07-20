const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Specialists = require("./pages/Specialists");
const Contact = require("./pages/Contact");
const WhyUs = require("./pages/WhyUs");
const FinanceStyle = require("./styles/Finance");

module.exports = {
  name: "Finance",
  color: "#ECDDF1",
  cat: [0, 1],
  pages: [Homepage, About, Specialists, Contact, WhyUs],
  styles: [FinanceStyle]
};
