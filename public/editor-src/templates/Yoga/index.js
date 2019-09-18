const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Classes = require("./pages/Classes");
const Pricing = require("./pages/Pricing");
const Contact = require("./pages/Contact");
const YogaStyles = require("./styles/Yoga");

module.exports = {
  name: "Yoga",
  color: "#887D9E",
  cat: [0, 13, 14],
  pages: [Homepage, About, Classes, Pricing, Contact],
  styles: [YogaStyles]
};
