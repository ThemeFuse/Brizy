const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const CarpenterStyle = require("./styles/Carpenter");

module.exports = {
  name: "Carpenter",
  color: "#C39F7A",
  cat: [0, 1],
  pages: [Homepage, About, Gallery, Services, Contact],
  styles: [CarpenterStyle]
};
