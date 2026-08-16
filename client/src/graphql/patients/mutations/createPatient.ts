import gql from "graphql-tag";
import {PATIENT_FIELDS} from "../fragments/patient.ts";

export const CREATE_PATIENT = gql` 
    mutation CreatePatient($input: CreatePatientInput!) { 
        createPatient(input: $input) { ...PatientFields } 
    } 
    ${PATIENT_FIELDS} 
`;