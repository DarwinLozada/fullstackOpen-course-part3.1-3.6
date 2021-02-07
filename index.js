const express = require("express");
const app = express();
const morgan = require("morgan");

const PORT = 3001;

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

morgan.token("data", (req, res) => {
  return JSON.stringify(req.body);
});

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---------");
  next();
};

app.use(express.json());
// app.use(requestLogger);
app.use(morgan("tiny"));
app.use(morgan(":data"));

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
  const date = new Date();
  res.send(
    `<div><p>Phonebook has info for ${contacts.length} contacts</p><p>${date}</p></div>`
  );
});

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.post("/api/contacts", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "not all the contacts credentials in the request",
    });
  }

  if (contacts.find((contact) => contact.name === body.name)) {
    return res.status(400).json({
      error: "There is alredy a contact with this name",
    });
  }
  const contact = {
    id: Date.now(),
    name: body.name,
    number: body.number,
  };

  contacts = contacts.concat(contact);
  res.json(contacts);
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`Server running on port ${PORT}`);
});

app.use(unknownEndPoint);
