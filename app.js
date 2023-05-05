const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3023

const admin = require('firebase-admin');
const serviceAccount = require('./FireStoreLogin.json');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  let db = admin.firestore();
 
  
// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

// Templating Engine
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

// Routes

const carsRouter = require('./src/routes/cars')


app.use('/', carsRouter)
app.use('/addacar', carsRouter)
app.use('/aboutus', carsRouter)
app.use('/filter', carsRouter)
app.use('/lookup', carsRouter)
app.use('/calculator', carsRouter)
app.use('/addcar', carsRouter)
app.use('/contact', carsRouter)
app.use('/post', carsRouter)
app.use('/buy', carsRouter)
app.use('/maintenance', carsRouter)

// Listen on port 5000
app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))