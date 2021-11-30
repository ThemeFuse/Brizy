const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Cart = require("./pages/Cart");
const Contact = require("./pages/Contact");
const Checkout = require("./pages/Checkout");
const Products = require("./pages/Products");
const ProductDetails = require("./pages/ProductDetails");
const HomeshopStyle = require("./styles/Homeshop");

module.exports = {
  name: "Home Shop",
  color: "#F2D66D",
  cat: [0, 1, 3],
  pages: [Homepage, About, Cart, Contact, Checkout, Products, ProductDetails],
  styles: [HomeshopStyle]
};
