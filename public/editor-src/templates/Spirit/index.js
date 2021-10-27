const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Testimonials = require("./pages/Testimonials");
const VideoCall = require("./pages/VideoCall");
const Contact = require("./pages/Contact");
const Offer = require("./pages/Offer");

const SpiritStyle = require("./styles/Spirit");

module.exports = {
  name: "Spirit",
  color: "#CD775C",
  cat: [0, 6, 9],
  pages: [Homepage, About, Testimonials, VideoCall, Contact, Offer],
  styles: [SpiritStyle]
};
