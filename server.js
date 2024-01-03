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

//Express App Object
const app = express()

// Register Middleware
app.use(morgan("dev")) //logger
app.use(methodOverride("_method")) // override form submissions
app.use(express.urlencoded({extended: true})) //parse urlencoded bodies
app.use(express.static("public")) // serve the files from the public folder


// Routes
app.get("/", (req, res) => {
    res.send("Is your refrigerator running? Then you better go CATCH IT")
})

// seed route
app.get("/fruits/seed", async (req, res) => {
    try {
      // array of starter fruits
      const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
      ];
  
      // Delete All Fruits
      await Fruit.deleteMany({});
  
      // Seed my starter fruits
      const fruits = await Fruit.create(startFruits);
  
      // send fruits as response
      res.json(fruits);
    } catch (error) {
      console.log(error.message);
      res.send("There was error, read logs for error details");
    }
  });     

// Index Route Get -> /fruits
app.get("/fruits", async (req, res) => {
    try {
      // get all fruits
      const fruits = await Fruit.find({});
      // render a template
      // fruits/index.ejs = views/fruits/index.ejs
      res.render("fruits/index.ejs", {fruits})
    } catch (error) {
      console.log("-----", error.message, "------");
      res.status(400).send("error, read logs for details");
    }
  });

//New
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs")
})


// Create Route (Post to /fruits)
app.post("/fruits", async (req, res) => {
  try {
    // check if readyToEat should be true
    // expression ? true : false (ternary operator)
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // create the fruit in the database
    await Fruit.create(req.body);
    // redirect back to main page
    res.redirect("/fruits");
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});


// Edit Route (Get to /fruits/:id/edit)
app.get("/fruits/:id/edit", async (req, res) => {
  try {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the db
    const fruit = await Fruit.findById(id);
    //render the template
    res.render("fruits/edit.ejs", { fruit });
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});

// The Update Route (Put to /fruits/:id)
app.put("/fruits/:id", async (req, res) => {
  try {
    // get the id
    const id = req.params.id;
    // update to ready to eat in req.body
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // update the fruit in the database
    await Fruit.findByIdAndUpdate(id, req.body);
    // res.redirect back to show page
    res.redirect(`/fruits/${id}`);
  } catch (error) {
    console.log("-----", error.message, "------");
    res.status(400).send("error, read logs for details");
  }
});













// The Show Route (Get to /fruits/:id)
app.get("/fruits/:id", async (req, res) => {
  try{
      // get the id from params
      const id = req.params.id

      // find the particular fruit from the database
      const fruit = await Fruit.findById(id)

      // render the template with the fruit
      res.render("fruits/show.ejs", {fruit})
  }catch(error){
      console.log("-----", error.message, "------")
      res.status(400).send("error, read logs for details")
  }
})


// Server Listener
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})



