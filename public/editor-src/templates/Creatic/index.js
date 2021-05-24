const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const Homepage4 = require("./pages/Homepage4");
const Homepage5 = require("./pages/Homepage5");
const About = require("./pages/About");
const Work = require("./pages/Work");
const Team = require("./pages/Team");
const Pricing = require("./pages/Pricing");
const News = require("./pages/News");
const News2 = require("./pages/News2");
const NewsDetails = require("./pages/NewsDetails");
const Page404 = require("./pages/Page404");
const Contact = require("./pages/Contact");

const CreaticStyle = require("./styles/Creatic");

module.exports = {
  name: "Creatic",
  color: "#ED2C41",
  cat: [0, 1, 3, 100],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    Homepage4,
    Homepage5,
    About,
    Work,
    Team,
    Pricing,
    News,
    News2,
    NewsDetails,
    Page404,
    Contact
  ],
  styles: [CreaticStyle]
};