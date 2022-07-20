const Homepage = require("./pages/Homepage");
const Pricing = require("./pages/Pricing");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Party2Style = require("./styles/Party2");

module.exports = {
  name: "Party 2",
  color: "#441C62",
  cat: [0, 8, 9],
  pages: [Homepage, Pricing, Gallery, Contact],
  styles: [Party2Style]
};
