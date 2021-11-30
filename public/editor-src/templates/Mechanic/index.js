const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const Pricing = require("./pages/Pricing");
const MechanicStyle = require("./styles/Mechanic");

module.exports = {
  name: "Mechanic",
  color: "#F60003",
  cat: [0, 5, 15],
  pages: [Homepage, About, Gallery, Contact, Services, Pricing],
  styles: [MechanicStyle]
};
