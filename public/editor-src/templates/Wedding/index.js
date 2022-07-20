const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Details = require("./pages/Details");
const Contact = require("./pages/Contact");
const Stories = require("./pages/Stories");
const Haus = require("./pages/Haus");
const Movies = require("./pages/Movies");
const WeddingStyle = require("./styles/Wedding");

module.exports = {
  name: "Wedding",
  color: "#323232",
  cat: [0, 3, 9],
  pages: [Homepage, About, Details, Contact, Stories, Haus, Movies],
  styles: [WeddingStyle]
};
