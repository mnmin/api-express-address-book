//Include the express library
const express = require("express")
//Include the morgan middleware
const morgan = require("morgan")
//Include the cors middleware
const cors = require("cors")

//Create a new express application
const app = express()
const contacts = require("./contacts")
const { request } = require("express")
app.use(express.json())

//Tell express we want to use the morgan library
app.use(morgan("dev"))
//Tell express we want to use the cors library
app.use(cors())

app.get("/contacts", (req, res) => {
    
    res.json({ contacts })
   })

function nextContactId() {
    let nextId = 0
    contacts.forEach(contact => {
        if(contact.id > nextId)
        nextId = contact.id
    })
    return(nextId + 1)
}

app.post('/contacts', (req, res) => {
     
    const newContact = {
        id: nextContactId(),
        ...req.body,
        meetings: []
    }

    console.log("new contact = ", newContact)

    contacts.push(newContact)

    res.json({ contact: newContact })
})

app.get('/contacts/:id', (req, res) => {
    
    const id = Number(req.params.id)
    const contact = contacts.find(contact => contact.id === id)
    
    res.json({ contact })
})

app.delete('/contacts/:id', (req, res) => {

    const id = Number(req.params.id)
    const contact = contacts.filter(contacts => contacts.id === id)
    const index = contacts.indexOf(contact)

    const deletedContact = contacts.splice(index, 1)
  
    res.json({contact: deletedContact})
})

app.put('/contacts/:id', (req, res) => {
    const updateContact = req.body
    const id = Number(req.params.id)
    updateContact.id = id

    const contact = contacts.find(contact => contact.id === id)
    

    res.json({ contact })
})


// delete => filter the array etc.

//Start up our server
const port = 3030
app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}/`)
})