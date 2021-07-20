const Slide1 = require("./pages/Slide1");
const Slide2 = require("./pages/Slide2");
const Slide3 = require("./pages/Slide3");
const Slide4 = require("./pages/Slide4");
const Slide5 = require("./pages/Slide5");
const Slide6 = require("./pages/Slide6");
const Slide7 = require("./pages/Slide7");
const Slide8 = require("./pages/Slide8");
const StoryStyle = require("./styles/Story");

module.exports = {
  name: "CV",
  color: "#4285F4",
  cat: [0, 5, 7],
  pages: [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8],
  styles: [StoryStyle]
};
