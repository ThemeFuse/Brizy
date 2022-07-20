const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Tests = require("./pages/Tests");
const Contact = require("./pages/Contact");
const Team = require("./pages/Team");
const LaboratoryStyle = require("./styles/Laboratory");

module.exports = {
  name: "Laboratory",
  color: "#2DD099",
  cat: [0, 9],
  pages: [Homepage, About, Tests, Contact, Team],
  styles: [LaboratoryStyle]
};
