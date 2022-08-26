//Include the express library
const express = require("express")
//Include the morgan middleware
const morgan = require("morgan")
//Include the cors middleware
const cors = require("cors")

//Create a new express application
const app = express()
const contacts = require("./contacts")
const meetings = require("./meetings.js")
const { request } = require("express")
app.use(express.json())

//Tell express we want to use the morgan library
app.use(morgan("dev"))
//Tell express we want to use the cors library
app.use(cors())


//Old Code
// app.get("/contacts", (req, res) => {
    
//     res.json({ contacts })
//    })

//Old Code
// function nextContactId() {
//     let nextId = 0
//     contacts.forEach(contact => {
//         if(contact.id > nextId)
//         nextId = contact.id
//     })
//     return(nextId + 1)
// }

//Retrive a list of contacts
app.get('/contacts', (req, res) => {
    let mappedContacts = contacts.map(contact => {
        return {
            ...contact,
            meetings: meetings.filter(m => m.contactId === contact.id)
        }
    })

    if (req.query.city) {
        mappedContacts = mappedContacts.filter(contact => contact.city === req.query.city)
    }

    if (req.query.emailType) {
        mappedContacts = mappedContacts.filter(contact => contact.type === req.query.emailType)
    }

    res.json({
        contacts: mappedContacts
    })
})

//Create a contact
app.post('/contacts', (req, res) => {
    const createdContact = {
        ...req.body,
        id: contacts.length + 1
    }

    contacts.push(createdContact)

    res.status(201).json({
        contact: {
            ...createdContact,
            meetings: []
        }
    })
})

//Get a single contact by ID
app.get('/contacts/:id', (req, res) => {
    
    const id = Number(req.params.id)
    const contactFound = contacts.find(contact => contact.id === id)
    
    res.json({ contact: {
            ...contactFound,
            meetings: []
        } })
})

//Old Code
// app.delete('/contacts/:id', (req, res) => {

//     const id = Number(req.params.id)
//     const contact = contacts.filter(contacts => contacts.id === id)
//     const index = contacts.indexOf(contact)

//     const deletedContact = contacts.splice(index, 1)
  
//     res.json({contact: deletedContact})
// })


//Delete a single contact by ID
app.delete('/contacts/:id', (req, res) => {
    const foundContact = contacts.find(c => c.id === Number(req.params.id))
    const index = contacts.indexOf(foundContact)

    contacts.splice(index, 1)

    res.status(201).json({
        contact: {
            ...foundContact,
            meetings: meetings.filter(m => m.contactId === foundContact.id)
        }
    })
})


//Old Code
// app.put('/contacts/:id', (req, res) => {
//     const updateContact = req.body
//     const id = Number(req.params.id)
//     updateContact.id = id

//     const contact = contacts.find(contact => contact.id === id)
    
//     res.json({ contact })
// })


// Update a contact by ID
app.put('/contacts/:id', (req, res) => {
    const oldContact = contacts.find(c => c.id === Number(req.params.id))
    const index = contacts.indexOf(oldContact)

    contacts.splice(index, 1, {...req.body, id: oldContact.id})

    const updatedContact = contacts.find(c => c.id === Number(req.params.id))
    console.log(contacts)
    res.status(201).json({
        contact: {
            ...updatedContact,
            meetings: meetings.filter(m => m.contactId === updatedContact.id)
        }
    })
})

app.get("/meetings", (req, res) => {
    res.json(meetings)
  })

//Get meetings for a specific contact
app.get("/contacts/:id/meetings", (req, res) => {
    const id = req.params.id
    const meetings = req.body
    const contact = contacts.find((contact) => contact.id === Number(req.params.id));
    const findMeeting = meetings.find((meeting) => meeting.id === Number(req.params.id));
    if(!contact.meetings) {
      contact.meetings = []
    }
    res.json({
        contact: {
        meetings: contact.meetings,
    }});
  });
  
//Create a meeting for a contact
app.post("/contacts/:id/meetings", (req, res) => {
    const id = req.params.id
    const createNewMeeting = req.body
  
    createNewMeeting.id = meetings.length +1
    createNewMeeting.contactId = id
  
    meetings.push(createNewMeeting)
    console.log(meetings)
  
    res.json({meeting: createNewMeeting})
  })

//Start up our server
const port = 3030
app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}/`)
})