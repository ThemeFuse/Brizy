const About = require("./pages/About");
const Info = require("./pages/Info");
const Berlin = require("./pages/Berlin");
const Dublin = require("./pages/Dublin");
const London = require("./pages/London");
const Milan = require("./pages/Milan");
const Moskow = require("./pages/Moskow");
const Rome = require("./pages/Rome");
const Sochi = require("./pages/Sochi");
const Vien = require("./pages/Vien");
const Rio = require("./pages/Rio");
const Tokyo = require("./pages/Tokyo");
const StoryStyle = require("./styles/Story");

module.exports = {
  name: "Advisors",
  color: "#5599B3",
  cat: [0, 1],
  pages: [About, Info, Berlin, Dublin, London, Milan, Moskow, Rome, Sochi, Vien, Rio, Tokyo],
  styles: [StoryStyle]
};
