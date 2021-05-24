const Homepage = require("./pages/Homepage");

const MedicoStyle = require("./styles/Medico");

module.exports = {
  name: "Medico",
  color: "",
  cat: [0, 11, 12],
  pages: [
    Homepage,
  ],
  styles: [MedicoStyle]
};