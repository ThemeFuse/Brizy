const Homepage = require("./pages/Homepage");
const About = require("./pages/About");
const Portfolio = require("./pages/Portfolio");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const Blog = require("./pages/Blog");
const BlogDetails = require("./pages/BlogDetails");
const Wedding2Style = require("./styles/Wedding2");

module.exports = {
  name: "Wedding 2",
  color: "#686868",
  cat: [0, 9],
  pages: [Homepage, About, Portfolio, Contact, Services, Blog, BlogDetails],
  styles: [Wedding2Style]
};
