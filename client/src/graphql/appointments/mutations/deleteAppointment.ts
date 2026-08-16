import gql from "graphql-tag";

export const DELETE_APPOINTMENT = gql`
    mutation DeleteAppointment($id: ID!) {
        deleteAppointment(id: $id)
    }
`;