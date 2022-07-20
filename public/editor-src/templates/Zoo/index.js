const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Tickets = require("./pages/Tickets");
const ZooStyle = require("./styles/Zoo");

module.exports = {
  name: "Zoo",
  color: "#419F60",
  cat: [0, 16],
  pages: [Homepage, Tickets, Contact, Gallery, About],
  styles: [ZooStyle]
};
