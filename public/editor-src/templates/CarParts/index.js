const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Products = require("./pages/Products");
const ProductDetails = require("./pages/ProductDetails");
const Categories = require("./pages/Categories");
const CarPartsStyle = require("./styles/CarParts");

module.exports = {
  name: "Car Parts",
  color: "#D91F24",
  cat: [0, 1, 5, 15],
  pages: [Homepage, About, Contact, Products, ProductDetails, Categories],
  styles: [CarPartsStyle]
};
