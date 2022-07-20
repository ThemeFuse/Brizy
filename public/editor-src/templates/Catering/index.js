const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Catering = require("./pages/Catering");
const Contact = require("./pages/Contact");
const Chef = require("./pages/Chef");
const Offer = require("./pages/Offer");
const CateringStyle = require("./styles/Catering");

module.exports = {
  name: "Catering",
  color: "#EE7727",
  cat: [0, 10],
  pages: [Homepage, About, Catering, Contact, Chef, Offer],
  styles: [CateringStyle]
};
