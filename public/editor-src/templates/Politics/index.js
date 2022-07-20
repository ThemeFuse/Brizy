const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const News = require("./pages/News");
const NewsDetails = require("./pages/NewsDetails");
const Program = require("./pages/Program");
const Contact = require("./pages/Contact");
const PoliticsStyle = require("./styles/Politics");

module.exports = {
  name: "Politics",
  color: "#E00432",
  cat: [0, 9],
  pages: [Homepage, About, News, NewsDetails, Program, Contact],
  styles: [PoliticsStyle]
};
