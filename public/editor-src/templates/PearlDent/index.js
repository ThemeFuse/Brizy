const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const DentalImplants = require("./pages/DentalImplants");
const Contact = require("./pages/Contact");

const PearlDentStyle = require("./styles/PearlDent");

module.exports = {
  name: "Pearl Dent",
  color: "#00C4D7",
  cat: [0, 12],
  pages: [Homepage, About, DentalImplants, Contact],
  styles: [PearlDentStyle]
};
