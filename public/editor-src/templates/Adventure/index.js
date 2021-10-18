const Homepage = require("./pages/Homepage");
const Adventure = require("./pages/Adventure");
const Guides = require("./pages/Guides");
const Contact = require("./pages/Contact");
const Team = require("./pages/Team");
const AdventureStyle = require("./styles/Adventure");

module.exports = {
  name: "Adventure",
  color: "#00AAF1",
  cat: [0, 12, 13],
  pages: [Homepage, Adventure, Guides, Contact, Team],
  styles: [AdventureStyle]
};
