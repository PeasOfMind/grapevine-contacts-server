'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const contactsSchema = require('./schema.js')

const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(morgan('common'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use('/graphql', graphqlHTTP({
  schema: contactsSchema,
  graphiql: true
}));

app.listen(PORT, () => console.log(`Running GraphQL server on port ${port}`));