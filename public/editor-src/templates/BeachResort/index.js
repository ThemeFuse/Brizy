const Homepage = require("./pages/Homepage");
const Activities = require("./pages/Activities");
const Dining = require("./pages/Dining");
const Galery = require("./pages/Galery");
const Offers = require("./pages/Offers");
const Rooms = require("./pages/Rooms");
const RoomDetails = require("./pages/RoomDetails");
const Contact = require("./pages/Contact");
const BeachResortStyles = require("./styles/BeachResort");

module.exports = {
  name: "Beach Resort",
  color: "#2A5D86",
  cat: [0, 2],
  pages: [
    Homepage,
    Activities,
    Dining,
    Galery,
    Offers,
    Rooms,
    RoomDetails,
    Contact
  ],
  styles: [BeachResortStyles]
};
