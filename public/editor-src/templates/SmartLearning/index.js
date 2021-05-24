const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Resources = require("./pages/Resources");
const Pricing = require("./pages/Pricing");
const Contact = require("./pages/Contact");

const SmartLearningStyle = require("./styles/SmartLearning");

module.exports = {
  name: "Smart Learning",
  color: "#7703EF",
  cat: [0, 6],
  pages: [Homepage, About, Resources, Pricing, Contact],
  styles: [SmartLearningStyle]
};
