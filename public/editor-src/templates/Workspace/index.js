const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Services = require("./pages/Services");
const Contact = require("./pages/Contact");
const Offices = require("./pages/Offices");
const Workspaces = require("./pages/Workspaces");

const WorkspaceStyle = require("./styles/Workspace");

module.exports = {
  name: "Workspace",
  color: "#377EF9",
  cat: [0, 1, 8],
  pages: [Homepage, About, Services, Contact, Offices, Workspaces],
  styles: [WorkspaceStyle]
};
