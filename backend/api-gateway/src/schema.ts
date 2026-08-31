export const typeDefs = `#graphql
    type Appointment {
        id: ID!
        patientId: ID!,
        scheduledAt: String!
        reason: String!
        patient: Patient
    }

    type Patient {
        id: ID!
        firstName: String!
        lastName: String!
    }
    
    type AppointmentConnection {
        items: [Appointment!]!
        total: Int!
        hasNext: Boolean!
    }
    
    type Query {
        patients: [Patient!]!
        patient(id: ID!): Patient
        appointments(page: Int limit: Int): AppointmentConnection!
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
        patientId: ID
        scheduledAt: String
        reason: String
    }
    
    type Mutation {
        createPatient(input: CreatePatientInput!): Patient!
        updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
        deletePatient(id: ID!): Boolean!
        createAppointment(input: CreateAppointmentInput!): Appointment!
        updateAppointment(id: ID!, input: UpdateAppointmentInput!): Appointment!
        deleteAppointment(id: ID!): Boolean!
    }
`;