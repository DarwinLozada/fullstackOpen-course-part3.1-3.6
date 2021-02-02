const express = require("express");

const app = express();
const PORT = 3001;

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  res.send(
    `<div><h2>Phonebook has info for ${
      contacts.length
    } contacts</h2><p>${Date.now()}</p></div>`
  );
});

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`Server running on port ${PORT}`);
});
