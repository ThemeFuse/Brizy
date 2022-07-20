const Homepage = require("./pages/Homepage");
const Gallery = require("./pages/Gallery");
const Updates = require("./pages/Updates");
const About = require("./pages/About");
const FootballClubStyle = require("./styles/FootballClub");

module.exports = {
  name: "Football Club",
  color: "#BE0E32",
  cat: [0, 13],
  pages: [Homepage, Gallery, Updates, About],
  styles: [FootballClubStyle]
};
