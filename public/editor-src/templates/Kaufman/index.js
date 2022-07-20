const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Location = require("./pages/Location");
const NewsAndEvents = require("./pages/NewsAndEvents");
const OurTeam = require("./pages/OurTeam");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");

const KaufmanStyle = require("./styles/Kaufman");

module.exports = {
  name: "Kaufman",
  color: "#8C4646",
  cat: [0, 1],
  pages: [Homepage, About, Location, NewsAndEvents, OurTeam, Services, Contact],
  styles: [KaufmanStyle]
};
