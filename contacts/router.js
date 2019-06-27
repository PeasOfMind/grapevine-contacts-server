"use strict";

const express = require('express');
const router = express.Router();

const { Contact, Relation } = require('./models');

router.get("/contacts", (req, res) => {
  Contact.find()
  .then(contacts => {
    res.json({contacts: contacts.map(contact => contact.serialize())});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Could not retrieve contacts'})
  })
});

router.get("/contact/:id", (req, res) => {
  // get contact by id (Single Profile View)
});

router.get("/search/:string", (req, res) => {
  // search page
  // cycle through full array of contacts
  // For each contact get array of Object.values
  // if array.includes() string, return single entity
  // else if pets array is not empty
  // cycle through pets array
  // else if relationships array is not empty
  // cycle through relationships
  // else return none
});

router.post("/contact", (req, res) => {
  const requiredFields = ["displayName"];
  // check if any required fields are missing
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    const message = `Missing '${missingField}' in request body`;
    console.error(message);
    return res.status(400).send(message);
  }

  // fill in optionalFields if present
  const newContact = { displayName: req.body.displayName };
  const optionalFields = ["title", "company", "location"];
  optionalFields.map(field => {
    if (req.body[field]) newContact[field] = req.body[field]; 
  });

  // add pets if present
  newContact.pets = req.body.pets ? JSON.parse(JSON.stringify(req.body.pets)) : [];

  Contact.create(newContact)
  .then(contact => res.status(201).json(contact.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: "Contact could not be saved"})
  })
});

router.put("/contact/:id", (req, res) => {
  // edit contact
});

router.post("/relation/:id", (req, res) => {
  // add new relationship
});

module.exports = {router};