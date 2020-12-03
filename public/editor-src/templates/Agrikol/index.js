const Homepage = require("./pages/Homepage");
const Services = require("./pages/Services");
const OurProjects = require("./pages/OurProjects");
const Farmers = require("./pages/Farmers");
const WhyChooseUs = require("./pages/WhyChooseUs");
const About = require("./pages/About");
const Gallery = require("./pages/Gallery");
const Contact = require("./pages/Contact");
const Homepage2 = require("./pages/Homepage2");
const ServiceDetails = require("./pages/ServiceDetails");
const ProjectDetails = require("./pages/ProjectDetails");

const AgrikolStyle = require("./styles/Agrikol");

module.exports = {
  name: "Agrikol",
  color: "#404A3D",
  cat: [0, 1],
  pages: [
    Homepage,
    Services,
    OurProjects,
    Farmers,
    WhyChooseUs,
    About,
    Gallery,
    Contact,
    Homepage2,
    ServiceDetails,
    ProjectDetails
  ],
  styles: [AgrikolStyle]
};
