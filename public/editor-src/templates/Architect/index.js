const Homepage = require("./pages/Homepage");
const Details = require("./pages/Details");
const Projects = require("./pages/Projects");
const Contact = require("./pages/Contact");
const Story = require("./pages/Story");
const ArchitectStyle = require("./styles/Architect");

module.exports = {
  name: "Architect",
  color: "#494949",
  cat: [0, 1],
  pages: [Homepage, Details, Projects, Contact, Story],
  styles: [ArchitectStyle]
};
