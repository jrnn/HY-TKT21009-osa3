const mongoose = require("mongoose")

console.log("process.env.NODE_ENV=" + process.env.NODE_ENV)
if (process.env.NODE_ENV !== "production") require("dotenv").config()

mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
  name : String,
  number : String
})

personSchema.statics.format = function (person) {
  return {
    id : person._id,
    name : person.name,
    number : person.number
  }
}

const Person = mongoose.model("Person", personSchema)

module.exports = Person
