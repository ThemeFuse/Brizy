const Homepage = require("./pages/Homepage");
const Info = require("./pages/Info");
const Lineup = require("./pages/Lineup");
const Contact = require("./pages/Contact");
const Attractions = require("./pages/Attractions");
const Offer = require("./pages/Offer");
const PartyStyle = require("./styles/Party");

module.exports = {
  name: "Party",
  color: "#F128BC",
  cat: [0, 8, 9],
  pages: [Homepage, Info, Lineup, Contact, Attractions, Offer],
  styles: [PartyStyle]
};
