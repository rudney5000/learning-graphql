import { gql } from "@apollo/client";

export const PATIENT_APPOINTMENTS = gql`
  fragment PatientAppointments on Patient {
    appointments {
      id
      reason
      scheduledAt
    }
  }
`;