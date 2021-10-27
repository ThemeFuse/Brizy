const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const Food = require("./pages/Food");
const Locations = require("./pages/Locations");

const MealsOnWheelsStyle = require("./styles/MealsOnWheels");

module.exports = {
  name: "Meals On Wheels",
  color: "#FFA63A",
  cat: [0, 10],
  pages: [Homepage, About, Contact, Food, Locations],
  styles: [MealsOnWheelsStyle]
};
