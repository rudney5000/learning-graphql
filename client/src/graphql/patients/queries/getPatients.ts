import gql from "graphql-tag";
import {PATIENT_FIELDS} from "../fragments/patient.ts";

export const GET_PATIENTS = gql`
    query GetPatients {
        patients {
            ...PatientFields
        }
    }
    ${PATIENT_FIELDS}
`;