const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'));

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
    const person = request.body
    
    if (persons.find(x => x.name === person.name) !== undefined){
        console.log({ error: 'name must be unique' })
    }else if(person.name === undefined || person.number === undefined){
        console.log({ error: 'name&number need to be defined' })
    }
    else{
        console.log(person)
        response.json(person)
    }
    
})
  

app.get('/api/persons', (request, response) => {
    const randomID = Math.random(1,1000000) * 1000000
    person = {
        "id": randomID,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    }
    persons = persons.concat(person)
    response.json(persons)
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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})