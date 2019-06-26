"use strict";

const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  displayName: { type: String },
  petType: { type: String }
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

const Contact = mongoose.model("Contact", contactSchema);

// Defines relationship of the 'relatedPerson' to the 'currentPerson'
const relationSchema = mongoose.Schema({
  currentPerson: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  relatedPerson: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  relationType: { type: String }
});

petSchema.methods.serialize = () => {
  return {
    displayName: this.displayName,
    type: this.petType
  }
}

relationSchema.methods.serialize = () => {
  return {
    id: this.relatedPerson,
    type: relationType 
  }
}

contactSchema.methods.serialize = () => {
  return {
    id: this._id,
    displayName: this.displayName,
    title: this.title,
    company: this.company,
    location: this.location,
    pets: this.pets.map(pet => pet.serialize()),
    relationships: this.relationships.map(relation => relation.serialize())
  }
}

const Relation = mongoose.model("Relation", relationSchema);

module.exports = { Contact, Relation }
