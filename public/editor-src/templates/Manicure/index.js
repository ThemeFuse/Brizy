const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const Work = require("./pages/Work");
const ManicureStyle = require("./styles/Manicure");

module.exports = {
  name: "Manicure",
  color: "#F60091",
  cat: [0, 1],
  pages: [Homepage, About, Gallery, Services, Work, Contact],
  styles: [ManicureStyle]
};
