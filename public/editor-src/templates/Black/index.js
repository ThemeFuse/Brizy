const Homepage = require("./pages/Homepage");

const BlackStyle = require("./styles/Black");

module.exports = {
  name: "Black",
  color: "",
  cat: [0, 1, 3, 11],
  pages: [
    Homepage,
  ],
  styles: [BlackStyle]
};