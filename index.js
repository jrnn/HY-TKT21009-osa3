const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const app = express()
const Henkilo = require("./models/henkilo")

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

let persons = []

const generateId = () => {
  let id = Math.floor(Math.random() * 1000000000)

  if (persons.find(p => p.id === id)) {
    return generateId()
  } else {
    return id
  }
}

app.get("/info", (req, res) => {
  res.send(
    `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>` +
    `<p>${new Date()}</p>`
  )
})

app.get("/api/persons", (req, res) => {
  Henkilo
    .find({})
    .then(persons => { res.json(persons.map(Henkilo.format)) })
})

app.get("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id)
  let person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post("/api/persons", (req, res) => {
  let body = req.body

  if (req.body.name === undefined) {
    return res.status(400).json( { error : "name missing" } )
  }
  if (req.body.number === undefined) {
    return res.status(400).json( { error : "number missing" } )
  }
  if (persons.map(p => p.name.toLowerCase())
             .find(n => n == req.body.name.toLowerCase())) {
    return res.status(400).json( { error : "name already in use" } )
  }

  let person = {
    id : generateId(),
    name : req.body.name,
    number : req.body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

app.put("/api/persons/:id", (req, res) => {
  let body = req.body
  let id = Number(req.params.id)
  let person = persons.find(p => p.id === id)

  if (person === undefined) {
    return res.status(400).json( { error : "no such person" } )
  }
  if (req.body.name === undefined) {
    return res.status(400).json( { error : "name missing" } )
  }
  if (req.body.number === undefined) {
    return res.status(400).json( { error : "number missing" } )
  }

  person.number = req.body.number
  persons = persons.filter(p => p.id !== id)
  persons = persons.concat(person)
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Now listening to requests on port ${PORT}`)
})
