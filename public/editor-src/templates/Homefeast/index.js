const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Contact = require("./pages/Contact");
const RecipeDetails = require("./pages/RecipeDetails");
const Recipes = require("./pages/Recipes");

const HomefeastStyle = require("./styles/Homefeast");

module.exports = {
  name: "Homefeast",
  color: "#DAA236",
  cat: [0, 10, 100],
  pages: [Homepage, About, Contact, RecipeDetails, Recipes],
  styles: [HomefeastStyle]
};
