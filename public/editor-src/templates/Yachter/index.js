const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Yachts = require("./pages/Yachts");
const Destinations = require("./pages/Destinations");
const Contact = require("./pages/Contact");
const YachtsDetails = require("./pages/YachtsDetails");

const YachterStyle = require("./styles/Yachter");

module.exports = {
  name: "Yachter",
  color: "#022447",
  cat: [0, 13],
  pages: [
    Homepage,
    Homepage2,
    About,
    Services,
    Yachts,
    Destinations,
    Contact,
    YachtsDetails
  ],
  styles: [YachterStyle]
};
