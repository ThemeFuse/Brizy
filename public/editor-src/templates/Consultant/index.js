const Homepage = require("./pages/Homepage");
const Benefits = require("./pages/Benefits");
const Offer = require("./pages/Offer");
const Contact = require("./pages/Contact");
const HowWeWork = require("./pages/HowWeWork");
const ConsultantStyle = require("./styles/Consultant");

module.exports = {
  name: "Consultant",
  color: "#4D63E8",
  cat: [0, 1],
  pages: [Homepage, Benefits, Offer, Contact, HowWeWork],
  styles: [ConsultantStyle]
};
