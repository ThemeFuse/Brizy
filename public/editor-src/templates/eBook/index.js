const Homepage = require("./pages/Homepage");

const eBookStyle = require("./styles/eBook");

module.exports = {
  name: "eBook",
  color: "#D2D3E7",
  cat: [0, 6, 11],
  pages: [Homepage],
  styles: [eBookStyle]
};
