import gql from "graphql-tag";
import {PATIENT_FIELDS} from "../fragments/patient";

export const UPDATE_PATIENT = gql`
    mutation UpdatePatient(
        $id: ID!
        $input: UpdatePatientInput!
    ) {
        updatePatient(
            id: $id, 
            input: $input
        ) {
            ...PatientFields
        }
    }
    
    ${PATIENT_FIELDS}
`;