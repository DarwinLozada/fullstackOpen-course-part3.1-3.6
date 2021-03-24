//Env variable library
require("dotenv").config();

//Middlewares
const middlewares = require("./middlewares");

//Server dependencies
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//Database model

const Contact = require("./models/contact");

const app = express();
app.use(express.static("build"));

//MongoDB Database setup
const PORT = process.env.PORT || 3001;

//Middlewares

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(morgan(":data"));

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<div><p>Phonebook has info for ${contacts.length} contacts</p><p>${date}</p></div>`
  );
});

app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.get("/api/contacts/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(400).end();
      }
    })
    .catch((err) => next(err));
});

app.post("/api/contacts", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "not all the contacts credentials in the request",
    });
  }

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  });

  newContact.save().then((contact) => {
    console.log(`Contact ${body.name} saved`);
    res.json(contact);
  });
});

//Update the contact number
app.put("/api/contacts/:id", (req, res, next) => {
  Contact.findByIdAndUpdate(
    req.params.id,
    { number: req.body.number },
    { new: true }
  )
    .then((updatedContact) => {
      console.log(updatedContact);
    })
    .catch((err) => next(err));
});

app.delete("/api/contacts/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`Server running on port ${PORT}`);
});

//Middleware for no route match
app.use(middlewares.unknownEndPoint);

//Middleware for general error handling
app.use(middlewares.errorHandler);
