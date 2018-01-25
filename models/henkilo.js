const mongoose = require("mongoose")
const url = "mongodb://spengebeb:qwertybatman@ds215208.mlab.com:15208/hy-tkt21009-phonebook"

mongoose.connect(url)
mongoose.Promise = global.Promise

const Henkilo = mongoose.model("Henkilo", {
  name : String,
  number : String
})

module.exports = Henkilo
