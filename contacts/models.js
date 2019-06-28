"use strict";

const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  displayName: { type: String },
  petType: { type: String }
});

// Defines relationship of the 'relatedPerson' to the current person
const relationSchema = mongoose.Schema({
  relatedPerson: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  relationType: { type: String }
});

const contactSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  title: { type: String },
  company: { type: String },
  location: { type: String },
  pets: [petSchema],
  relationships: [relationSchema]
});

petSchema.methods.serialize = function() {
  return {
    displayName: this.displayName,
    type: this.petType
  };
};

relationSchema.methods.serialize = function() {
  return {
    id: this.relatedPerson,
    type: this.relationType
  };
};

contactSchema.methods.serialize = function() {
  return {
    id: this._id,
    displayName: this.displayName,
    title: this.title,
    company: this.company,
    location: this.location,
    pets: this.pets.map(pet => pet.serialize()),
    relationships: this.relationships.map(relation => relation.serialize())
  };
};

contactSchema.index({ "$**": "text" });

const Contact = mongoose.model("Contact", contactSchema);

// Contact.collection.dropIndexes(function(err, result) {
//   if (err) {
//       console.log('Error in dropping index!', err);
//   }
// });

module.exports = { Contact };
