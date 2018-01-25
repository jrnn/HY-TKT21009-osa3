const mongoose = require("mongoose")
const url = "mongodb://spengebeb:qwertybatman@ds215208.mlab.com:15208/hy-tkt21009-phonebook"

mongoose.connect(url)
mongoose.Promise = global.Promise

const henkiloSchema = new mongoose.Schema({
  name : String,
  number : String
})

henkiloSchema.statics.format = function (person) {
  return {
    id : person._id,
    name : person.name,
    number : person.name
  }
}

const Henkilo = mongoose.model("Henkilo", henkiloSchema)

module.exports = Henkilo
