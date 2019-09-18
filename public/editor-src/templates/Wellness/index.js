const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Appointments = require("./pages/Appointments");
const Location = require("./pages/Location");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");
const WellnessStyles = require("./styles/Wellness");

module.exports = {
  name: "Wellness",
  color: "#A7D6DE",
  cat: [0, 13],
  pages: [Homepage, About, Appointments, Location, Services, Contact],
  styles: [WellnessStyles]
};
