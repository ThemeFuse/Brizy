const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Menu = require("./pages/Menu");
const Recipes = require("./pages/Recipes");
const RecipeDetails = require("./pages/RecipeDetails");
const Contact = require("./pages/Contact");
const MolinoStyles = require("./styles/Molino");

module.exports = {
  name: "Molino",
  color: "#A27F6E",
  cat: [0, 10],
  pages: [Homepage, About, Menu, Recipes, RecipeDetails, Contact],
  styles: [MolinoStyles]
};
