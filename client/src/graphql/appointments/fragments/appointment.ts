import { gql } from "@apollo/client";

export const APPOINTMENT_FIELDS = gql`
    fragment AppointmentFields on Appointment {
        id
        patientId
        scheduledAt
        reason
    }
`;