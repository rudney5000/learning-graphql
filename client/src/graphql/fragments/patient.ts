import { gql } from "@apollo/client";

export const PATIENT_FIELDS = gql`
    fragment PatientFields on Patient {
        id
        firstName
        lastName
    }
`;
