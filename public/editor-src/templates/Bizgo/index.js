const Homepage = require("./pages/Homepage");

const BizgoStyle = require("./styles/Bizgo");

module.exports = {
  name: "Bizgo",
  color: "",
  cat: [0, 1, 3, 100, 11],
  pages: [
    Homepage,
  ],
  styles: [BizgoStyle]
};