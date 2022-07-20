const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Studio = require("./pages/Studio");
const Contact = require("./pages/Contact");
const Tracks = require("./pages/Tracks");
const MusicStyle = require("./styles/Music");

module.exports = {
  name: "Music",
  color: "#1A2060",
  cat: [0, 18],
  pages: [Homepage, About, Studio, Contact, Tracks],
  styles: [MusicStyle]
};
