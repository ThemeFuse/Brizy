const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Discography = require("./pages/Discography");
const Tour = require("./pages/Tour");
const Contact = require("./pages/Contact");

const MoonStyle = require("./styles/Moon");

module.exports = {
  name: "Moon",
  color: "#BC5FFF",
  cat: [0, 8],
  pages: [Homepage, About, Discography, Tour, Contact],
  styles: [MoonStyle]
};
