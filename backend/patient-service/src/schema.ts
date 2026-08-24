export const typeDefs = `#graphql
    type Patient {
        id: ID!
        firstName: String!
        lastName: String!
    }

    type Query {
        patients: [Patient!]!
        patient(id: ID!): Patient
    }

    input CreatePatientInput {
        firstName: String!
        lastName: String!
    }

    input UpdatePatientInput {
        firstName: String
        lastName: String
    }

    type Mutation {
        createPatient(input: CreatePatientInput!): Patient!
        updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
        deletePatient(id: ID!): Boolean!
    }
`