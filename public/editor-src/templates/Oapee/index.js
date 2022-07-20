const Homepage = require("./pages/Homepage");
const Blog = require("./pages/Blog");
const SinglePost = require("./pages/SinglePost");

const OapeeStyle = require("./styles/Oapee");

module.exports = {
  name: "Oapee",
  color: "#7B22B0",
  cat: [0, 1, 3],
  pages: [Homepage, Blog, SinglePost],
  styles: [OapeeStyle]
};
