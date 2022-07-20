const Homepage = require("./pages/Homepage");
const Pricing = require("./pages/Pricing");
const FAQ = require("./pages/FAQ");
const Contact = require("./pages/Contact");
const ProductListing = require("./pages/ProductListing");
const About = require("./pages/About");
const SurfingStyle = require("./styles/Surfing");

module.exports = {
  name: "Surfing",
  color: "#FFCC30",
  cat: [0, 12, 13],
  pages: [Homepage, Pricing, FAQ, Contact, ProductListing, About],
  styles: [SurfingStyle]
};
