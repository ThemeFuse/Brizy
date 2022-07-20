const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Offer = require("./pages/Offer");
const KidsStyle = require("./styles/Kids");

module.exports = {
  name: "Kids",
  color: "#FF4A87",
  cat: [0, 9],
  pages: [Homepage, About, Gallery, Contact, Offer],
  styles: [KidsStyle]
};
