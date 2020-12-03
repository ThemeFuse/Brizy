const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const About = require("./pages/About");
const Services = require("./pages/Services");
const ServiceDetails = require("./pages/ServiceDetails");
const Pricing = require("./pages/Pricing");
const Gallery = require("./pages/Gallery");
const BookAppointment = require("./pages/BookAppointment");
const Contact = require("./pages/Contact");

const RefixStyle = require("./styles/Refix");

module.exports = {
  name: "Refix",
  color: "#0BA0C0",
  cat: [0, 1, 15, 100],
  pages: [
    Homepage,
    Homepage2,
    About,
    Services,
    ServiceDetails,
    Pricing,
    Gallery,
    BookAppointment,
    Contact
  ],
  styles: [RefixStyle]
};
