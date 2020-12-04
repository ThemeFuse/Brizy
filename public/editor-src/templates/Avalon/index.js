const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const Services = require("./pages/Services");
const ServiceDetails = require("./pages/ServiceDetails");
const Contact = require("./pages/Contact");
const About = require("./pages/About");
const OurMission = require("./pages/OurMission");
const OurHistory = require("./pages/OurHistory");
const Page404 = require("./pages/Page404");

const AvalonStyle = require("./styles/Avalon");

module.exports = {
  name: "Avalon",
  color: "#FF7E00",
  cat: [0, 1],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    Services,
    ServiceDetails,
    Contact,
    About,
    OurMission,
    OurHistory,
    Page404
  ],
  styles: [AvalonStyle]
};
