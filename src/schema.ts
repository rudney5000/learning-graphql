export const typeDefs = `#graphql
    type User {
        id: ID!
        role: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Patient {
        id: ID!
        firstName: String!
        lastName: String!
        appointments: [Appointment!]!
    }

    type Appointment {
        id: ID!
        patientId: ID!,
        scheduledAt: String!
        reason: String!
    }

    type Query {
        me: User!
        patients: [Patient!]!
        patient(id: ID!): Patient
        
        appointments: [Appointment!]!
        appointment(id: ID!): Appointment
    }

    input CreatePatientInput {
        firstName: String!
        lastName: String!
    }


    input UpdatePatientInput {
        firstName: String
        lastName: String
    }

    input CreateAppointmentInput {
        patientId: ID!
        scheduledAt: String!
        reason: String!
    }
    
    input UpdateAppointmentInput {
        patientId: ID!
        scheduledAt: String!
        reason: String!
    }

    type Mutation {
        login(username: String, password: String): AuthPayload!
        createPatient(input: CreatePatientInput!): Patient!
        updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
        deletePatient(id: ID!): Boolean!
        
        createAppointment(input: CreateAppointmentInput!): Appointment!
        updateAppointment(id: ID!, input: UpdateAppointmentInput!): Appointment!
        deleteAppointment(id: ID!): Boolean!
    }
`;