const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Dining = require("./pages/Dining");
const Gallery = require("./pages/Gallery");
const Rooms = require("./pages/Rooms");
const RoomDetails = require("./pages/RoomDetails");
const Contact = require("./pages/Contact");
const LavishStyles = require("./styles/Lavish");

module.exports = {
  name: "Lavish",
  color: "#4C5E7A",
  cat: [0, 2, 10],
  pages: [Homepage, About, Dining, Gallery, Rooms, RoomDetails, Contact],
  styles: [LavishStyles]
};
