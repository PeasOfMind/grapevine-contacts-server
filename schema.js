const { buildSchema } = require('graphql');
 
// //Sample data
// const contacts = [{
//   id: 1,
//   displayName: "Kenneth Lai",
//   title: "Software Engineer",
//   company: "Grapevine",
//   location: "New York City",
//   pets: [],
//   relationships: [{ id: 5, type: "Girlfriend" }]
// }]

const contactSchema = buildSchema(`
  type Contact {
    id: ID!
    displayName: String!
    title: String
    company: String
    location: String
    pets: [Pet]
    relationships: [Relation]
  }
`)

// Defines the relationship of the 'relatedPerson' to the 'currentPerson'
const relationSchema = buildSchema(`
  type Relation {
    currentPerson: Contact!
    relatedPerson: Contact!
    type: String!
  }
`)

const petSchema = buildSchema(`
  type Pet {
    displayName: String
    type: String
  }
`)

module.exports = contactSchema;