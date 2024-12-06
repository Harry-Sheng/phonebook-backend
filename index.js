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

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
  });

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));



app.post('/api/persons', (request, response, next) => {
    const person = new Person({
      name: request.body.name,
      number: request.body.number,
      id: request.body.id,
    })
    console.log(person)
    person.save().then(result => {
      response.json(result)
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
    }).catch(error => next(error))

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
    const person = Person.findById(id)
    if (person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, 
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)