const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const HowItWorks = require("./pages/HowItWorks");
const Contact = require("./pages/Contact");
const Vehicles = require("./pages/Vehicles");
const Pricing = require("./pages/Pricing");
const ScooterRentalStyle = require("./styles/ScooterRental");

module.exports = {
  name: "Scooter Rental",
  color: "#08C9AA",
  cat: [0, 100, 1, 5, 13],
  pages: [Homepage, About, HowItWorks, Contact, Vehicles, Pricing],
  styles: [ScooterRentalStyle]
};
