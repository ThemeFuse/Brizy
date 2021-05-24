const Homepage = require("./pages/Homepage");

const BookyStyle = require("./styles/Booky");

module.exports = {
  name: "Booky",
  color: "",
  cat: [0, 1, 6, 11],
  pages: [
    Homepage,
  ],
  styles: [BookyStyle]
};