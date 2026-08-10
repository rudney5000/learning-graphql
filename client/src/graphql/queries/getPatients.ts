import gql from "graphql-tag";

export const GET_PATIENTS = gql`
    query GetPatients {
        patients {
            id
            firstName
            lastName
        }
    }
`;