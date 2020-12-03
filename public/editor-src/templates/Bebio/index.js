const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Programs = require("./pages/Programs");
const Contact = require("./pages/Contact");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Events = require("./pages/Events");
const EventDetails = require("./pages/EventDetails");
const ProgramsDetails = require("./pages/ProgramsDetails");
const OurNews = require("./pages/OurNews");
const NewsDetails = require("./pages/NewsDetails");

const BebioStyle = require("./styles/Bebio");

module.exports = {
  name: "Bebio",
  color: "#FF4880",
  cat: [0, 16],
  pages: [
    Homepage,
    Homepage2,
    Programs,
    Contact,
    About,
    Gallery,
    Events,
    EventDetails,
    ProgramsDetails,
    OurNews,
    NewsDetails
  ],
  styles: [BebioStyle]
};
