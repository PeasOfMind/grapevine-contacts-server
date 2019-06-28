"use strict";

const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  displayName: { type: String },
  petType: { type: String }
});

// Defines relationship of the 'relatedPerson' to the 'currentPerson'
const relationSchema = mongoose.Schema({
  currentPerson: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
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
  relationships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Relation" }]
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
    relationships: this.relationships
  };
};

contactSchema.pre('find', function(next){
  this.populate('relationships', ['relatedPerson', 'relationType']);
  next();
});

const Contact = mongoose.model("Contact", contactSchema);
const Relation = mongoose.model("Relation", relationSchema);

module.exports = { Contact, Relation };
