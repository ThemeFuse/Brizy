const Homepage = require("./pages/Homepage");
const Nutrition = require("./pages/Nutrition");
const Pricing = require("./pages/Pricing");
const Services = require("./pages/Services");
const Stories = require("./pages/Stories");
const Workout = require("./pages/Workout");
const WorkoutDetails = require("./pages/WorkoutDetails");
const Contact = require("./pages/Contact");
const InShapeStyles = require("./styles/InShape");

module.exports = {
  name: "In Shape",
  color: "#303E67",
  cat: [0, 12, 13],
  pages: [
    Homepage,
    Nutrition,
    Pricing,
    Services,
    Stories,
    Workout,
    WorkoutDetails,
    Contact
  ],
  styles: [InShapeStyles]
};
