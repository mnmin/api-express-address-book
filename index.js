//Include the express library
const express = require("express")
//Include the morgan middleware
const morgan = require("morgan")
//Include the cors middleware
const cors = require("cors")

const contacts = require("./contacts")

//Create a new express application
const app = express()

//Tell express we want to use the morgan library
app.use(morgan("dev"))
//Tell express we want to use the cors library
app.use(cors())

app.get("/contacts", (req, res) => {
    
    res.json({contacts})
   })






//Start up our server
const port = 3030
app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}/`)
})