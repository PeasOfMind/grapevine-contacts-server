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
  // can only search consecutive patterns of words, not each word individually
  // not case sensitive
  const searchTerm = req.params.keywords.toLowerCase();
  Contact.find({ $text: { $search: searchTerm }})
  // .then(contacts => {
  //   return contacts.filter(contact => {
  //     console.log('the contact is:', contact);
  //     console.log('contact values are:', Object.values(contact));
  //     return Object.values(contact).every(contactInfo => {
  //       console.log('contact info is:', contactInfo)
  //       //if this part of the contact info is a nonempty array
  //       if ((contactInfo === "pets" || contactInfo === "relationships") && contact[contactInfo] ) {
  //         const result = Object.values(contact[contactInfo]).every(value => {
  //           if (value.toLowerCase().includes(searchTerm)) return true
  //           else return false
  //         });
  //         if (result) return true
  //       } 
  //       else if (contactInfo.toLowerCase().includes(searchTerm)) return true
  //       else return false
  //     });
  //   })
  // })
  .then(searchArray => {
    if (searchArray.length) {
      return res.json(searchArray.map(result => result.serialize()));
    } else return res.status(404).json({error: 'match not found'});
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: "Search could not be completed"});
  })
  // cycle through full array of contacts
  // For each contact get array of Object.values
  // if array.includes() string, return single entity
  // else if pets array is not empty
  // cycle through pets array
  // else if relationships array is not empty
  // cycle through relationships
  // else return none
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

// router.post("/relation/:id", (req, res) => {
//   const requiredFields = ["relatedPerson", "relationType"];
//   // check if any required fields are missing
//   const missingField = requiredFields.find(field => !(field in req.body));
//   if (missingField) {
//     const message = `Missing '${missingField}' in request body`;
//     console.error(message);
//     return res.status(400).send(message);
//   }
//   console.log('no missing fields')

//   const newRelation = {
//     currentPerson: req.params.id,
//     relatedPerson: req.body.relatedPerson,
//     relationType: req.body.relationType
//   };

//   let contact;
  
//   Contact.findById(newRelation.currentPerson)
//   .then(foundContact => {
//     contact = foundContact;
//     console.log('the contact is:', contact);
//   })
//   .catch(err => {
//     console.error(err);
//     res.status(404).json({error: "Contact could not be found"})
//   })
//   .then(() => {
//     Relation.create(newRelation)
//     .then(relation => {
//       console.log('the relation is:', relation);
//       contact.relationships.push(relation);
//       contact.save();
//       res.status(204).end()
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: "Relation could not be saved"})
//     });
//   })

// });

module.exports = {router};