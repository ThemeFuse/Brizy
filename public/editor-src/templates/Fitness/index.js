const Homepage = require("./pages/Homepage");

const FitnessStyle = require("./styles/Fitness");

module.exports = {
  name: "Fitness",
  color: "",
  cat: [0, 12, 13, 11],
  pages: [
    Homepage,
  ],
  styles: [FitnessStyle]
};