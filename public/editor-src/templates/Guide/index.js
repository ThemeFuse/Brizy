const Homepage = require("./pages/Homepage");

const GuideStyle = require("./styles/Guide");

module.exports = {
  name: "Guide",
  color: "",
  cat: [0, 9, 11],
  pages: [
    Homepage,
  ],
  styles: [GuideStyle]
};