//Import Dependencies
require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const mongoose = require("mongoose")

//Connect Database
const DATABASE_URL = process.env.DATABASE_URL

//Establish Connection
mongoose.connect(DATABASE_URL) //this is what actually connects to the url

//Connection Events //this is what tells us if we are connected, disconnected, or if there's an error
mongoose.connection
.on("open", () => {console.log("connected to Mongo")})
.on("close", () => {console.log("Disconnected from Mongo")})
.on("error", (error) => {console.log(error)})

//Create Fruits Model
//destructure Schema and model into their own variables
// const Schema = mongoose.Schema
// const model = mongoose.model 
// the two above are the same thing as the one below
const {Schema, model} = mongoose

const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

//Model - object for interacting with the db
const Fruit = model("Fruit", fruitSchema)
















