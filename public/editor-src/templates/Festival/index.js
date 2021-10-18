const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Gallery = require("./pages/Gallery");
const Headliners = require("./pages/Headliners");
const Lineup = require("./pages/Lineup");
const Shortcuts = require("./pages/Shortcuts");
const Tickets = require("./pages/Tickets");
const FestivalStyles = require("./styles/Festival");

module.exports = {
  name: "Festival",
  color: "#D80F90",
  cat: [0, 3, 8],
  pages: [
    Homepage,
    About,
    Shortcuts,
    Gallery,
    Headliners,
    Tickets,
    Lineup,
    Contact
  ],
  styles: [FestivalStyles]
};
