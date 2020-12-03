const Homepage = require("./pages/Homepage");
const Homepage2 = require("./pages/Homepage2");
const Homepage3 = require("./pages/Homepage3");
const Homepage4 = require("./pages/Homepage4");
const About = require("./pages/About");
const WhatWeDo = require("./pages/WhatWeDo");
const WhyChooseOktane = require("./pages/WhyChooseOktane");
const HowTheyWork = require("./pages/HowTheyWork");
const PlansAndPricing = require("./pages/PlansAndPricing");
const SuccessStories = require("./pages/SuccessStories");
const Contact = require("./pages/Contact");

const OktaneStyle = require("./styles/Oktane");

module.exports = {
  name: "Oktane",
  color: "#E18B1D",
  cat: [0, 1, 3],
  pages: [
    Homepage,
    Homepage2,
    Homepage3,
    Homepage4,
    About,
    WhatWeDo,
    WhyChooseOktane,
    HowTheyWork,
    PlansAndPricing,
    SuccessStories,
    Contact
  ],
  styles: [OktaneStyle]
};
