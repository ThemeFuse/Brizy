const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Pricing = require("./pages/Pricing");
const Contact = require("./pages/Contact");
const UseCase = require("./pages/UseCase");
const Blog = require("./pages/Blog");
const CryptothingsStyle = require("./styles/Cryptothings");

module.exports = {
  name: "Cryptothings",
  color: "#356CFB",
  cat: [0, 19],
  pages: [Homepage, About, Pricing, Contact, UseCase, Blog],
  styles: [CryptothingsStyle]
};
