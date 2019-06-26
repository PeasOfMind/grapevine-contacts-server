"use strict";

const express = require('express');
const router = express.Router();

const { Contact, Relation } = require('./models');

router.get('/contact/:id', (req, res) => {
  // get contact by id (Single Profile View)
});

router.get('/search/:string', (req, res) => {
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

router.post('/contact', (req, res) => {
  // add new contact
});

router.put('/contact/:id', (req, res) => {
  // edit contact
});

router.post('/relation/:id', (req, res) => {
  // add new relationship
});


