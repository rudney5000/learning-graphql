import gql from "graphql-tag";

export const DELETE_PATIENT = gql`
    mutation DeletePatient($id: ID!) {
        deletePatient(id: $id)
    }
`;