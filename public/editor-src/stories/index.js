const StoryBlank0001 = require("./StoryBlank0001");
const BistroMenu = require("./BistroMenu");
const FashionStatement = require("./FashionStatement");
const Freelancer = require("./Freelancer");
const GreatIdeas = require("./GreatIdeas");
const Handymen = require("./Handymen");
const NightJam = require("./NightJam");
const WatchPicks = require("./WatchPicks");

module.exports = {
  stories: [
    StoryBlank0001,
    BistroMenu,
    FashionStatement,
    Freelancer,
    GreatIdeas,
    Handymen,
    NightJam,
    WatchPicks
  ],
  categories: [
    { id: 0, title: "Blank", hidden: true },
    { id: 1, title: "Magazine" },
    { id: 2, title: "Fashion" },
    { id: 3, title: "Food" },
    { id: 4, title: "Fashion" },
    { id: 5, title: "Services" },
    { id: 6, title: "Events" },
    { id: 7, title: "Business" }
  ]
};
