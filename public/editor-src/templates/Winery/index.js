const Homepage = require("./pages/Homepage");
const Shop = require("./pages/Shop");
const ShopSingle = require("./pages/ShopSingle");
const About = require("./pages/About");
const Vineyard = require("./pages/Vineyard");

const WineryStyle = require("./styles/Winery");

module.exports = {
  name: "Winery",
  color: "#93815D",
  cat: [0, 1],
  pages: [
    Homepage,
    Shop,
    ShopSingle,
    About,
    Vineyard
  ],
  styles: [WineryStyle]
};
