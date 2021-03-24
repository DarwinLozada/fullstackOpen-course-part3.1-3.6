const mongoose = require("mongoose");

const returnCollectionDocuments = (model) => {
  const dataBaseQuery = model.find();

  return dataBaseQuery.then((result) => {
    if (result instanceof Error) console.log(err);
    return result;
  });
};

const logFormatedContacts = (contacts) => {
  console.log("Contacts:");
  contacts.forEach((contact) => {
    console.log(`${contact.name} ${contact.number}`);
  });
};

const createAndSaveNewContact = (name, number, Contact) => {
  const newContact = new Contact({
    name: name,
    number: number,
  });

  return newContact.save();
};

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@mycluster.tlvgl.mongodb.net/contacts-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

if (process.argv.length === 3) {
  returnCollectionDocuments(Contact).then((contacts) => {
    logFormatedContacts(contacts);
    mongoose.connection.close();
    process.exit(0);
  });
}

if (process.argv.length === 4) {
  console.log("You have to supply the number and the number of the contact");
  process.exit(1);
}

if (process.argv.length === 5) {
  const suppliedName = process.argv[3];
  const suppliedNumber = process.argv[4];

  createAndSaveNewContact(suppliedName, suppliedNumber, Contact)
    .then(() => {
      console.log("Contact Saved");
      mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
