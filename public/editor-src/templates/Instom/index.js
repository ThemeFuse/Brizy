const Homepage = require("./pages/Homepage");

const InstomStyle = require("./styles/Instom");

module.exports = {
  name: "Instom",
  color: "",
  cat: [0, 1, 3, 11],
  pages: [
    Homepage,
  ],
  styles: [InstomStyle]
};