const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Classes = require("./pages/Classes");
const Contact = require("./pages/Contact");
const Teachers = require("./pages/Teachers");
const SchoolStyle = require("./styles/School");

module.exports = {
  name: "School",
  color: "#FCC73E",
  cat: [0, 6, 9],
  pages: [Homepage, About, Classes, Contact, Teachers],
  styles: [SchoolStyle]
};
