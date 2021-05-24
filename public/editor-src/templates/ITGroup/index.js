const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Work = require("./pages/Work");
const Contact = require("./pages/Contact");

const ITGroupStyle = require("./styles/ITGroup");

module.exports = {
  name: "IT Group",
  color: "#00DADC",
  cat: [1, 3],
  pages: [
    Homepage,
    Homepage2,
    About,
    Services,
    Work,
    Contact
  ],
  styles: [ITGroupStyle]
};
