const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const Explore = require("./pages/Explore");
const Contact = require("./pages/Contact");
const Project = require("./pages/Project");
const About = require("./pages/About");
const TeamMembers = require("./pages/TeamMembers");
const FAQ = require("./pages/FAQ");
const Gallery = require("./pages/Gallery");

const KrowdStyle = require("./styles/Krowd");

module.exports = {
  name: "Krowd",
  color: "#674DF0",
  cat: [0, 1, 9],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    Explore,
    Contact,
    Project,
    About,
    TeamMembers,
    FAQ,
    Gallery
  ],
  styles: [KrowdStyle]
};
