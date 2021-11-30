const Homepage = require("./pages/Homepage");
const Community = require("./pages/Community");
const Membership = require("./pages/Membership");
const Contact = require("./pages/Contact");
const Story = require("./pages/Story");
const CospaceStyle = require("./styles/Cospace");

module.exports = {
  name: "Cospace",
  color: "#22A887",
  cat: [0, 1, 4],
  pages: [Homepage, Community, Membership, Contact, Story],
  styles: [CospaceStyle]
};
