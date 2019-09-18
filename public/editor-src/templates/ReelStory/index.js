const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Films = require("./pages/Films");
const Commercials = require("./pages/Commercials");
const Photography = require("./pages/Photography");
const ProjectDetails = require("./pages/ProjectDetails");
const Contact = require("./pages/Contact");
const ReelStoryStyles = require("./styles/ReelStory");

module.exports = {
  name: "Reel Story",
  color: "#8A2D2C",
  cat: [0, 3],
  pages: [
    Homepage,
    About,
    Films,
    Commercials,
    Photography,
    ProjectDetails,
    Contact
  ],
  styles: [ReelStoryStyles]
};
