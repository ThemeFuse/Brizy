const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Dessert = require("./pages/Dessert");
const Drinks = require("./pages/Drinks");
const Food = require("./pages/Food");
const Pricing = require("./pages/Pricing");
const Reservations = require("./pages/Reservations");
const Contact = require("./pages/Contact");
const FlavourStyles = require("./styles/Flavour");

module.exports = {
  name: "Flavour",
  color: "#99887E",
  cat: [0, 10],
  pages: [
    Homepage,
    About,
    Dessert,
    Drinks,
    Food,
    Pricing,
    Reservations,
    Contact
  ],
  styles: [FlavourStyles]
};
