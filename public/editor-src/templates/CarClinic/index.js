const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Offers = require("./pages/Offers");
const Pricing = require("./pages/Pricing");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");
const CarClinicStyles = require("./styles/CarClinic");

module.exports = {
  name: "Car Clinic",
  color: "#A9A9A9",
  cat: [0, 5],
  pages: [Homepage, About, Offers, Pricing, Services, Contact],
  styles: [CarClinicStyles]
};
