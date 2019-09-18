const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Menu = require("./pages/Menu");
const Careers = require("./pages/Careers");
const Location = require("./pages/Location");
const Contact = require("./pages/Contact");
const GourmetStyles = require("./styles/Gourmet");

module.exports = {
  name: "Gourmet",
  color: "#A27F6E",
  cat: [0, 10],
  pages: [Homepage, About, Menu, Careers, Location, Contact],
  styles: [GourmetStyles]
};
