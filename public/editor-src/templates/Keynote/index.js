const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Partners = require("./pages/Partners");
const Pricing = require("./pages/Pricing");
const Schedule = require("./pages/Schedule");
const Speakers = require("./pages/Speakers");
const Team = require("./pages/Team");
const Venue = require("./pages/Venue");
const Contact = require("./pages/Contact");
const KeynoteStyles = require("./styles/Keynote");

module.exports = {
  name: "Keynote",
  color: "#443D61",
  cat: [0, 1, 8],
  pages: [
    Homepage,
    About,
    Gallery,
    Partners,
    Pricing,
    Schedule,
    Speakers,
    Team,
    Venue,
    Contact
  ],
  styles: [KeynoteStyles]
};
