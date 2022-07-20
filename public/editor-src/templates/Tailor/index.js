const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Collections = require("./pages/Collections");
const Contact = require("./pages/Contact");
const Details = require("./pages/Details");
const TailorStyle = require("./styles/Tailor");

module.exports = {
  name: "Tailor",
  color: "#E5BB96",
  cat: [0, 1],
  pages: [Homepage, About, Collections, Contact, Details],
  styles: [TailorStyle]
};
