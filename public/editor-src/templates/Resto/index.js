const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Menu = require("./pages/Menu");
const Contact = require("./pages/Contact");
const Story = require("./pages/Story");
const RestoStyle = require("./styles/Resto");

module.exports = {
  name: "Resto",
  color: "#BA8E5D",
  cat: [0, 10],
  pages: [Homepage, About, Menu, Contact, Story],
  styles: [RestoStyle]
};
