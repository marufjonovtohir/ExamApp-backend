const express = require ('express');
const  dotenv = require ('dotenv');
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const userRoute = require("./src/rotes/userRoute")
const leadRoute =require ("./src/rotes/leadRoute")

dotenv.config()
const app = express()

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({useTempFiles: true}))

app.use((req,res,next) =>{
    res.set({
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': 'Content-Type, access_token',
        'Access-Control-Allow-Methods': 'GET, POST,PUT,DELETE',
    })

    next()
})

app.get('/', (req, res) => {
    res.status(200).json('Home Page')
  })
//routes
app.use('/',userRoute)
app.use('/',leadRoute)

const start = async () => {
    try {
        await mongoose.connect(MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch (error) {
        console.error(error)
    }
}

start()