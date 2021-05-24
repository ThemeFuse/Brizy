const Homepage = require("./pages/Homepage");

const DietingStyle = require("./styles/Dieting");

module.exports = {
  name: "Dieting",
  color: "",
  cat: [0, 12, 13, 11],
  pages: [
    Homepage,
  ],
  styles: [DietingStyle]
};