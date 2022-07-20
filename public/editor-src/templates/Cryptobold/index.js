const Homepage = require("./pages/Homepage");
const Prices = require("./pages/Prices");
const Cases = require("./pages/Cases");
const Contact = require("./pages/Contact");
const About = require("./pages/About");
const CryptoboldStyle = require("./styles/Cryptobold");

module.exports = {
  name: "Cryptobold",
  color: "#3356D7",
  cat: [0, 1],
  pages: [Homepage, Prices, Cases, Contact, About],
  styles: [CryptoboldStyle]
};
