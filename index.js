const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

const app = express()
const mongoose = require('mongoose')
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))

require('dotenv').config()
const Person = require('./person')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]  

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
  });

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.post('/api/persons', (request, response) => {
    const person = new Person({
      name: request.body.name,
      number: request.body.number,
      id: request.body.id,
    })
    console.log(person)
    person.save().then(result => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
  })
  

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info',(request, response) => {
    const currentTime = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people<br />\
    ${currentTime}</p>`)
})

app.get('/api/persons/:id',(request, response) => {
    const id = request.params.id
    const person = persons.find( x => x.id === id)

    if (person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request, response) => {
    const id = request.params.id
    persons = persons.filter( x => x.id !== id)
    response.status(204).end()
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})