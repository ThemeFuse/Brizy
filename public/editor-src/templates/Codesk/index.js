const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Gallery = require("./pages/Gallery");
const BookATour = require("./pages/BookATour");
const Events = require("./pages/Events");
const EventsSingle = require("./pages/EventsSingle");
const News = require("./pages/News");
const NewsSingle = require("./pages/NewsSingle");
const Team = require("./pages/Team");
const Pricing = require("./pages/Pricing");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");

const CodeskStyles = require("./styles/Codesk");

module.exports = {
  name: "Codesk",
  color: "#FF4332",
  cat: [0, 1, 8, 100],
  pages: [
    Homepage,
    About,
    Contact,
    Gallery,
    BookATour,
    Events,
    EventsSingle,
    News,
    NewsSingle,
    Team,
    Pricing,
    Homepage2,
    Homepage3
  ],
  styles: [CodeskStyles]
};
