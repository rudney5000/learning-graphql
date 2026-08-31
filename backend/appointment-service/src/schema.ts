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
        appointments: [Appointment!]!
    }
    
    type AppointmentConnection {
        items: [Appointment!]!
        total: Int!
        hasNext: Boolean!
    }
    
    type Query {
        appointments(page: Int limit: Int): AppointmentConnection!
        appointment(id: ID!): Appointment
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
        createAppointment(input: CreateAppointmentInput!): Appointment!
        updateAppointment(id: ID!, input: UpdateAppointmentInput!): Appointment!
        deleteAppointment(id: ID!): Boolean!
    }
`;