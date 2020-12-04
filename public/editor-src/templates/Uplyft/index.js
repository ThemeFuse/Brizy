const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Team = require("./pages/Team");
const About = require("./pages/About");
const Contact = require("./pages/Contact");

const UplyftStyle = require("./styles/Uplyft");

module.exports = {
  name: "Uplyft",
  color: "#FF8257",
  cat: [0, 1, 3],
  pages: [Homepage, Homepage2, Team, About, Contact],
  styles: [UplyftStyle]
};
