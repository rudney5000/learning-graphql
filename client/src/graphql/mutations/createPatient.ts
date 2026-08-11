import gql from "graphql-tag";

export const CREATE_PATIENT = gql`
    mutation CreatePatient($input: CreatePatientInput!) {
        createPatient(input: $input) {
            id
            firstName
            lastName
        }
    }
`