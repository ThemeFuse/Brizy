const Homepage = require("./pages/Homepage");
const FAQ = require("./pages/FAQ");
const Product = require("./pages/Product");
const Income = require("./pages/Income");
const Roadmap = require("./pages/Roadmap");
const Team = require("./pages/Team");
const OktaneCryptoStyle = require("./styles/OktaneCrypto");

module.exports = {
  name: "Oktane Crypto",
  color: "#031331",
  cat: [0, 19],
  pages: [Homepage, FAQ, Product, Income, Roadmap, Team],
  styles: [OktaneCryptoStyle]
};
