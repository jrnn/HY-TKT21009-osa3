const mongoose = require("mongoose")
const url = "mongodb://spengebeb:qwertybatman@ds215208.mlab.com:15208/hy-tkt21009-phonebook"

mongoose.connect(url)
mongoose.Promise = global.Promise

const Henkilo = mongoose.model("Henkilo", {
  name : String,
  number : String
})

let name = process.argv[2]
let number = process.argv[3]

if (name && number) {
  console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)

  let h = new Henkilo({ name , number })

  h.save()
    .then(res => {
      console.log(res)
      mongoose.connection.close()
    })
} else {
  console.log("puhelinluettelo:")

  Henkilo
    .find({})
    .then(res => {
      res.forEach(h => { console.log(h) })
      mongoose.connection.close()
    })
}
