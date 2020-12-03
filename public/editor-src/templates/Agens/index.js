const Homepage = require("./pages/Homepage");
const Work = require("./pages/Work");
const About = require("./pages/About");
const Contact = require("./pages/Contact");

const AgensStyle = require("./styles/Agens");

module.exports = {
  name: "Agens",
  color: "#AB7BF9",
  cat: [0, 1, 3, 100],
  pages: [Homepage, Work, About, Contact],
  styles: [AgensStyle]
};
