const Slide1 = require("./pages/Slide1");
const Slide2 = require("./pages/Slide2");
const Slide3 = require("./pages/Slide3");
const StoryStyle = require("./styles/Story");

module.exports = {
  name: "Onboarding",
  color: "#3239A6",
  cat: [0, 7],
  pages: [Slide1, Slide2, Slide3],
  styles: [StoryStyle]
};
