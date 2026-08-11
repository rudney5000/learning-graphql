import gql from "graphql-tag";
import {PATIENT_FIELDS} from "../fragments/patient";

export const GET_PATIENT = gql`
    query GetPatient($id: ID!) {
        patient(id: $id) {
            ...PatientFields
            appointments {
                id
                reason
                scheduledAt
            }
        }
    }
    ${PATIENT_FIELDS}
`;