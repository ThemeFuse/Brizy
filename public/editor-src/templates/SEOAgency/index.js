const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const CaseStudies = require("./pages/CaseStudies");
const CaseStudyDetails = require("./pages/CaseStudyDetails");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");

const SEOAgencyStyle = require("./styles/SEOAgency");

module.exports = {
  name: "SEO Agency",
  color: "#000051",
  cat: [0, 1, 3],
  pages: [Homepage, About, CaseStudies, CaseStudyDetails, Contact, Services],
  styles: [SEOAgencyStyle]
};
