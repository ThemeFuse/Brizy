const Homepage = require("./pages/Homepage");
const Accommodation = require("./pages/Accommodation");
const ContestsAndEvents = require("./pages/ContestsAndEvents");
const ProjectDetails = require("./pages/ProjectDetails");
const TravelingPackages = require("./pages/TravelingPackages");
const Contact = require("./pages/Contact");

const PathfinderStyle = require("./styles/Pathfinder");

module.exports = {
  name: "Pathfinder",
  color: "#AD854D",
  cat: [0, 2],
  pages: [
    Homepage,
    Accommodation,
    ContestsAndEvents,
    ProjectDetails,
    TravelingPackages,
    Contact
  ],
  styles: [PathfinderStyle]
};
