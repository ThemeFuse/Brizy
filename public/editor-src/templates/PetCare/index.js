const Homepage = require("./pages/Homepage");
const Dogs = require("./pages/Dogs");
const Shop = require("./pages/Shop");
const About = require("./pages/About");
const Product = require("./pages/Product");
const Contact = require("./pages/Contact");

const PetCareStyle = require("./styles/PetCare");

module.exports = {
  name: "Pet Care",
  color: "#EC9015",
  cat: [0, 9],
  pages: [
    Homepage,
    Dogs,
    Shop,
    About,
    Product,
    Contact
  ],
  styles: [PetCareStyle]
};
