const Homepage = require("./pages/Homepage");
const Events = require("./pages/Events");
const Contact = require("./pages/Contact");
const Homepage2 = require("./pages/Homepage2");
const About = require("./pages/About");
const Volunteers = require("./pages/Volunteers");
const BecomeAVolunteer = require("./pages/BecomeAVolunteer");
const Gallery = require("./pages/Gallery");
const OurCauses = require("./pages/OurCauses");
const SingleCause = require("./pages/SingleCause");
const SingleEvent = require("./pages/SingleEvent");

const AzinoStyle = require("./styles/Azino");

module.exports = {
  name: "Azino",
  color: "#FCAD30",
  cat: [0, 9],
  pages: [
    Homepage,
    Events,
    Contact,
    Homepage2,
    About,
    Volunteers,
    BecomeAVolunteer,
    Gallery,
    OurCauses,
    SingleCause,
    SingleEvent
  ],
  styles: [AzinoStyle]
};
