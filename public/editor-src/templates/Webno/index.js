const Homepage = require("./pages/Homepage");

const WebnoStyle = require("./styles/Webno");

module.exports = {
  name: "Webno",
  color: "",
  cat: [0, 1, 8, 100, 11],
  pages: [
    Homepage,
  ],
  styles: [WebnoStyle]
};