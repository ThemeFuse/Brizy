const Homepage = require("./pages/Homepage");
const Join = require("./pages/Join");
const Press = require("./pages/Press");
const FAQ = require("./pages/FAQ");
const Gallery = require("./pages/Gallery");
const Pricing = require("./pages/Pricing");
const Projects = require("./pages/Projects");
const Projectdetails = require("./pages/Projectdetails");
const Team = require("./pages/Team");
const Contact = require("./pages/Contact");
const PhilanthropyStyles = require("./styles/Philanthropy");

module.exports = {
  name: "Philanthropy",
  color: "#2C4C44",
  cat: [0, 12],
  pages: [
    Homepage,
    Join,
    Press,
    FAQ,
    Gallery,
    Pricing,
    Projects,
    Projectdetails,
    Team,
    Contact
  ],
  styles: [PhilanthropyStyles]
};
