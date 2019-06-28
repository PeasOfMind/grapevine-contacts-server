"use strict";

const express = require('express');
const router = express.Router();

const { Contact } = require('./models');

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

router.get("/contacts/:id", (req, res) => {
  Contact.findById(req.params.id)
  .then(contact => res.json(contact.serialize()))
  .catch(() => res.status(404).json({error: 'contact not found'}));
});

router.get("/search/:keywords", (req, res) => {
  // not case sensitive
  const searchTerm = req.params.keywords;
  Contact.find({ $text: { $search: searchTerm }})
  .then(searchArray => {
    if (searchArray.length) {
      return res.json(searchArray.map(result => result.serialize()));
    } else return res.status(404).json({error: 'match not found'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: "Search could not be completed"});
  })
});

router.post("/contacts", (req, res) => {
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
  });
});

router.put("/contacts/relation/:id", (req, res) => {
  // edit contact
  if (req.body.relatedPerson && req.body.relationType) {
    const newRelation = {
      relatedPerson: req.body.relatedPerson,
      relationType: req.body.relationType
    };

    Contact.findById(req.params.id)
    .then(contact => {
      contact.relationships.push(newRelation);
      contact.save();
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "Relation could not be saved"})
    });
  }
});

module.exports = {router};
