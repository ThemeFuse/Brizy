const Homepage = require("./pages/Homepage");
const Services = require("./pages/Services");
const Therapies = require("./pages/Therapies");
const Contact = require("./pages/Contact");

const NaturalBeautyStyle = require("./styles/NaturalBeauty");

module.exports = {
  name: "Natural Beauty",
  color: "#D25C33",
  cat: [0, 12],
  pages: [Homepage, Services, Therapies, Contact],
  styles: [NaturalBeautyStyle]
};
