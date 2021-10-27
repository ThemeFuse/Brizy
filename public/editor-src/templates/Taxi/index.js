const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Career = require("./pages/Career");
const Contact = require("./pages/Contact");
const Features = require("./pages/Features");
const OurApp = require("./pages/OurApp");
const Pricing = require("./pages/Pricing");

const TaxiStyle = require("./styles/Taxi");

module.exports = {
  name: "Taxi",
  color: "#FFB400",
  cat: [0, 1],
  pages: [Homepage, About, Career, Contact, Features, OurApp, Pricing],
  styles: [TaxiStyle]
};
