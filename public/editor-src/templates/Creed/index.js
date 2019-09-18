const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Ministries = require("./pages/Ministries");
const Sermons = require("./pages/Sermons");
const Contact = require("./pages/Contact");
const CreedStyles = require("./styles/Creed");

module.exports = {
  name: "Creed",
  color: "#A27F6E",
  cat: [0, 7, 8, 12],
  pages: [Homepage, About, Gallery, Ministries, Sermons, Contact],
  styles: [CreedStyles]
};
