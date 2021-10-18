const Homepage = require("./pages/Homepage");
const History = require("./pages/History");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Products = require("./pages/Products");

const TheFarmStyle = require("./styles/TheFarm");

module.exports = {
  name: "The Farm",
  color: "#F69946",
  cat: [0, 2, 10],
  pages: [Homepage, History, About, Contact, Products],
  styles: [TheFarmStyle]
};
