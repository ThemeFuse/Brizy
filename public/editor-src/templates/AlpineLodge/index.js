const Homepage = require("./pages/Homepage");
const Activities = require("./pages/Activities");
const Dining = require("./pages/Dining");
const Gallery = require("./pages/Gallery");
const Offers = require("./pages/Offers");
const Rooms = require("./pages/Rooms");
const RoomDetails = require("./pages/RoomDetails");
const Contact = require("./pages/Contact");
const AlpineLodgeStyle = require("./styles/AlpineLodge");

module.exports = {
  name: "Alpine Lodge",
  color: "#788E9A",
  cat: [0, 2],
  pages: [
    Homepage,
    Activities,
    Dining,
    Gallery,
    Offers,
    Rooms,
    RoomDetails,
    Contact
  ],
  styles: [AlpineLodgeStyle]
};
