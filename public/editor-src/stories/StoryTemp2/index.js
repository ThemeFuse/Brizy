const About = require("./pages/About");
const Info = require("./pages/Info");
const StoryStyle = require("./styles/Story");

module.exports = {
  name: "Advisors",
  color: "#5599B3",
  cat: [0, 1],
  pages: [About, Info],
  styles: [StoryStyle]
};
