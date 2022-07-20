const Homepage = require("./pages/Homepage");
const Clinic = require("./pages/Clinic");
const Staff = require("./pages/Staff");
const Contact = require("./pages/Contact");
const Services = require("./pages/Services");
const Treatments = require("./pages/Treatments");
const MedicalStyle = require("./styles/Medical");

module.exports = {
  name: "Medical",
  color: "#081458",
  cat: [0, 12],
  pages: [Homepage, Clinic, Staff, Contact, Services, Treatments],
  styles: [MedicalStyle]
};
