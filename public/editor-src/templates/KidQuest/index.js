const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Pricing = require("./pages/Pricing");
const ProjectDetails = require("./pages/ProjectDetails");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");
const KidQuestStyles = require("./styles/KidQuest");

module.exports = {
  name: "Kid Quest",
  color: "#DBCCBB",
  cat: [0, 6],
  pages: [Homepage, About, Gallery, Pricing, ProjectDetails, Services, Contact],
  styles: [KidQuestStyles]
};
