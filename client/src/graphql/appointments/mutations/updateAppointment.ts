import gql from "graphql-tag";
import {APPOINTMENT_FIELDS} from "../fragments/appointment";

export const UPDATE_APPOINTMENT = gql`
    mutation UpdateAppointment(
        $id: ID!
        $input: UpdateAppointmentInput!
    ) {
        updateAppointment(
            id: $id, 
            input: $input
        ) {
            ...AppointmentFields
        }
    }
    
    ${APPOINTMENT_FIELDS}
`;