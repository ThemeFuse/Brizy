const Overview = require("./pages/Overview");
const About = require("./pages/About");
const Reviews = require("./pages/Reviews");
const FAQ = require("./pages/FAQ");
const TechSpecs = require("./pages/TechSpecs");

const DroneXStyle = require("./styles/DroneX");

module.exports = {
  name: "DroneX",
  color: "#9543DD",
  cat: [0, 1, 3],
  pages: [
    Overview,
    About,
    Reviews,
    FAQ,
    TechSpecs
  ],
  styles: [DroneXStyle]
};
