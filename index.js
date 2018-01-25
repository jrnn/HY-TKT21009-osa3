const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const app = express()
const Person = require("./models/person")

morgan.token("reqbody", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.static("build"))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(function (t, req, res) {
  return [
    t.method(req, res),
    t.url(req, res),
    t.reqbody(req, res),
    t.status(req, res),
    t.res(req, res, "content-length"), "-",
    t["response-time"](req, res), "ms"
  ].join(" ")
}))

app.get("/info", (req, res) => {
  Person
    .count({})
    .then(result => {
      res.send(
        `<p>Puhelinluettelossa ${result} henkilön tiedot</p>` +
        `<p>${new Date()}</p>`
      )
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.get("/api/persons", (req, res) => {
  Person
    .find({})
    .then(persons => res.json(persons.map(Person.format)))
    .catch(error => {
      console.log(error)
      res.status(400).send({ error : "oops! something went wrong" })
    })
})

app.get("/api/persons/:id", (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) res.json(Person.format(person))
      else res.status(404).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error : "invalid id" })
    })
})

app.post("/api/persons", (req, res) => {
  if (req.body.name === undefined) {
    return res.status(400).json({ error : "name missing" })
  }
  if (req.body.number === undefined) {
    return res.status(400).json({ error : "number missing" })
  }

  let person = new Person({
    name : req.body.name,
    number : req.body.number
  })

  person
    .save()
    .then(result => res.json(Person.format(result)))
    .catch(error => {
      console.log(error)
      res.status(400).send({ error : "oops! something went wrong" })
    })
})

app.put("/api/persons/:id", (req, res) => {
  if (req.body.name === undefined) {
    return res.status(400).json({ error : "name missing" })
  }
  if (req.body.number === undefined) {
    return res.status(400).json({ error : "number missing" })
  }

  let person = {
    name : req.body.name,
    number : req.body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new : true })
    .then(result => res.json(Person.format(result)))
    .catch(error => {
      console.log(error)
      res.status(400).send({ error : "invalid id" })
    })
})

app.delete("/api/persons/:id", (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => {
      console.log(error)
      res.status(400).send({ error : "invalid id" })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Now listening on port ${PORT}`))
