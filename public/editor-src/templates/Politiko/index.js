const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const About = require("./pages/About");
const Donation = require("./pages/Donation");
const Volunteer = require("./pages/Volunteer");
const Events = require("./pages/Events");
const EventDetails = require("./pages/EventDetails");
const History = require("./pages/History");
const Contact = require("./pages/Contact");

const PolitikoStyle = require("./styles/Politiko");

module.exports = {
  name: "Politiko",
  color: "#0C1A3C",
  cat: [0, 9],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    About,
    Donation,
    Volunteer,
    Events,
    EventDetails,
    History,
    Contact
  ],
  styles: [PolitikoStyle]
};
