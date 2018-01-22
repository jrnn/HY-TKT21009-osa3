const express = require("express")
const app = express()

let persons = [
  {
    "id": 1,
    "name": "Spengebeb Squrupunts",
    "number": "+1 42 666 1337"
  },
  {
    "id": 2,
    "name": "Chuck Norris",
    "number": "none of your business"
  },
  {
    "id": 3,
    "name": "Spengebeb Chucknorris",
    "number": "+358 40 123 4567"
  },
  {
    "id": 4,
    "name": "Spengebeb Nuckchorris",
    "number": "N/A"
  },
  {
    "id": 5,
    "name": "Jackiechuck Channorris",
    "number": "+86 139 1234 5678"
  },
  {
    "id": 6,
    "name": "Chackie Jan",
    "number": "+1 12 358 1321"
  }
]

app.get("/info", (req, res) => {
  res.send(
    `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>` +
    `<p>${new Date()}</p>`
  )
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Now listening to requests on port ${PORT}`)
})
