// Grab environment variables from .env file
require('dotenv').config()

// Require packages
const express = require('express')
const {json} = require('body-parser')
const mongoose = require('mongoose')
// Using bluebird for better promises
mongoose.Promise = require('bluebird')

// Set up server
const app = express()
app.use(json())

// Set up db
mongoose.connect(process.env.DATABASE_URL, {useMongoClient: true})
.then(db => {
   console.log(db)
   app.set('db', db)
})

// Set up Schema (ideally in a different file) 
const UserSchema = new mongoose.Schema({
   name: {type: String, required: true},
})

const User = mongoose.model('User', UserSchema)


app.get('/api/users', (req, res, next) => {
   User.find({})
   .then(result => {
      console.log(result)
      res.send(result)
   })
   .catch(err => {
      res.send(err)
   })
})
app.post('/api/users', (req, res, next) => {
   const user = new User(req.body)
   user.save()
   .then(result => {
      console.log(result)
      res.send(result)
   })
   .catch(err => {
      res.send(err)
   })
})
app.put('/api/users/:name', (req, res, next) => {
   User.findOneAndUpdate({name: req.params.name}, {$set: {name: req.body.newName}})
   .then(result => {
      res.send(result)
   })
   .catch(err => {
      res.send(err)
   })
})
app.delete('/api/users/:name', (req, res, next) => {
   User.findOneAndRemove({name: req.params.name})
   .then(result => {
      res.send(result)
   })
   .catch(err => {
      res.send(err)
   })
})
app.listen(process.env.PORT, () => {
   console.log(`Listening on port ${process.env.PORT}`)
})

