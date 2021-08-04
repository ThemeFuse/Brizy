const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const About = require("./pages/About");
const Team = require("./pages/Team");
const Games = require("./pages/Games");
const SingleGame = require("./pages/SingleGame");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");

const SintixStyle = require("./styles/Sintix");

module.exports = {
  name: "Sintix",
  color: "#FF7A21",
  cat: [0, 13, 17],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    About,
    Team,
    Games,
    SingleGame,
    Gallery,
    Contact
  ],
  styles: [SintixStyle]
};
